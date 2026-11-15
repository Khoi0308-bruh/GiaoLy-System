using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Bouquets.Dtos;
using GiaoLy.Application.Common.Results;

namespace GiaoLy.Application.Bouquets.Contracts;

public interface IBouquetService
{
    Task<Result<List<SpiritualBouquetDto>>> GetClassBouquetsAsync(Guid classRoomId, CancellationToken ct = default);
    Task<Result<SpiritualBouquetDto>> RecordBouquetAsync(Guid classRoomId, RecordBouquetRequest request, CancellationToken ct = default);
    Task<Result<SpiritualBouquetDto>> ReverseBouquetAsync(Guid bouquetId, ReverseBouquetRequest request, CancellationToken ct = default);
    Task<Result<List<BouquetLeaderboardEntryDto>>> GetLeaderboardAsync(Guid classRoomId, CancellationToken ct = default);
}
