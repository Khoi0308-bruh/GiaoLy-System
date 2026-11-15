using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Audit.Contracts;
using GiaoLy.Application.Audit.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;

    public AuditLogsController(IAuditLogService auditLogService)
    {
        _auditLogService = auditLogService;
    }

    [HttpGet("api/v1/audit-logs")]
    [RequirePermission(Permissions.Platform.AuditView)]
    public async Task<IActionResult> GetAuditLogs([FromQuery] AuditLogFilterRequest filter, CancellationToken ct)
    {
        var result = await _auditLogService.GetAuditLogsAsync(filter, ct);
        return result.ToActionResult();
    }
}
