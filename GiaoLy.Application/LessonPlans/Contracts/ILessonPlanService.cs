using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.LessonPlans.Dtos;

namespace GiaoLy.Application.LessonPlans.Contracts;

public interface ILessonPlanService
{
    Task<Result<List<LessonPlanDto>>> GetLessonPlansAsync(
        Guid? classRoomId,
        int? branchId,
        string? visibility,
        CancellationToken ct = default);

    Task<Result<LessonPlanDetailDto>> GetLessonPlanByIdAsync(Guid id, CancellationToken ct = default);
    Task<Result<LessonPlanDetailDto>> CreateLessonPlanAsync(CreateLessonPlanRequest request, CancellationToken ct = default);
    Task<Result<LessonPlanDetailDto>> UpdateLessonPlanAsync(Guid id, UpdateLessonPlanRequest request, CancellationToken ct = default);
    Task<Result<bool>> DeleteLessonPlanAsync(Guid id, CancellationToken ct = default);
}
