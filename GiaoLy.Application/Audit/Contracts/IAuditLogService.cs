using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Audit.Dtos;
using GiaoLy.Application.Common.Results;

namespace GiaoLy.Application.Audit.Contracts;

public interface IAuditLogService
{
    Task<Result<PagedAuditLogResultDto>> GetAuditLogsAsync(AuditLogFilterRequest filter, CancellationToken ct = default);
}
