using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Paging;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Students.Contracts;
using GiaoLy.Application.Students.Dtos;
using GiaoLy.Domain.Constants;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GiaoLy.Infrastructure.Services.Students;

public class StudentService : IStudentService
{
    private readonly AppDbContext _db;
    private readonly ICurrentUser _currentUser;
    private readonly IScopeContext _scopeContext;
    private readonly ILogger<StudentService> _logger;
    private readonly IWebHostEnvironment _env;

    private static readonly string[] AllowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private const int MaxPhotoSizeBytes = 2 * 1024 * 1024; // 2MB

    public StudentService(
        AppDbContext db,
        ICurrentUser currentUser,
        IScopeContext scopeContext,
        ILogger<StudentService> logger,
        IWebHostEnvironment env)
    {
        _db = db;
        _currentUser = currentUser;
        _scopeContext = scopeContext;
        _logger = logger;
        _env = env;
    }

    public async Task<Result<PagedList<StudentSummaryResponse>>> GetStudentsAsync(StudentFilterRequest request, CancellationToken ct = default)
    {
        var query = _db.Students.AsNoTracking();
        query = _scopeContext.Students(query);

        if (request.BranchId.HasValue)
        {
            query = query.Where(s => s.BranchId == request.BranchId.Value);
        }

        if (request.ClassRoomId.HasValue)
        {
            var enrolledIds = _db.Enrollments
                .AsNoTracking()
                .Where(e => e.ClassRoomId == request.ClassRoomId.Value && EnrollmentRules.Statuses.InClass.Contains(e.Status))
                .Select(e => e.StudentId);

            query = query.Where(s => enrolledIds.Contains(s.Id));
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            query = query.Where(s => s.Status == request.Status);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var norm = VietnameseNormalizer.NormalizeName(request.Search);
            var phone = PhoneNormalizer.Normalize(request.Search);
            var trimmed = request.Search.Trim();

            var hasContact = _currentUser.HasPermission(Permissions.Students.ViewContact);

            if (hasContact && !string.IsNullOrEmpty(phone))
            {
                query = query.Where(s =>
                    s.FullNameNormalized.Contains(norm) ||
                    s.Code.Contains(trimmed) ||
                    s.Guardians.Any(sg => sg.Guardian != null && sg.Guardian.Phone.Contains(phone))
                );
            }
            else
            {
                query = query.Where(s =>
                    s.FullNameNormalized.Contains(norm) ||
                    s.Code.Contains(trimmed)
                );
            }
        }

        var activeYear = await _db.AcademicYears
            .AsNoTracking()
            .FirstOrDefaultAsync(y => y.Status == AcademicYearStateMachine.StatusActive, ct);

        var hasContactPermission = _currentUser.HasPermission(Permissions.Students.ViewContact);

        var mappedQuery = query
            .OrderBy(s => s.FullName)
            .Select(s => new StudentSummaryResponse(
                s.Id,
                s.Code,
                s.HolyName,
                s.FullName,
                DateOnly.FromDateTime(s.BirthDate),
                s.Gender,
                s.Status,
                s.BranchId,
                s.BranchEntity != null ? s.BranchEntity.Name : null,
                activeYear != null
                    ? s.Enrollments
                        .Where(e => e.AcademicYearId == activeYear.Id &&
                                    EnrollmentRules.Statuses.InClass.Contains(e.Status))
                        .OrderBy(e => e.Status == EnrollmentRules.Statuses.Active ? 0 : 1)
                        .Select(e => (Guid?)e.ClassRoomId).FirstOrDefault()
                    : null,
                activeYear != null
                    ? s.Enrollments
                        .Where(e => e.AcademicYearId == activeYear.Id &&
                                    EnrollmentRules.Statuses.InClass.Contains(e.Status))
                        .OrderBy(e => e.Status == EnrollmentRules.Statuses.Active ? 0 : 1)
                        .Select(e => e.ClassRoom != null ? e.ClassRoom.ClassName : null).FirstOrDefault()
                    : null,
                s.Area,
                s.Guardians.Where(g => g.IsPrimary).Select(g => g.Guardian != null ? g.Guardian.FullName : null).FirstOrDefault()
                    ?? s.Guardians.Select(g => g.Guardian != null ? g.Guardian.FullName : null).FirstOrDefault(),
                hasContactPermission
                    ? (s.Guardians.Where(g => g.IsPrimary).Select(g => g.Guardian != null ? g.Guardian.Phone : null).FirstOrDefault()
                        ?? s.Guardians.Select(g => g.Guardian != null ? g.Guardian.Phone : null).FirstOrDefault())
                    : null,
                s.PhotoUrl
            ));

        var totalCount = await mappedQuery.CountAsync(ct);
        var items = await mappedQuery
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        var pagedList = new PagedList<StudentSummaryResponse>(items, totalCount, request.Page, request.PageSize);
        return Result.Ok(pagedList);
    }

