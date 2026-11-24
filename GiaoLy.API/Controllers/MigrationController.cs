using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Platform.Contracts;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class MigrationController : ControllerBase
{
    private readonly IDataMigrationService _migrationService;

    public MigrationController(IDataMigrationService migrationService)
    {
        _migrationService = migrationService;
    }

    [HttpPost("api/v1/system/migration/run-phase/{phase:int}")]
    [RequirePermission(Permissions.Platform.SettingsManage)]
    public async Task<IActionResult> RunPhase(int phase, CancellationToken ct)
    {
        var result = await _migrationService.RunPhaseAsync(phase, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/system/migration/reconciliation")]
    [RequirePermission(Permissions.Platform.SettingsView)]
    public async Task<IActionResult> GetReconciliationReport(CancellationToken ct)
    {
        var result = await _migrationService.GetReconciliationReportAsync(ct);
        return result.ToActionResult();
    }

    /// <summary>
    /// Dữ liệu nạp từ ETL cũ lưu FullNameNormalized dạng HOA-còn-dấu; endpoint này tính lại
    /// bằng đúng hàm chuẩn hoá của ứng dụng. Chạy lại nhiều lần vô hại.
    /// </summary>
    [HttpPost("api/v1/system/maintenance/normalize-student-names")]
    [RequirePermission(Permissions.Platform.SettingsManage)]
    public async Task<IActionResult> NormalizeStudentNames(CancellationToken ct)
    {
        var result = await _migrationService.NormalizeStudentNamesAsync(ct);
        return result.ToActionResult();
    }
}
