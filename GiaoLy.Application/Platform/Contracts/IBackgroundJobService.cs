using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Platform.Dtos;

namespace GiaoLy.Application.Platform.Contracts;

public interface IBackgroundJobService
{
    Task<Result<PagedJobRunsResultDto>> GetJobRunsAsync(int page = 1, int pageSize = 20, string? jobName = null, CancellationToken ct = default);
    Task<Result<RunJobResultDto>> RunJobAsync(string jobName, string triggeredBy, CancellationToken ct = default);
}
