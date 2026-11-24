using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Platform.Dtos;

namespace GiaoLy.Application.Platform.Contracts;

public interface IDataMigrationService
{
    Task<Result<MigrationPhaseResultDto>> RunPhaseAsync(int phase, CancellationToken ct = default);
    Task<Result<ReconciliationReportDto>> GetReconciliationReportAsync(CancellationToken ct = default);

    /// <summary>Chuẩn hoá lại FullNameNormalized cho toàn bộ đoàn sinh (dữ liệu ETL cũ lưu HOA-còn-dấu).</summary>
    Task<Result<NormalizedStudentNamesResultDto>> NormalizeStudentNamesAsync(CancellationToken ct = default);
}
