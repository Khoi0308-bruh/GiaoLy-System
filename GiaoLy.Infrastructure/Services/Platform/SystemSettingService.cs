using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Platform.Contracts;
using GiaoLy.Application.Platform.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace GiaoLy.Infrastructure.Services.Platform;

public class SystemSettingService : ISystemSettingService
{
    private readonly AppDbContext _context;
    private readonly IMemoryCache _cache;
    private const string SettingsCacheKey = "All_SystemSettings_Cache";

    public SystemSettingService(AppDbContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Result<List<SystemSettingDto>>> GetAllSettingsAsync(CancellationToken ct = default)
    {
        if (_cache.TryGetValue(SettingsCacheKey, out List<SystemSettingDto>? cached) && cached != null)
        {
            return Result.Ok(cached);
        }

        var dbSettings = await _context.SystemSettings.AsNoTracking().ToListAsync(ct);
        var dbDict = dbSettings.ToDictionary(s => s.Key, StringComparer.OrdinalIgnoreCase);

        var result = new List<SystemSettingDto>();

        // Merge defaults
        foreach (var def in SystemSettingsRules.DefaultSettings)
        {
            if (dbDict.TryGetValue(def.Key, out var existing))
            {
                result.Add(new SystemSettingDto
                {
                    Key = existing.Key,
                    Value = existing.Value,
                    Description = existing.Description ?? def.Value.Description,
                    UpdatedAt = existing.UpdatedAt,
                    UpdatedBy = existing.UpdatedBy
                });
            }
            else
            {
                result.Add(new SystemSettingDto
                {
                    Key = def.Key,
                    Value = def.Value.DefaultValue,
                    Description = def.Value.Description,
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = null
                });
            }
        }

        // Add any extra custom settings in DB
        foreach (var s in dbSettings)
        {
            if (!SystemSettingsRules.DefaultSettings.ContainsKey(s.Key))
            {
                result.Add(new SystemSettingDto
                {
                    Key = s.Key,
                    Value = s.Value,
                    Description = s.Description,
                    UpdatedAt = s.UpdatedAt,
                    UpdatedBy = s.UpdatedBy
                });
            }
        }

        _cache.Set(SettingsCacheKey, result, TimeSpan.FromMinutes(10));
        return Result.Ok(result);
    }

    public async Task<Result<SystemSettingDto>> GetSettingByKeyAsync(string key, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(key))
            return Result.Validation<SystemSettingDto>("Khóa cấu hình không được để trống.", nameof(key));

        var setting = await _context.SystemSettings.AsNoTracking().FirstOrDefaultAsync(s => s.Key == key.Trim(), ct);
        if (setting != null)
        {
            return Result.Ok(new SystemSettingDto
            {
                Key = setting.Key,
                Value = setting.Value,
                Description = setting.Description,
                UpdatedAt = setting.UpdatedAt,
                UpdatedBy = setting.UpdatedBy
            });
        }

        if (SystemSettingsRules.DefaultSettings.TryGetValue(key.Trim(), out var def))
        {
            return Result.Ok(new SystemSettingDto
            {
                Key = key.Trim(),
                Value = def.DefaultValue,
                Description = def.Description,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = null
            });
        }

        return Result.NotFound<SystemSettingDto>($"Không tìm thấy cấu hình với khóa '{key}'.");
    }

    public async Task<Result<SystemSettingDto>> UpdateSettingAsync(string key, UpdateSystemSettingRequest request, Guid? currentUserId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(key))
            return Result.Validation<SystemSettingDto>("Khóa cấu hình không được để trống.", nameof(key));

        var cleanKey = key.Trim();
        var (isValid, errorMessage) = SystemSettingsRules.ValidateSettingValue(cleanKey, request.Value);
        if (!isValid)
        {
            return Result.Validation<SystemSettingDto>(errorMessage ?? "Giá trị cấu hình không hợp lệ.", nameof(request.Value));
        }

        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == cleanKey, ct);
        var description = setting?.Description;

        if (string.IsNullOrEmpty(description) && SystemSettingsRules.DefaultSettings.TryGetValue(cleanKey, out var def))
        {
            description = def.Description;
        }

        if (setting == null)
        {
            setting = new SystemSetting
            {
                Key = cleanKey,
                Value = request.Value,
                Description = description,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = currentUserId
            };
            _context.SystemSettings.Add(setting);
        }
        else
        {
            setting.Value = request.Value;
            setting.UpdatedAt = DateTime.UtcNow;
            setting.UpdatedBy = currentUserId;
        }

        await _context.SaveChangesAsync(ct);
        _cache.Remove(SettingsCacheKey);

        return Result.Ok(new SystemSettingDto
        {
            Key = setting.Key,
            Value = setting.Value,
            Description = setting.Description,
            UpdatedAt = setting.UpdatedAt,
            UpdatedBy = setting.UpdatedBy
        });
    }
}
