using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Duty.Dtos;

namespace GiaoLy.Application.Duty.Contracts;

public interface IDutyService
{
    Task<Result<List<DutyAssignmentDto>>> GetAssignmentsAsync(
        Guid? classRoomId,
        DateOnly? fromDate,
        DateOnly? toDate,
        Guid? userId,
        CancellationToken ct = default);

    Task<Result<DutyAssignmentDto>> GetAssignmentByIdAsync(Guid id, CancellationToken ct = default);
    Task<Result<DutyAssignmentDto>> CreateAssignmentAsync(CreateDutyAssignmentRequest request, CancellationToken ct = default);
    Task<Result<DutyAssignmentDto>> UpdateAssignmentAsync(Guid id, UpdateDutyAssignmentRequest request, CancellationToken ct = default);
    Task<Result<bool>> DeleteAssignmentAsync(Guid id, CancellationToken ct = default);
}