    public async Task<Result<StudentDetailResponse>> GetStudentByIdAsync(Guid id, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(id, ct))
        {
            return Result.NotFound<StudentDetailResponse>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var activeYear = await _db.AcademicYears
            .AsNoTracking()
            .FirstOrDefaultAsync(y => y.Status == AcademicYearStateMachine.StatusActive, ct);

        var student = await _db.Students
            .AsNoTracking()
            .Include(s => s.BranchEntity)
            .Include(s => s.Family)
            .Include(s => s.Guardians)
                .ThenInclude(sg => sg.Guardian)
            .Include(s => s.Enrollments)
                .ThenInclude(e => e.ClassRoom)
            .FirstOrDefaultAsync(s => s.Id == id, ct);

        if (student == null)
        {
            return Result.NotFound<StudentDetailResponse>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var hasContact = _currentUser.HasPermission(Permissions.Students.ViewContact);
        var hasHealth = _currentUser.HasPermission(Permissions.Students.ViewHealth);

        var activeEnrollment = activeYear != null
            ? student.Enrollments
                .Where(e => e.AcademicYearId == activeYear.Id &&
                            EnrollmentRules.Statuses.InClass.Contains(e.Status))
                .OrderBy(e => e.Status == EnrollmentRules.Statuses.Active ? 0 : 1)
                .FirstOrDefault()
            : null;

        var guardianDtos = student.Guardians.Select(sg => new GuardianDto(
            sg.GuardianId,
            sg.Guardian?.FullName ?? string.Empty,
            hasContact ? (sg.Guardian?.Phone ?? string.Empty) : "********",
            sg.Relationship,
            sg.IsPrimary,
            hasContact ? sg.Guardian?.Occupation : null,
            hasContact ? sg.Guardian?.Religion : null,
            hasContact ? sg.Guardian?.Email : null
        )).ToList();

        var response = new StudentDetailResponse(
            student.Id,
            student.Code,
            student.HolyName,
            student.FullName,
            DateOnly.FromDateTime(student.BirthDate),
            student.Gender,
            student.Status,
            student.JoinedOn,
            student.LeftOn,
            student.BranchId,
            student.BranchEntity?.Name,
            activeEnrollment?.ClassRoomId,
            activeEnrollment?.ClassRoom?.ClassName,
            student.FamilyId,
            student.Family?.Name,
            student.PhotoUrl,
            hasContact ? student.Area : null,
            hasContact ? student.Address : null,
            hasHealth ? student.BloodType : null,
            hasHealth ? student.Allergies : null,
            hasHealth ? student.HealthNotes : null,
            student.GuardianConsentAt,
            student.HasPhotoConsent,
            guardianDtos,
            student.RowVersion
        );

        return Result.Ok(response);
    }

    public async Task<Result<StudentDetailResponse>> CreateStudentAsync(CreateStudentRequest request, CancellationToken ct = default)
    {
        var cleanFullName = VietnameseNormalizer.CleanDisplay(request.FullName);
        if (string.IsNullOrWhiteSpace(cleanFullName))
        {
            return Result.Validation<StudentDetailResponse>("Họ và tên đoàn sinh không được để trống.", "FullName");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        // DateOnly không nullable: client bỏ trống trường ngày sinh thì binder điền
        // 01/01/0001, nên phải chặn cả giá trị mặc định chứ không chỉ ngày tương lai.
        if (StudentBirthDateRules.GetError(request.BirthDate, today) is { } birthDateError)
        {
            return Result.Validation<StudentDetailResponse>(birthDateError, "BirthDate");
        }

        // Duplicate Check
        var normName = VietnameseNormalizer.NormalizeName(cleanFullName);
        var guardianPhones = (request.Guardians ?? new List<GuardianDto>())
            .Select(g => PhoneNormalizer.Normalize(g.Phone))
            .Where(p => !string.IsNullOrEmpty(p))
            .Distinct()
            .ToList();

        var duplicateResult = await CheckDuplicateInternalAsync(normName, request.BirthDate, guardianPhones, null, ct);
        if (duplicateResult.Level == DuplicateLevel.Exact)
        {
            var canOverride = _currentUser.IsInRole("SystemAdmin") && !string.IsNullOrWhiteSpace(request.OverrideDuplicateReason);
            if (!canOverride)
            {
                return Result.Conflict<StudentDetailResponse>(ErrorCodes.ConflictDuplicate, duplicateResult.Message!);
            }
            _logger.LogWarning("SystemAdmin ghi đè hồ sơ trùng Exact cho em {FullName}. Lý do: {Reason}", cleanFullName, request.OverrideDuplicateReason);
        }
        else if (duplicateResult.Level == DuplicateLevel.Probable && !request.ConfirmWarning)
        {
            return Result.Validation<StudentDetailResponse>(duplicateResult.Message!, "ConfirmWarning");
        }

        // Validate classroom if specified
        ClassRoom? targetClass = null;
        if (request.ClassRoomId.HasValue)
        {
            if (!await _scopeContext.CanAccessClassRoomAsync(request.ClassRoomId.Value, ct))
            {
                return Result.Validation<StudentDetailResponse>("Lớp học được chọn nằm ngoài phạm vi quản lý của bạn.", "ClassRoomId");
            }

            targetClass = await _db.ClassRooms
                .Include(c => c.AcademicYear)
                .FirstOrDefaultAsync(c => c.Id == request.ClassRoomId.Value && c.DeletedAt == null, ct);

            if (targetClass == null)
            {
                return Result.NotFound<StudentDetailResponse>($"Không tìm thấy lớp học với Id '{request.ClassRoomId.Value}'.");
            }
        }

        // Generate Code: TN + 2 số năm + 4 số thứ tự
        var year2 = (DateTime.UtcNow.Year % 100).ToString("D2");
        var prefix = $"TN{year2}";

        var existingCodes = await _db.Students
            .IgnoreQueryFilters()
            .Where(s => s.Code.StartsWith(prefix))
            .Select(s => s.Code)
            .ToListAsync(ct);

        var maxSeq = 0;
        foreach (var c in existingCodes)
        {
            if (c.Length >= 8 && int.TryParse(c[4..], out var num))
            {
                if (num > maxSeq) maxSeq = num;
            }
        }
        var nextCode = $"{prefix}{maxSeq + 1:D4}";

        var student = new Student
        {
            Id = Guid.NewGuid(),
            Code = nextCode,
            HolyName = request.HolyName?.Trim() ?? string.Empty,
            FullName = cleanFullName,
            BirthDate = request.BirthDate.ToDateTime(TimeOnly.MinValue),
            Gender = request.Gender?.Trim(),
            BranchId = request.BranchId,
            Area = request.Area?.Trim(),
            Address = request.Address?.Trim(),
            BloodType = request.BloodType?.Trim(),
            Allergies = request.Allergies?.Trim(),
            HealthNotes = request.HealthNotes?.Trim(),
            HasPhotoConsent = request.HasPhotoConsent,
            GuardianConsentAt = request.HasPhotoConsent ? DateTime.UtcNow : null,
            Status = StudentStateMachine.StatusActive,
            JoinedOn = today,
            CreatedAt = DateTime.UtcNow
        };

        _db.Students.Add(student);

        // Process Guardians
        if (request.Guardians != null && request.Guardians.Count > 0)
        {
            var hasPrimary = false;
            foreach (var gDto in request.Guardians)
            {
                var cleanPhone = PhoneNormalizer.Normalize(gDto.Phone);
                if (string.IsNullOrEmpty(cleanPhone)) continue;

                var guardian = await _db.Guardians.FirstOrDefaultAsync(g => g.Phone == cleanPhone, ct);
                if (guardian == null)
                {
                    guardian = new Guardian
                    {
                        Id = Guid.NewGuid(),
                        FullName = VietnameseNormalizer.CleanDisplay(gDto.FullName),
                        Phone = cleanPhone,
                        Occupation = gDto.Occupation?.Trim(),
                        Religion = gDto.Religion?.Trim(),
                        Email = gDto.Email?.Trim(),
                        CreatedAt = DateTime.UtcNow
                    };
                    _db.Guardians.Add(guardian);
                }
                else
                {
                    if (!string.IsNullOrWhiteSpace(gDto.FullName)) guardian.FullName = VietnameseNormalizer.CleanDisplay(gDto.FullName);
                    if (!string.IsNullOrWhiteSpace(gDto.Occupation)) guardian.Occupation = gDto.Occupation.Trim();
                    if (!string.IsNullOrWhiteSpace(gDto.Religion)) guardian.Religion = gDto.Religion.Trim();
                    if (!string.IsNullOrWhiteSpace(gDto.Email)) guardian.Email = gDto.Email.Trim();
                    guardian.UpdatedAt = DateTime.UtcNow;
                }

                var isPrimary = gDto.IsPrimary && !hasPrimary;
                if (isPrimary) hasPrimary = true;

                _db.StudentGuardians.Add(new StudentGuardian
                {
                    StudentId = student.Id,
                    GuardianId = guardian.Id,
                    Relationship = string.IsNullOrWhiteSpace(gDto.Relationship) ? "Other" : gDto.Relationship.Trim(),
                    IsPrimary = isPrimary,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        // Process Immediate Class Enrollment
        if (targetClass != null)
        {
            var enrollment = new Enrollment
            {
                Id = Guid.NewGuid(),
                StudentId = student.Id,
                ClassRoomId = targetClass.Id,
                AcademicYearId = targetClass.AcademicYearId,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };
            _db.Enrollments.Add(enrollment);
        }

        // Record Initial Status Change
        _db.StudentStatusChanges.Add(new StudentStatusChange
        {
            Id = Guid.NewGuid(),
            StudentId = student.Id,
            OldStatus = null,
            NewStatus = StudentStateMachine.StatusActive,
            Reason = "Tạo mới hồ sơ đoàn sinh",
            ChangedBy = _currentUser.UserId != Guid.Empty ? _currentUser.UserId : null,
            ChangedAt = DateTime.UtcNow
        });

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã tạo hồ sơ đoàn sinh mới: {Code} - {FullName}", student.Code, student.FullName);

        return await GetStudentByIdAsync(student.Id, ct);
    }

    public async Task<Result<StudentDetailResponse>> UpdateStudentAsync(Guid id, UpdateStudentRequest request, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(id, ct))
        {
            return Result.NotFound<StudentDetailResponse>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var student = await _db.Students.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (student == null)
        {
            return Result.NotFound<StudentDetailResponse>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        if (request.RowVersion != null && student.RowVersion != null && !student.RowVersion.SequenceEqual(request.RowVersion))
        {
            return Result.Conflict<StudentDetailResponse>(ErrorCodes.ConflictVersion, "Hồ sơ đã bị thay đổi bởi người khác. Vui lòng tải lại trang.");
        }

        if (request.FullName != null)
        {
            var cleanName = VietnameseNormalizer.CleanDisplay(request.FullName);
            if (string.IsNullOrWhiteSpace(cleanName))
            {
                return Result.Validation<StudentDetailResponse>("Họ và tên không được để trống.", "FullName");
            }
            student.FullName = cleanName;
        }

        if (request.HolyName != null) student.HolyName = request.HolyName.Trim();
        if (request.BirthDate.HasValue)
        {
            if (StudentBirthDateRules.GetError(request.BirthDate.Value, DateOnly.FromDateTime(DateTime.UtcNow)) is { } birthDateError)
            {
                return Result.Validation<StudentDetailResponse>(birthDateError, "BirthDate");
            }
            student.BirthDate = request.BirthDate.Value.ToDateTime(TimeOnly.MinValue);
        }

        if (request.Gender != null) student.Gender = request.Gender.Trim();
        if (request.BranchId.HasValue) student.BranchId = request.BranchId.Value;
        if (request.Area != null) student.Area = request.Area.Trim();
        if (request.Address != null) student.Address = request.Address.Trim();
        if (request.BloodType != null) student.BloodType = request.BloodType.Trim();
        if (request.Allergies != null) student.Allergies = request.Allergies.Trim();
        if (request.HealthNotes != null) student.HealthNotes = request.HealthNotes.Trim();
        if (request.HasPhotoConsent.HasValue) student.HasPhotoConsent = request.HasPhotoConsent.Value;
        if (request.Notes != null) student.Notes = request.Notes.Trim();

        student.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation("Đã cập nhật hồ sơ đoàn sinh: {Code} - {FullName}", student.Code, student.FullName);

        return await GetStudentByIdAsync(id, ct);
    }

    public async Task<Result> ChangeStudentStatusAsync(Guid id, ChangeStudentStatusRequest request, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(id, ct))
        {
            return Result.NotFound("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var student = await _db.Students.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (student == null)
        {
            return Result.NotFound("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var isAdmin = _currentUser.IsInRole("SystemAdmin");
        if (!StudentStateMachine.CanChangeStatus(student.Status, request.TargetStatus, request.Reason, isAdmin, out var error))
        {
            return Result.Validation(error!);
        }

        var oldStatus = student.Status;
        student.Status = request.TargetStatus;
        student.UpdatedAt = DateTime.UtcNow;

        // Active, Paused -> Left: close active enrollments
        if (request.TargetStatus == StudentStateMachine.StatusLeft)
        {
            student.LeftOn = DateOnly.FromDateTime(DateTime.UtcNow);
            var activeEnrollments = await _db.Enrollments
                .Where(e => e.StudentId == id && e.Status == "Active")
                .ToListAsync(ct);

            foreach (var e in activeEnrollments)
            {
                e.Status = "DropOut";
                e.EndDate = DateOnly.FromDateTime(DateTime.UtcNow);
                e.Note = $"Đoàn sinh nghỉ sinh hoạt: {request.Reason.Trim()}";
            }
        }
        else if (oldStatus == StudentStateMachine.StatusLeft && request.TargetStatus == StudentStateMachine.StatusActive)
        {
            student.LeftOn = null;
        }

        _db.StudentStatusChanges.Add(new StudentStatusChange
        {
            Id = Guid.NewGuid(),
            StudentId = id,
            OldStatus = oldStatus,
            NewStatus = request.TargetStatus,
            Reason = request.Reason.Trim(),
            ChangedBy = _currentUser.UserId != Guid.Empty ? _currentUser.UserId : null,
            ChangedAt = DateTime.UtcNow
        });

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã chuyển trạng thái đoàn sinh {Code}: {Old} -> {New}", student.Code, oldStatus, request.TargetStatus);

        return Result.Ok();
    }

    public async Task<Result> DeleteStudentAsync(Guid id, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(id, ct))
        {
            return Result.NotFound("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var student = await _db.Students.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (student == null)
        {
            return Result.NotFound("Không tìm thấy hồ sơ đoàn sinh.");
        }

        // Xoá hồ sơ mà để lại ghi danh Active là ghi danh mồ côi: đoàn sinh không còn
        // trong danh sách nên không ai rút lớp được, còn lớp thì bị giữ lại. Rút luôn ở
        // đây theo đúng cách rút lớp thủ công (DropOut + ngày kết thúc + ghi chú lý do).
        var ghiDanhDangHoc = await _db.Enrollments
            .Where(e => e.StudentId == id && e.Status == EnrollmentRules.Statuses.Active)
            .ToListAsync(ct);

        var ngayXoa = DateOnly.FromDateTime(DateTime.UtcNow);
        foreach (var ghiDanh in ghiDanhDangHoc)
        {
            const string lyDo = "Rút khỏi lớp: hồ sơ đoàn sinh bị xoá";
            ghiDanh.Status = EnrollmentRules.Statuses.DropOut;
            ghiDanh.EndDate = ngayXoa;
            ghiDanh.Note = string.IsNullOrWhiteSpace(ghiDanh.Note)
                ? lyDo
                : $"{ghiDanh.Note} | {lyDo}";
            ghiDanh.UpdatedAt = DateTime.UtcNow;
        }

        student.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation(
            "Đã xóa mềm hồ sơ đoàn sinh: {Code} ({Id}), rút {SoGhiDanh} ghi danh đang học",
            student.Code, id, ghiDanhDangHoc.Count);
        return Result.Ok();
    }

    public async Task<Result> RestoreStudentAsync(Guid id, CancellationToken ct = default)
    {
        var student = await _db.Students
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt != null, ct);

        if (student == null)
        {
            return Result.NotFound("Không tìm thấy hồ sơ đoàn sinh đã xóa.");
        }

        student.DeletedAt = null;
        student.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã khôi phục hồ sơ đoàn sinh: {Code} ({Id})", student.Code, id);

        return Result.Ok();
    }

    public async Task<Result<string>> UploadPhotoAsync(Guid id, Stream fileStream, string fileName, string contentType, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(id, ct))
        {
            return Result.NotFound<string>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var student = await _db.Students.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (student == null)
        {
            return Result.NotFound<string>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        if (!AllowedImageExtensions.Contains(ext))
        {
            return Result.Validation<string>("Chỉ chấp nhận tệp ảnh JPG, PNG hoặc WEBP.", "File");
        }

        if (fileStream.Length > MaxPhotoSizeBytes)
        {
            return Result.Validation<string>("Kích thước tệp ảnh vượt quá giới hạn 2MB.", "File");
        }

        // Validate magic bytes
        var header = new byte[8];
        var read = await fileStream.ReadAsync(header.AsMemory(0, header.Length), ct);
        fileStream.Position = 0;

        if (!IsValidImageHeader(header, ext))
        {
            return Result.Validation<string>("Nội dung tệp không phải là hình ảnh hợp lệ.", "File");
        }

        var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads", "students");
        Directory.CreateDirectory(uploadsDir);

        var safeFileName = $"{student.Id}_{Guid.NewGuid():N}{ext}";
        var fullPath = Path.Combine(uploadsDir, safeFileName);

        using (var outputStream = File.Create(fullPath))
        {
            await fileStream.CopyToAsync(outputStream, ct);
        }

        var photoUrl = $"/uploads/students/{safeFileName}";
        student.PhotoUrl = photoUrl;
        student.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã tải ảnh đại diện đoàn sinh {Code}: {Url}", student.Code, photoUrl);

        return Result.Ok(photoUrl);
    }

    public async Task<Result<IReadOnlyList<GuardianDto>>> GetStudentGuardiansAsync(Guid id, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(id, ct))
        {
            return Result.NotFound<IReadOnlyList<GuardianDto>>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var hasContact = _currentUser.HasPermission(Permissions.Students.ViewContact);

        var guardians = await _db.StudentGuardians
            .AsNoTracking()
            .Include(sg => sg.Guardian)
            .Where(sg => sg.StudentId == id)
            .OrderByDescending(sg => sg.IsPrimary)
            .Select(sg => new GuardianDto(
                sg.GuardianId,
                sg.Guardian != null ? sg.Guardian.FullName : string.Empty,
                hasContact ? (sg.Guardian != null ? sg.Guardian.Phone : string.Empty) : "********",
                sg.Relationship,
                sg.IsPrimary,
                hasContact && sg.Guardian != null ? sg.Guardian.Occupation : null,
                hasContact && sg.Guardian != null ? sg.Guardian.Religion : null,
                hasContact && sg.Guardian != null ? sg.Guardian.Email : null
            ))
            .ToListAsync(ct);

        return Result.Ok<IReadOnlyList<GuardianDto>>(guardians);
    }

    public async Task<Result<IReadOnlyList<GuardianDto>>> UpdateStudentGuardiansAsync(Guid id, List<GuardianDto> guardians, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(id, ct))
        {
            return Result.NotFound<IReadOnlyList<GuardianDto>>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var student = await _db.Students
            .Include(s => s.Guardians)
            .FirstOrDefaultAsync(s => s.Id == id, ct);

        if (student == null)
        {
            return Result.NotFound<IReadOnlyList<GuardianDto>>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        _db.StudentGuardians.RemoveRange(student.Guardians);

        var hasPrimary = false;
        foreach (var gDto in guardians)
        {
            var cleanPhone = PhoneNormalizer.Normalize(gDto.Phone);
            if (string.IsNullOrEmpty(cleanPhone)) continue;

            var guardian = await _db.Guardians.FirstOrDefaultAsync(g => g.Phone == cleanPhone, ct);
            if (guardian == null)
            {
                guardian = new Guardian
                {
                    Id = Guid.NewGuid(),
                    FullName = VietnameseNormalizer.CleanDisplay(gDto.FullName),
                    Phone = cleanPhone,
                    Occupation = gDto.Occupation?.Trim(),
                    Religion = gDto.Religion?.Trim(),
                    Email = gDto.Email?.Trim(),
                    CreatedAt = DateTime.UtcNow
                };
                _db.Guardians.Add(guardian);
            }
            else
            {
                if (!string.IsNullOrWhiteSpace(gDto.FullName)) guardian.FullName = VietnameseNormalizer.CleanDisplay(gDto.FullName);
                if (!string.IsNullOrWhiteSpace(gDto.Occupation)) guardian.Occupation = gDto.Occupation.Trim();
                if (!string.IsNullOrWhiteSpace(gDto.Religion)) guardian.Religion = gDto.Religion.Trim();
                if (!string.IsNullOrWhiteSpace(gDto.Email)) guardian.Email = gDto.Email.Trim();
                guardian.UpdatedAt = DateTime.UtcNow;
            }

            var isPrimary = gDto.IsPrimary && !hasPrimary;
            if (isPrimary) hasPrimary = true;

            _db.StudentGuardians.Add(new StudentGuardian
            {
                StudentId = id,
                GuardianId = guardian.Id,
                Relationship = string.IsNullOrWhiteSpace(gDto.Relationship) ? "Other" : gDto.Relationship.Trim(),
                IsPrimary = isPrimary,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã cập nhật danh sách phụ huynh của đoàn sinh {Code}", student.Code);

        return await GetStudentGuardiansAsync(id, ct);
    }

    public async Task<Result<IReadOnlyList<StudentNoteDto>>> GetStudentNotesAsync(Guid id, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(id, ct))
        {
            return Result.NotFound<IReadOnlyList<StudentNoteDto>>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var notes = await _db.StudentNotes
            .AsNoTracking()
            .Include(n => n.Author)
            .Where(n => n.StudentId == id && n.DeletedAt == null)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync(ct);

        var isAdmin = _currentUser.IsInRole("SystemAdmin");
        var currentUserId = _currentUser.UserId;

        var visibleNotes = notes
            .Where(n => !n.IsPrivate || n.AuthorId == currentUserId || isAdmin)
            .Select(n => new StudentNoteDto(
                n.Id,
                n.StudentId,
                n.AuthorId,
                n.Author?.FullName ?? "Ẩn danh",
                n.Content,
                n.IsPrivate,
                n.CreatedAt
            ))
            .ToList();

        return Result.Ok<IReadOnlyList<StudentNoteDto>>(visibleNotes);
    }

    public async Task<Result<StudentNoteDto>> CreateStudentNoteAsync(Guid id, CreateStudentNoteRequest request, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(id, ct))
        {
            return Result.NotFound<StudentNoteDto>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        if (string.IsNullOrWhiteSpace(request.Content))
        {
            return Result.Validation<StudentNoteDto>("Nội dung ghi chú không được để trống.", "Content");
        }

        if (!_currentUser.UserId.HasValue)
        {
            return Result.Forbidden<StudentNoteDto>("Yêu cầu đăng nhập để tạo ghi chú.");
        }

        var note = new StudentNote
        {
            Id = Guid.NewGuid(),
            StudentId = id,
            AuthorId = _currentUser.UserId.Value,
            Content = request.Content.Trim(),
            IsPrivate = request.IsPrivate,
            CreatedAt = DateTime.UtcNow
        };

        _db.StudentNotes.Add(note);
        await _db.SaveChangesAsync(ct);

        var authorName = await _db.Users
            .Where(u => u.Id == _currentUser.UserId)
            .Select(u => u.FullName)
            .FirstOrDefaultAsync(ct) ?? "Tôi";

        return Result.Ok(new StudentNoteDto(
            note.Id,
            note.StudentId,
            note.AuthorId,
            authorName,
            note.Content,
            note.IsPrivate,
            note.CreatedAt
        ));
    }

    public async Task<Result> DeleteStudentNoteAsync(Guid noteId, CancellationToken ct = default)
    {
        var note = await _db.StudentNotes.FirstOrDefaultAsync(n => n.Id == noteId && n.DeletedAt == null, ct);
        if (note == null)
        {
            return Result.NotFound("Không tìm thấy ghi chú.");
        }

        var isAdmin = _currentUser.IsInRole("SystemAdmin");
        if (note.AuthorId != _currentUser.UserId && !isAdmin)
        {
            return Result.Forbidden("Bạn chỉ có thể xóa ghi chú do chính mình tạo.");
        }

        note.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation("Đã xóa ghi chú {NoteId}", noteId);
        return Result.Ok();
    }

    public async Task<Result<StudentHistoryResponse>> GetStudentHistoryAsync(Guid id, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(id, ct))
        {
            return Result.NotFound<StudentHistoryResponse>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var student = await _db.Students.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (student == null)
        {
            return Result.NotFound<StudentHistoryResponse>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var enrollments = await _db.Enrollments
            .AsNoTracking()
            .Include(e => e.AcademicYear)
            .Include(e => e.ClassRoom)
            .Where(e => e.StudentId == id)
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new EnrollmentHistoryItem(
                e.Id,
                e.AcademicYearId,
                e.AcademicYear != null ? e.AcademicYear.Name : string.Empty,
                e.ClassRoomId,
                e.ClassRoom != null ? e.ClassRoom.ClassName : string.Empty,
                e.Status,
                e.CreatedAt
            ))
            .ToListAsync(ct);

        var statusChanges = await _db.StudentStatusChanges
            .AsNoTracking()
            .Include(sc => sc.Changer)
            .Where(sc => sc.StudentId == id)
            .OrderByDescending(sc => sc.ChangedAt)
            .Select(sc => new StatusChangeHistoryItem(
                sc.Id,
                sc.OldStatus,
                sc.NewStatus,
                sc.Reason,
                sc.Changer != null ? sc.Changer.FullName : null,
                sc.ChangedAt
            ))
            .ToListAsync(ct);

        return Result.Ok(new StudentHistoryResponse(student.Id, student.FullName, enrollments, statusChanges));
    }

    public async Task<Result<CheckDuplicateResponse>> CheckDuplicateAsync(CheckDuplicateRequest request, CancellationToken ct = default)
    {
        var normName = VietnameseNormalizer.NormalizeName(request.FullName);
        var guardianPhones = (request.GuardianPhones ?? new List<string>())
            .Select(p => PhoneNormalizer.Normalize(p))
            .Where(p => !string.IsNullOrEmpty(p))
            .Distinct()
            .ToList();

        var checkResult = await CheckDuplicateInternalAsync(normName, request.BirthDate, guardianPhones, null, ct);

        return Result.Ok(new CheckDuplicateResponse(
            checkResult.Level.ToString(),
            checkResult.Message,
            checkResult.ExistingStudentId,
            checkResult.ExistingStudentCode,
            checkResult.ExistingStudentFullName
        ));
    }

    public async Task<Result<IReadOnlyList<UnassignedStudentResponse>>> GetUnassignedStudentsAsync(CancellationToken ct = default)
    {
        var activeYear = await _db.AcademicYears
            .AsNoTracking()
            .FirstOrDefaultAsync(y => y.Status == AcademicYearStateMachine.StatusActive, ct);

        var query = _db.Students
            .AsNoTracking()
            .Where(s => s.Status == StudentStateMachine.StatusActive);

        query = _scopeContext.Students(query);

        if (activeYear != null)
        {
            var enrolledIds = _db.Enrollments
                .AsNoTracking()
                .Where(e => e.AcademicYearId == activeYear.Id && EnrollmentRules.Statuses.InClass.Contains(e.Status))
                .Select(e => e.StudentId);

            query = query.Where(s => !enrolledIds.Contains(s.Id));
        }

        var unassigned = await query
            .Include(s => s.BranchEntity)
            .OrderBy(s => s.FullName)
            .Select(s => new UnassignedStudentResponse(
                s.Id,
                s.Code,
                s.HolyName,
                s.FullName,
                DateOnly.FromDateTime(s.BirthDate),
                s.Gender,
                s.BranchId,
                s.BranchEntity != null ? s.BranchEntity.Name : null
            ))
            .ToListAsync(ct);

        return Result.Ok<IReadOnlyList<UnassignedStudentResponse>>(unassigned);
    }

    public async Task<Result<StudentStatsResponse>> GetStudentStatsAsync(CancellationToken ct = default)
    {
        var query = _db.Students.AsNoTracking();
        query = _scopeContext.Students(query);

        var students = await query
            .Select(s => new { s.Id, s.Status, s.BranchId })
            .ToListAsync(ct);

        var totalActive = students.Count(s => s.Status == StudentStateMachine.StatusActive);
        var totalPaused = students.Count(s => s.Status == StudentStateMachine.StatusPaused);
        var totalLeft = students.Count(s => s.Status == StudentStateMachine.StatusLeft);
        var totalGraduated = students.Count(s => s.Status == StudentStateMachine.StatusGraduated);

        var branches = await _db.Branches.AsNoTracking().OrderBy(b => b.SortOrder).ToListAsync(ct);
        var branchStats = branches.Select(b => new BranchStudentStats(
            b.Id,
            b.Name,
            students.Count(s => s.BranchId == b.Id && s.Status == StudentStateMachine.StatusActive),
            students.Count(s => s.BranchId == b.Id)
        )).ToList();

        var activeYear = await _db.AcademicYears
            .AsNoTracking()
            .FirstOrDefaultAsync(y => y.Status == AcademicYearStateMachine.StatusActive, ct);

        var classStats = new List<ClassStudentStats>();
        if (activeYear != null)
        {
            var allowedClasses = _scopeContext.ClassRooms(
                _db.ClassRooms.AsNoTracking().Where(c => c.AcademicYearId == activeYear.Id && c.DeletedAt == null)
            );

            var classes = await allowedClasses
                .Include(c => c.ClassLevel)
                .OrderBy(c => c.ClassLevel != null ? c.ClassLevel.SortOrder : 0)
                .ThenBy(c => c.Section)
                .ToListAsync(ct);

            var classIds = classes.Select(c => c.Id).ToList();

            var enrollmentCounts = await _db.Enrollments
                .AsNoTracking()
                .Where(e => classIds.Contains(e.ClassRoomId) && EnrollmentRules.Statuses.InClass.Contains(e.Status))
                .GroupBy(e => e.ClassRoomId)
                .Select(g => new { ClassRoomId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.ClassRoomId, x => x.Count, ct);

            classStats = classes.Select(c => new ClassStudentStats(
                c.Id,
                c.ClassName,
                enrollmentCounts.GetValueOrDefault(c.Id, 0)
            )).ToList();
        }

        return Result.Ok(new StudentStatsResponse(
            totalActive,
            totalPaused,
            totalLeft,
            totalGraduated,
            branchStats,
            classStats
        ));
    }

    private async Task<DuplicateCheckResult> CheckDuplicateInternalAsync(
        string candidateNormName,
        DateOnly candidateBirthDate,
        List<string> candidateGuardianPhones,
        Guid? excludeStudentId,
        CancellationToken ct)
    {
        var candidateDateTime = candidateBirthDate.ToDateTime(TimeOnly.MinValue);

        // Fetch candidates with same birth date or matching name
        var query = _db.Students
            .AsNoTracking()
            .Include(s => s.Guardians)
                .ThenInclude(sg => sg.Guardian)
            .Where(s => s.BirthDate == candidateDateTime || s.FullNameNormalized == candidateNormName);

        if (excludeStudentId.HasValue)
        {
            query = query.Where(s => s.Id != excludeStudentId.Value);
        }

        var existingStudents = await query.ToListAsync(ct);

        DuplicateCheckResult highestDuplicate = new(DuplicateLevel.None, null, null, null, null);

        foreach (var existing in existingStudents)
        {
            var existingBirth = DateOnly.FromDateTime(existing.BirthDate);
            var existingPhones = existing.Guardians
                .Where(g => g.Guardian != null)
                .Select(g => g.Guardian!.Phone)
                .ToList();

            var result = StudentDuplicateChecker.Check(
                candidateNormName,
                candidateBirthDate,
                candidateGuardianPhones,
                existing.FullNameNormalized,
                existingBirth,
                existingPhones,
                existing.Id,
                existing.Code,
                existing.FullName
            );

            if (result.Level > highestDuplicate.Level)
            {
                highestDuplicate = result;
            }

            if (highestDuplicate.Level == DuplicateLevel.Exact)
            {
                break;
            }
        }

        return highestDuplicate;
    }

    private static bool IsValidImageHeader(byte[] header, string ext)
    {
        if (header.Length < 4) return false;

        // JPEG: FF D8 FF
        if (header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF) return true;

        // PNG: 89 50 4E 47
        if (header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47) return true;

        // WEBP: RIFF
        if (header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46) return true;

        return false;
    }
}
