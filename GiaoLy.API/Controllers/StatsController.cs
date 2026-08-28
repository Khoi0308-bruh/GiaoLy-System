using GiaoLy.Domain.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMemoryCache _cache;

    public StatsController(AppDbContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    /// <summary>
    /// Lấy thống kê chung cho trang chủ public.
    /// Dữ liệu được cache 15 phút để giảm tải CSDL.
    /// </summary>
    [HttpGet("public")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicStats()
    {
        const string cacheKey = "PublicHomePageStats";

        if (!_cache.TryGetValue(cacheKey, out object? cachedStats))
        {
            var studentCount = await _context.Students.CountAsync();
            var activeClassCount = await _context.AcademicYears.CountAsync(x => x.IsActive);
            var certificateCount = await _context.Certificates.CountAsync();

            cachedStats = new
            {
                studentCount,
                activeClassCount,
                certificateCount
            };

            // Lưu cache 15 phút
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(15));
            
            _cache.Set(cacheKey, cachedStats, cacheOptions);
        }

        return Ok(cachedStats);
    }
}
