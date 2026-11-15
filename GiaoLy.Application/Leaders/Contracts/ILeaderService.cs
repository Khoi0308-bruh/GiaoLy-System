using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Leaders.Dtos;

namespace GiaoLy.Application.Leaders.Contracts;

public interface ILeaderService
{
    Task<Result<List<PublicLeaderDto>>> GetPublicLeadersAsync(CancellationToken ct = default);
    Task<Result<List<LeaderDto>>> GetAllLeadersAsync(int? branchId, bool? isActive, CancellationToken ct = default);
    Task<Result<LeaderDto>> GetLeaderByIdAsync(Guid id, CancellationToken ct = default);
    Task<Result<LeaderDto>> CreateLeaderAsync(CreateLeaderRequest request, CancellationToken ct = default);
    Task<Result<LeaderDto>> UpdateLeaderAsync(Guid id, UpdateLeaderRequest request, CancellationToken ct = default);
    Task<Result<bool>> DeleteLeaderAsync(Guid id, CancellationToken ct = default);
}
