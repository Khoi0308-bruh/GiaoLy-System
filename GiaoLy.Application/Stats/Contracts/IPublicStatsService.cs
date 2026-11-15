using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Stats.Dtos;

namespace GiaoLy.Application.Stats.Contracts;

public interface IPublicStatsService
{
    Task<Result<PublicStatsDto>> GetPublicStatsAsync(CancellationToken ct = default);
}
