using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Camps.Dtos;
using GiaoLy.Application.Common.Results;

namespace GiaoLy.Application.Camps.Contracts;

public interface ICampService
{
    Task<Result<List<CampEventDto>>> GetEventsAsync(int? branchId, Guid? academicYearId, CancellationToken ct = default);
    Task<Result<CampEventDto>> GetEventByIdAsync(Guid id, CancellationToken ct = default);
    Task<Result<CampEventDto>> CreateEventAsync(CreateCampEventRequest request, CancellationToken ct = default);
    Task<Result<CampEventDto>> UpdateEventAsync(Guid id, UpdateCampEventRequest request, CancellationToken ct = default);
    Task<Result<bool>> DeleteEventAsync(Guid id, CancellationToken ct = default);

    Task<Result<List<CampRegistrationDto>>> GetRegistrationsAsync(Guid eventId, CancellationToken ct = default);
    Task<Result<CampRegistrationDto>> RegisterStudentAsync(Guid eventId, CreateCampRegistrationRequest request, CancellationToken ct = default);
    Task<Result<CampRegistrationDto>> UpdateRegistrationAsync(Guid eventId, Guid registrationId, UpdateCampRegistrationRequest request, CancellationToken ct = default);
    Task<Result<bool>> CancelRegistrationAsync(Guid eventId, Guid registrationId, CancellationToken ct = default);

    Task<Result<CampPaymentDto>> RecordPaymentAsync(Guid registrationId, RecordCampPaymentRequest request, CancellationToken ct = default);
    Task<Result<CampPaymentDto>> ReversePaymentAsync(Guid paymentId, ReverseCampPaymentRequest request, CancellationToken ct = default);
    Task<Result<CampFinanceSummaryDto>> GetFinanceSummaryAsync(Guid eventId, CancellationToken ct = default);
}
