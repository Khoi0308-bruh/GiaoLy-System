using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Common;
using GiaoLy.Application.Stats.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class StatsController : ControllerBase
{
    private readonly IPublicStatsService _statsService;

    public StatsController(IPublicStatsService statsService)
    {
        _statsService = statsService;
    }

    [HttpGet("api/v1/public/stats")]
    [HttpGet("api/Stats/public")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicStats(CancellationToken ct)
    {
        var result = await _statsService.GetPublicStatsAsync(ct);
        return result.ToActionResult();
    }
}
