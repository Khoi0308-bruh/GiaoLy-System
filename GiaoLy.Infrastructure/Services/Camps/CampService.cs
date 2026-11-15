using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Camps.Contracts;
using GiaoLy.Application.Camps.Dtos;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Camps;

public class CampService : ICampService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly IScopeContext _scopeContext;

    public CampService(
        AppDbContext context,
        ICurrentUser currentUser,
        IScopeContext scopeContext)
    {
        _context = context;
        _currentUser = currentUser;
        _scopeContext = scopeContext;
    }

    private bool IsParishWide => _currentUser.ScopeType == "All" || _currentUser.IsInRole("Admin") || _currentUser.IsInRole("BanQuanTri");

    private bool CanAccessBranch(int branchId)
    {
        if (IsParishWide) return true;
        if (_currentUser.ScopeType == "Branch" && _currentUser.BranchId.HasValue)
        {
            return _currentUser.BranchId.Value == branchId;
        }
        return false;
    }

    public async Task<Result<List<CampEventDto>>> GetEventsAsync(int? branchId, Guid? academicYearId, CancellationToken ct = default)
    {
        var query = _context.CampEvents
            .AsNoTracking()
            .Include(e => e.Branch)
            .Include(e => e.AcademicYear)
            .Include(e => e.Registrations)
                .ThenInclude(r => r.Payments)
            .AsQueryable();

        if (branchId.HasValue)
        {
            query = query.Where(e => e.BranchId == branchId.Value);
        }
        else if (!IsParishWide && _currentUser.ScopeType == "Branch" && _currentUser.BranchId.HasValue)
        {
            query = query.Where(e => !e.BranchId.HasValue || e.BranchId == _currentUser.BranchId.Value);
        }

        if (academicYearId.HasValue)
        {
            query = query.Where(e => e.AcademicYearId == academicYearId.Value);
        }

        var events = await query
            .OrderByDescending(e => e.StartDate)
            .ToListAsync(ct);

        var dtos = events.Select(e => new CampEventDto
        {
            Id = e.Id,
            Name = e.Name,
            StartDate = e.StartDate,
            EndDate = e.EndDate,
            Location = e.Location,
            Fee = e.Fee,
            Description = e.Description,
            BranchId = e.BranchId,
            BranchName = e.Branch?.Name,
            AcademicYearId = e.AcademicYearId,
            AcademicYearName = e.AcademicYear?.Name,
            RegistrationDeadline = e.RegistrationDeadline,
            TotalRegistrations = e.Registrations.Count(r => r.Status == CampRules.StatusRegistered),
            TotalCollected = e.Registrations.SelectMany(r => r.Payments).Sum(p => p.Amount)
        }).ToList();

        return Result.Ok(dtos);
    }

    public async Task<Result<CampEventDto>> GetEventByIdAsync(Guid id, CancellationToken ct = default)
    {
        var e = await _context.CampEvents
            .AsNoTracking()
            .Include(x => x.Branch)
            .Include(x => x.AcademicYear)
            .Include(x => x.Registrations)
                .ThenInclude(r => r.Payments)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (e == null)
            return Result.NotFound<CampEventDto>("Không tìm thấy sự kiện");

        if (e.BranchId.HasValue && !CanAccessBranch(e.BranchId.Value))
            return Result.Forbidden<CampEventDto>("Bạn không có quyền truy cập sự kiện thuộc ngành này");

        var dto = new CampEventDto
        {
            Id = e.Id,
            Name = e.Name,
            StartDate = e.StartDate,
            EndDate = e.EndDate,
            Location = e.Location,
            Fee = e.Fee,
            Description = e.Description,
            BranchId = e.BranchId,
            BranchName = e.Branch?.Name,
            AcademicYearId = e.AcademicYearId,
            AcademicYearName = e.AcademicYear?.Name,
            RegistrationDeadline = e.RegistrationDeadline,
            TotalRegistrations = e.Registrations.Count(r => r.Status == CampRules.StatusRegistered),
            TotalCollected = e.Registrations.SelectMany(r => r.Payments).Sum(p => p.Amount)
        };

        return Result.Ok(dto);
    }

    public async Task<Result<CampEventDto>> CreateEventAsync(CreateCampEventRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result.BadRequest<CampEventDto>(ErrorCodes.ValidationFailed, "Tên sự kiện không được để trống");

        if (!CampRules.ValidateDates(request.StartDate, request.EndDate))
            return Result.BadRequest<CampEventDto>(ErrorCodes.ValidationFailed, "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");

        if (!CampRules.ValidateFee(request.Fee))
            return Result.BadRequest<CampEventDto>(ErrorCodes.ValidationFailed, "Lệ phí không thể là số âm");

        if (request.BranchId.HasValue && !CanAccessBranch(request.BranchId.Value))
            return Result.Forbidden<CampEventDto>("Bạn không có quyền tạo sự kiện cho ngành này");

        var campEvent = new CampEvent
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Location = request.Location.Trim(),
            Fee = Math.Round(request.Fee, 0),
            Description = request.Description?.Trim(),
            BranchId = request.BranchId,
            AcademicYearId = request.AcademicYearId,
            RegistrationDeadline = request.RegistrationDeadline,
            CreatedAt = DateTime.UtcNow
        };

        _context.CampEvents.Add(campEvent);
        await _context.SaveChangesAsync(ct);

        return await GetEventByIdAsync(campEvent.Id, ct);
    }

    public async Task<Result<CampEventDto>> UpdateEventAsync(Guid id, UpdateCampEventRequest request, CancellationToken ct = default)
    {
        var e = await _context.CampEvents.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (e == null)
            return Result.NotFound<CampEventDto>("Không tìm thấy sự kiện");

        if (e.BranchId.HasValue && !CanAccessBranch(e.BranchId.Value))
            return Result.Forbidden<CampEventDto>("Bạn không có quyền chỉnh sửa sự kiện của ngành này");

        if (request.BranchId.HasValue && !CanAccessBranch(request.BranchId.Value))
            return Result.Forbidden<CampEventDto>("Bạn không thể chuyển sự kiện sang ngành bạn không phụ trách");

        if (string.IsNullOrWhiteSpace(request.Name))
            return Result.BadRequest<CampEventDto>(ErrorCodes.ValidationFailed, "Tên sự kiện không được để trống");

        if (!CampRules.ValidateDates(request.StartDate, request.EndDate))
            return Result.BadRequest<CampEventDto>(ErrorCodes.ValidationFailed, "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");

        if (!CampRules.ValidateFee(request.Fee))
            return Result.BadRequest<CampEventDto>(ErrorCodes.ValidationFailed, "Lệ phí không thể là số âm");

        e.Name = request.Name.Trim();
        e.StartDate = request.StartDate;
        e.EndDate = request.EndDate;
        e.Location = request.Location.Trim();
        e.Fee = Math.Round(request.Fee, 0);
        e.Description = request.Description?.Trim();
        e.BranchId = request.BranchId;
        e.AcademicYearId = request.AcademicYearId;
        e.RegistrationDeadline = request.RegistrationDeadline;
        e.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return await GetEventByIdAsync(e.Id, ct);
    }

    public async Task<Result<bool>> DeleteEventAsync(Guid id, CancellationToken ct = default)
    {
        var e = await _context.CampEvents.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (e == null)
            return Result.NotFound<bool>("Không tìm thấy sự kiện");

        if (e.BranchId.HasValue && !CanAccessBranch(e.BranchId.Value))
            return Result.Forbidden<bool>("Bạn không có quyền xóa sự kiện này");

        // Rule: Only soft-delete events that have NO financial collections
        var hasPayments = await _context.CampPayments
            .AnyAsync(p => p.Registration.CampEventId == id, ct);

        if (hasPayments)
        {
            return Result.Failure<bool>(400, "CAMP_HAS_PAYMENTS", "Không thể xóa sự kiện đã có phát sinh thu phí. Vui lòng giữ lịch sử tài chính.");
        }

        e.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return Result.Ok(true);
    }

    public async Task<Result<List<CampRegistrationDto>>> GetRegistrationsAsync(Guid eventId, CancellationToken ct = default)
    {
        var campEvent = await _context.CampEvents
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == eventId, ct);

        if (campEvent == null)
            return Result.NotFound<List<CampRegistrationDto>>("Không tìm thấy sự kiện");

        if (campEvent.BranchId.HasValue && !CanAccessBranch(campEvent.BranchId.Value))
            return Result.Forbidden<List<CampRegistrationDto>>("Bạn không có quyền xem sự kiện này");

        var registrations = await _context.CampRegistrations
            .AsNoTracking()
            .Include(r => r.Student)
            .Include(r => r.RegisteredByUser)
            .Include(r => r.Payments)
                .ThenInclude(p => p.ReceivedByUser)
            .Where(r => r.CampEventId == eventId)
            .OrderBy(r => r.Student.FullName)
            .ToListAsync(ct);

        var dtos = registrations.Select(r =>
        {
            var payments = r.Payments.OrderBy(p => p.PaidOn).ThenBy(p => p.CreatedAt).ToList();
            var balance = CampRules.CalculateBalance(campEvent.Fee, payments.Select(p => p.Amount));

            return new CampRegistrationDto
            {
                Id = r.Id,
                CampEventId = r.CampEventId,
                CampEventName = campEvent.Name,
                EventFee = campEvent.Fee,
                StudentId = r.StudentId,
                StudentCode = r.Student.Code,
                StudentHolyName = r.Student.HolyName ?? string.Empty,
                StudentFullName = r.Student.FullName,
                TeamNumber = r.TeamNumber,
                Note = r.Note,
                Status = r.Status,
                RegisteredBy = r.RegisteredBy,
                RegisteredByName = r.RegisteredByUser?.FullName ?? string.Empty,
                CreatedAt = r.CreatedAt,
                TotalPaid = balance.TotalPaid,
                Remaining = balance.Remaining,
                IsOverpaid = balance.IsOverpaid,
                IsSettled = balance.IsSettled,
                Payments = payments.Select(p => new CampPaymentDto
                {
                    Id = p.Id,
                    RegistrationId = p.RegistrationId,
                    Amount = p.Amount,
                    PaidOn = p.PaidOn,
                    ReceiptNumber = p.ReceiptNumber,
                    ReceivedBy = p.ReceivedBy,
                    ReceivedByName = p.ReceivedByUser?.FullName ?? string.Empty,
                    Note = p.Note,
                    ReversesPaymentId = p.ReversesPaymentId,
                    CreatedAt = p.CreatedAt
                }).ToList()
            };
        }).ToList();

        return Result.Ok(dtos);
    }

    public async Task<Result<CampRegistrationDto>> RegisterStudentAsync(Guid eventId, CreateCampRegistrationRequest request, CancellationToken ct = default)
    {
        var campEvent = await _context.CampEvents.FirstOrDefaultAsync(x => x.Id == eventId, ct);
        if (campEvent == null)
            return Result.NotFound<CampRegistrationDto>("Không tìm thấy sự kiện");

        if (campEvent.BranchId.HasValue && !CanAccessBranch(campEvent.BranchId.Value))
            return Result.Forbidden<CampRegistrationDto>("Bạn không có quyền đăng ký cho sự kiện này");

        var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == request.StudentId && s.DeletedAt == null, ct);
        if (student == null)
            return Result.NotFound<CampRegistrationDto>("Không tìm thấy đoàn sinh");

        // Check if already registered
        var existing = await _context.CampRegistrations
            .FirstOrDefaultAsync(r => r.CampEventId == eventId && r.StudentId == request.StudentId, ct);

        if (existing != null)
        {
            if (existing.Status == CampRules.StatusCancelled)
            {
                // Reactivate registration
                existing.Status = CampRules.StatusRegistered;
                existing.TeamNumber = request.TeamNumber?.Trim();
                existing.Note = request.Note?.Trim();
                existing.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync(ct);

                return await GetRegistrationByIdInternalAsync(existing.Id, ct);
            }

            return Result.Failure<CampRegistrationDto>(409, ErrorCodes.ConflictDuplicate, "Đoàn sinh đã đăng ký tham gia sự kiện này");
        }

        var currentUserId = _currentUser.UserId ?? Guid.Empty;

        var registration = new CampRegistration
        {
            Id = Guid.NewGuid(),
            CampEventId = eventId,
            StudentId = request.StudentId,
            TeamNumber = request.TeamNumber?.Trim(),
            Note = request.Note?.Trim(),
            RegisteredBy = currentUserId,
            Status = CampRules.StatusRegistered,
            CreatedAt = DateTime.UtcNow
        };

        _context.CampRegistrations.Add(registration);
        await _context.SaveChangesAsync(ct);

        return await GetRegistrationByIdInternalAsync(registration.Id, ct);
    }

    public async Task<Result<CampRegistrationDto>> UpdateRegistrationAsync(
        Guid eventId,
        Guid registrationId,
        UpdateCampRegistrationRequest request,
        CancellationToken ct = default)
    {
        var registration = await _context.CampRegistrations
            .Include(r => r.CampEvent)
            .FirstOrDefaultAsync(r => r.Id == registrationId && r.CampEventId == eventId, ct);

        if (registration == null)
            return Result.NotFound<CampRegistrationDto>("Không tìm thấy đơn đăng ký");

        if (registration.CampEvent.BranchId.HasValue && !CanAccessBranch(registration.CampEvent.BranchId.Value))
            return Result.Forbidden<CampRegistrationDto>("Bạn không có quyền chỉnh sửa đơn đăng ký này");

        registration.TeamNumber = request.TeamNumber?.Trim();
        registration.Note = request.Note?.Trim();
        registration.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return await GetRegistrationByIdInternalAsync(registration.Id, ct);
    }

    public async Task<Result<bool>> CancelRegistrationAsync(Guid eventId, Guid registrationId, CancellationToken ct = default)
    {
        var registration = await _context.CampRegistrations
            .Include(r => r.CampEvent)
            .FirstOrDefaultAsync(r => r.Id == registrationId && r.CampEventId == eventId, ct);

        if (registration == null)
            return Result.NotFound<bool>("Không tìm thấy đơn đăng ký");

        if (registration.CampEvent.BranchId.HasValue && !CanAccessBranch(registration.CampEvent.BranchId.Value))
            return Result.Forbidden<bool>("Bạn không có quyền hủy đơn đăng ký này");

        // Rule: Cancelling retains recorded payments (ledger is immutable)
        registration.Status = CampRules.StatusCancelled;
        registration.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return Result.Ok(true);
    }

    public async Task<Result<CampPaymentDto>> RecordPaymentAsync(Guid registrationId, RecordCampPaymentRequest request, CancellationToken ct = default)
    {
        var registration = await _context.CampRegistrations
            .Include(r => r.CampEvent)
            .FirstOrDefaultAsync(r => r.Id == registrationId, ct);

        if (registration == null)
            return Result.NotFound<CampPaymentDto>("Không tìm thấy đơn đăng ký sự kiện");

        if (registration.CampEvent.BranchId.HasValue && !CanAccessBranch(registration.CampEvent.BranchId.Value))
            return Result.Forbidden<CampPaymentDto>("Bạn không có quyền thu phí sự kiện này");

        if (request.Amount <= 0)
            return Result.BadRequest<CampPaymentDto>(ErrorCodes.ValidationFailed, "Số tiền thu phải lớn hơn 0");

        var amountVnd = Math.Round(request.Amount, 0);

        // Check receipt uniqueness if provided
        if (!string.IsNullOrWhiteSpace(request.ReceiptNumber))
        {
            var receiptExists = await _context.CampPayments
                .AnyAsync(p => p.ReceiptNumber == request.ReceiptNumber.Trim(), ct);

            if (receiptExists)
                return Result.Failure<CampPaymentDto>(409, ErrorCodes.ConflictDuplicate, $"Số biên lai '{request.ReceiptNumber.Trim()}' đã tồn tại");
        }

        var currentUserId = _currentUser.UserId ?? Guid.Empty;

        var payment = new CampPayment
        {
            Id = Guid.NewGuid(),
            RegistrationId = registrationId,
            Amount = amountVnd,
            PaidOn = request.PaidOn,
            ReceiptNumber = string.IsNullOrWhiteSpace(request.ReceiptNumber) ? null : request.ReceiptNumber.Trim(),
            ReceivedBy = currentUserId,
            Note = request.Note?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.CampPayments.Add(payment);
        await _context.SaveChangesAsync(ct);

        var receivedUser = await _context.Users.FindAsync(new object[] { currentUserId }, ct);

        var dto = new CampPaymentDto
        {
            Id = payment.Id,
            RegistrationId = payment.RegistrationId,
            Amount = payment.Amount,
            PaidOn = payment.PaidOn,
            ReceiptNumber = payment.ReceiptNumber,
            ReceivedBy = payment.ReceivedBy,
            ReceivedByName = receivedUser?.FullName ?? string.Empty,
            Note = payment.Note,
            ReversesPaymentId = null,
            CreatedAt = payment.CreatedAt
        };

        return Result.Ok(dto);
    }

    public async Task<Result<CampPaymentDto>> ReversePaymentAsync(Guid paymentId, ReverseCampPaymentRequest request, CancellationToken ct = default)
    {
        var originalPayment = await _context.CampPayments
            .Include(p => p.Registration)
                .ThenInclude(r => r.CampEvent)
            .FirstOrDefaultAsync(p => p.Id == paymentId, ct);

        if (originalPayment == null)
            return Result.NotFound<CampPaymentDto>("Không tìm thấy dòng thu phí gốc");

        if (originalPayment.Amount <= 0)
            return Result.BadRequest<CampPaymentDto>(ErrorCodes.ValidationFailed, "Không thể hoàn trả một dòng đã là hoàn trả hoặc điều chỉnh âm");

        if (originalPayment.Registration.CampEvent.BranchId.HasValue &&
            !CanAccessBranch(originalPayment.Registration.CampEvent.BranchId.Value))
        {
            return Result.Forbidden<CampPaymentDto>("Bạn không có quyền thao tác trên sự kiện này");
        }

        // Sum of all existing reversals referencing this payment
        var priorReversalsTotal = await _context.CampPayments
            .Where(p => p.ReversesPaymentId == paymentId)
            .SumAsync(p => p.Amount, ct);

        // Requested refund amount (normalize to negative)
        var refundAmount = -Math.Abs(request.Amount);

        if (!CampRules.ValidateReversal(originalPayment.Amount, priorReversalsTotal, refundAmount))
        {
            return Result.BadRequest<CampPaymentDto>(
                ErrorCodes.ValidationFailed,
                $"Số tiền hoàn trả ({Math.Abs(refundAmount):N0} đ) vượt quá số tiền còn lại của biên lai gốc (đã hoàn {Math.Abs(priorReversalsTotal):N0} / {originalPayment.Amount:N0} đ)");
        }

        if (!string.IsNullOrWhiteSpace(request.ReceiptNumber))
        {
            var receiptExists = await _context.CampPayments
                .AnyAsync(p => p.ReceiptNumber == request.ReceiptNumber.Trim(), ct);

            if (receiptExists)
                return Result.Failure<CampPaymentDto>(409, ErrorCodes.ConflictDuplicate, $"Số biên lai '{request.ReceiptNumber.Trim()}' đã tồn tại");
        }

        var currentUserId = _currentUser.UserId ?? Guid.Empty;

        var reversal = new CampPayment
        {
            Id = Guid.NewGuid(),
            RegistrationId = originalPayment.RegistrationId,
            Amount = refundAmount,
            PaidOn = DateOnly.FromDateTime(DateTime.UtcNow),
            ReceiptNumber = string.IsNullOrWhiteSpace(request.ReceiptNumber) ? null : request.ReceiptNumber.Trim(),
            ReceivedBy = currentUserId,
            Note = string.IsNullOrWhiteSpace(request.Reason) ? "Hoàn trả thu phí" : request.Reason.Trim(),
            ReversesPaymentId = originalPayment.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.CampPayments.Add(reversal);
        await _context.SaveChangesAsync(ct);

        var receivedUser = await _context.Users.FindAsync(new object[] { currentUserId }, ct);

        var dto = new CampPaymentDto
        {
            Id = reversal.Id,
            RegistrationId = reversal.RegistrationId,
            Amount = reversal.Amount,
            PaidOn = reversal.PaidOn,
            ReceiptNumber = reversal.ReceiptNumber,
            ReceivedBy = reversal.ReceivedBy,
            ReceivedByName = receivedUser?.FullName ?? string.Empty,
            Note = reversal.Note,
            ReversesPaymentId = reversal.ReversesPaymentId,
            CreatedAt = reversal.CreatedAt
        };

        return Result.Ok(dto);
    }

    public async Task<Result<CampFinanceSummaryDto>> GetFinanceSummaryAsync(Guid eventId, CancellationToken ct = default)
    {
        var campEvent = await _context.CampEvents
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == eventId, ct);

        if (campEvent == null)
            return Result.NotFound<CampFinanceSummaryDto>("Không tìm thấy sự kiện");

        if (campEvent.BranchId.HasValue && !CanAccessBranch(campEvent.BranchId.Value))
            return Result.Forbidden<CampFinanceSummaryDto>("Bạn không có quyền xem tài chính sự kiện này");

        var registrations = await _context.CampRegistrations
            .AsNoTracking()
            .Include(r => r.Payments)
            .Where(r => r.CampEventId == eventId)
            .ToListAsync(ct);

        var registered = registrations.Where(r => r.Status == CampRules.StatusRegistered).ToList();
        var cancelled = registrations.Where(r => r.Status == CampRules.StatusCancelled).ToList();

        var totalExpected = registered.Count * campEvent.Fee;
        var totalCollected = registrations.SelectMany(r => r.Payments).Sum(p => p.Amount);
        var totalRemaining = Math.Max(0, totalExpected - totalCollected);

        int fullyPaid = 0, partiallyPaid = 0, unpaid = 0, overpaid = 0;

        foreach (var r in registered)
        {
            var balance = CampRules.CalculateBalance(campEvent.Fee, r.Payments.Select(p => p.Amount));
            if (balance.IsOverpaid) overpaid++;
            else if (balance.IsSettled) fullyPaid++;
            else if (balance.TotalPaid > 0) partiallyPaid++;
            else unpaid++;
        }

        var summary = new CampFinanceSummaryDto
        {
            CampEventId = campEvent.Id,
            CampEventName = campEvent.Name,
            FeePerStudent = campEvent.Fee,
            TotalRegistered = registered.Count,
            TotalCancelled = cancelled.Count,
            TotalExpected = totalExpected,
            TotalCollected = totalCollected,
            TotalRemaining = totalRemaining,
            FullyPaidCount = fullyPaid,
            PartiallyPaidCount = partiallyPaid,
            UnpaidCount = unpaid,
            OverpaidCount = overpaid
        };

        return Result.Ok(summary);
    }

    private async Task<Result<CampRegistrationDto>> GetRegistrationByIdInternalAsync(Guid registrationId, CancellationToken ct)
    {
        var r = await _context.CampRegistrations
            .AsNoTracking()
            .Include(x => x.CampEvent)
            .Include(x => x.Student)
            .Include(x => x.RegisteredByUser)
            .Include(x => x.Payments)
                .ThenInclude(p => p.ReceivedByUser)
            .FirstOrDefaultAsync(x => x.Id == registrationId, ct);

        if (r == null)
            return Result.NotFound<CampRegistrationDto>("Không tìm thấy đơn đăng ký");

        var payments = r.Payments.OrderBy(p => p.PaidOn).ThenBy(p => p.CreatedAt).ToList();
        var balance = CampRules.CalculateBalance(r.CampEvent.Fee, payments.Select(p => p.Amount));

        var dto = new CampRegistrationDto
        {
            Id = r.Id,
            CampEventId = r.CampEventId,
            CampEventName = r.CampEvent.Name,
            EventFee = r.CampEvent.Fee,
            StudentId = r.StudentId,
            StudentCode = r.Student.Code,
            StudentHolyName = r.Student.HolyName ?? string.Empty,
            StudentFullName = r.Student.FullName,
            TeamNumber = r.TeamNumber,
            Note = r.Note,
            Status = r.Status,
            RegisteredBy = r.RegisteredBy,
            RegisteredByName = r.RegisteredByUser?.FullName ?? string.Empty,
            CreatedAt = r.CreatedAt,
            TotalPaid = balance.TotalPaid,
            Remaining = balance.Remaining,
            IsOverpaid = balance.IsOverpaid,
            IsSettled = balance.IsSettled,
            Payments = payments.Select(p => new CampPaymentDto
            {
                Id = p.Id,
                RegistrationId = p.RegistrationId,
                Amount = p.Amount,
                PaidOn = p.PaidOn,
                ReceiptNumber = p.ReceiptNumber,
                ReceivedBy = p.ReceivedBy,
                ReceivedByName = p.ReceivedByUser?.FullName ?? string.Empty,
                Note = p.Note,
                ReversesPaymentId = p.ReversesPaymentId,
                CreatedAt = p.CreatedAt
            }).ToList()
        };

        return Result.Ok(dto);
    }
}
