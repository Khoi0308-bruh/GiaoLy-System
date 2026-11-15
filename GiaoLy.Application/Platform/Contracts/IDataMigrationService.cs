using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Platform.Dtos;

namespace GiaoLy.Application.Platform.Contracts;

public interface IDataMigrationService
{
    Task<Result<MigrationPhaseResultDto>> RunPhaseAsync(int phase, CancellationToken ct = default);
    Task<Result<ReconciliationReportDto>> GetReconciliationReportAsync(CancellationToken ct = default);
}
