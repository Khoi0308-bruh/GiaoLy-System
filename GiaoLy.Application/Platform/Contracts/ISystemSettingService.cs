using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Platform.Dtos;

namespace GiaoLy.Application.Platform.Contracts;

public interface ISystemSettingService
{
    Task<Result<List<SystemSettingDto>>> GetAllSettingsAsync(CancellationToken ct = default);
    Task<Result<SystemSettingDto>> GetSettingByKeyAsync(string key, CancellationToken ct = default);
    Task<Result<SystemSettingDto>> UpdateSettingAsync(string key, UpdateSystemSettingRequest request, Guid? currentUserId, CancellationToken ct = default);
}
