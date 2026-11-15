using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Announcements.Dtos;
using GiaoLy.Application.Common.Results;

namespace GiaoLy.Application.Announcements.Contracts;

public interface IAnnouncementService
{
    Task<Result<List<AnnouncementDto>>> GetPublicAnnouncementsAsync(CancellationToken ct = default);
    Task<Result<List<AnnouncementDto>>> GetMyAnnouncementsAsync(int? branchId, Guid? classRoomId, CancellationToken ct = default);
    Task<Result<AnnouncementDto>> GetAnnouncementByIdAsync(Guid id, CancellationToken ct = default);
    Task<Result<AnnouncementDto>> CreateAnnouncementAsync(CreateAnnouncementRequest request, CancellationToken ct = default);
    Task<Result<AnnouncementDto>> UpdateAnnouncementAsync(Guid id, UpdateAnnouncementRequest request, CancellationToken ct = default);
    Task<Result<bool>> DeleteAnnouncementAsync(Guid id, CancellationToken ct = default);
}
