using GiaoLy.Domain.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
[AllowAnonymous]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _db;

    public HealthController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("api/v1/health")]
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new
        {
            status = "Healthy",
            timestamp = DateTime.UtcNow
        });
    }

    [HttpGet("api/v1/health/ready")]
    [HttpGet("health/ready")]
    public async Task<IActionResult> Ready(CancellationToken ct)
    {
        try
        {
            var canConnect = await _db.Database.CanConnectAsync(ct);
            if (!canConnect)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, new
                {
                    status = "Unhealthy",
                    database = "Disconnected",
                    timestamp = DateTime.UtcNow
                });
            }

            return Ok(new
            {
                status = "Ready",
                database = "Connected",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new
            {
                status = "Unhealthy",
                database = "Error",
                timestamp = DateTime.UtcNow
            });
        }
    }
}
