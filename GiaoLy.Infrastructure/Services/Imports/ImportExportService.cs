using System.Globalization;
using System.Security.Cryptography;
using System.Text.Json;
using ClosedXML.Excel;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Imports.Contracts;
using GiaoLy.Application.Imports.Dtos;
using GiaoLy.Domain.Constants;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GiaoLy.Infrastructure.Services.Imports;

public class ImportExportService : IImportExportService
{
    private readonly AppDbContext _db;
    private readonly ICurrentUser _currentUser;
    private readonly IScopeContext _scopeContext;
    private readonly ILogger<ImportExportService> _logger;

    private const int MaxImportRows = 2000;
    private const int MaxFileSizeBytes = 10 * 1024 * 1024; // 10MB

    public ImportExportService(
        AppDbContext db,
        ICurrentUser currentUser,
        IScopeContext scopeContext,
        ILogger<ImportExportService> logger)
    {
        _db = db;
        _currentUser = currentUser;
        _scopeContext = scopeContext;
        _logger = logger;
    }

    public Task<Result<ExportFileResult>> DownloadStudentTemplateAsync(CancellationToken ct = default)
    {
        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Mau_Nhap_Doan_Sinh");

        // Header
        for (int i = 0; i < StudentExcelColumns.Headers.Length; i++)
        {
            var cell = ws.Cell(1, i + 1);
            cell.Value = StudentExcelColumns.Headers[i];
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#1E3A8A");
            cell.Style.Font.FontColor = XLColor.White;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        }

        // Sample Row 1
        ws.Cell(2, 1).Value = ""; // Mã đoàn sinh (để trống nếu tạo mới)
        ws.Cell(2, 2).Value = "Giuse";
        ws.Cell(2, 3).Value = "Nguyễn Văn An";
        ws.Cell(2, 4).Value = "15/05/2015";
        ws.Cell(2, 5).Value = "Nam";
        ws.Cell(2, 6).Value = "Trị Sở";
        ws.Cell(2, 7).Value = "123 Đường Tôn Đức Thắng";
        ws.Cell(2, 8).Value = "AU1";
        ws.Cell(2, 9).Value = "A";
        ws.Cell(2, 10).Value = "Nguyễn Văn Bình";
        ws.Cell(2, 11).Value = "Cha";
        ws.Cell(2, 12).Value = "0912345678";
        ws.Cell(2, 13).Value = "O";
        ws.Cell(2, 14).Value = "Không";
        ws.Cell(2, 15).Value = "20/05/2015";
        ws.Cell(2, 16).Value = "Giáo xứ Tân Định";
        ws.Cell(2, 17).Value = "";
        ws.Cell(2, 18).Value = "";
        ws.Cell(2, 19).Value = "Đoàn sinh gương mẫu";

        // Sample Row 2
        ws.Cell(3, 1).Value = "";
        ws.Cell(3, 2).Value = "Maria";
        ws.Cell(3, 3).Value = "Trần Thị Mai";
        ws.Cell(3, 4).Value = "20/10/2016";
        ws.Cell(3, 5).Value = "Nữ";
        ws.Cell(3, 6).Value = "Khu 2";
        ws.Cell(3, 7).Value = "45 Lê Lợi";
        ws.Cell(3, 8).Value = "AU1";
        ws.Cell(3, 9).Value = "B";
        ws.Cell(3, 10).Value = "Lê Thị Hoa";
        ws.Cell(3, 11).Value = "Mẹ";
        ws.Cell(3, 12).Value = "0987654321";
        ws.Cell(3, 13).Value = "A";
        ws.Cell(3, 14).Value = "Dị ứng phấn hoa";
        ws.Cell(3, 15).Value = "25/10/2016";
        ws.Cell(3, 16).Value = "Giáo xứ Tân Định";
        ws.Cell(3, 17).Value = "";
        ws.Cell(3, 18).Value = "";
        ws.Cell(3, 19).Value = "";

        ws.Columns().AdjustToContents();

        using var ms = new MemoryStream();
        workbook.SaveAs(ms);
        var bytes = ms.ToArray();

        var result = new ExportFileResult(
            bytes,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Mau_Nhap_Doan_Sinh.xlsx"
        );

        return Task.FromResult(Result.Ok(result));
    }

    public async Task<Result<ImportJobDetailResponse>> UploadAndValidateStudentsAsync(Stream fileStream, string fileName, CancellationToken ct = default)
    {
        if (fileStream.Length > MaxFileSizeBytes)
        {
            return Result.Validation<ImportJobDetailResponse>("Dung lượng tệp vượt quá giới hạn 10MB.", "File");
        }

        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        if (ext != ".xlsx")
        {
            return Result.Validation<ImportJobDetailResponse>("Hệ thống chỉ hỗ trợ tệp định dạng Excel (.xlsx).", "File");
        }

        // Compute FileSha256
        fileStream.Position = 0;
        using var sha256 = SHA256.Create();
        var hashBytes = await sha256.ComputeHashAsync(fileStream, ct);
        var fileSha256 = Convert.ToHexString(hashBytes).ToLowerInvariant();
        fileStream.Position = 0;

        // Check if file was already applied
        var alreadyApplied = await _db.ImportJobs.AnyAsync(j => j.FileSha256 == fileSha256 && j.Status == ImportJob.StatusApplied, ct);
        if (alreadyApplied)
        {
            return Result.Conflict<ImportJobDetailResponse>("Tệp này đã được nhập và áp dụng vào cơ sở dữ liệu trước đó. Để đảm bảo an toàn, hệ thống không cho phép áp dụng hai lần cùng một tệp.");
        }

        XLWorkbook workbook;
        try
        {
            workbook = new XLWorkbook(fileStream);
        }
        catch (Exception ex) when (ex is not OutOfMemoryException)
        {
            _logger.LogWarning(ex, "Tệp tải lên không phải Excel hợp lệ: {FileName}", fileName);
            return Result.Validation<ImportJobDetailResponse>(
                "Tệp tải lên không phải là tệp Excel (.xlsx) hợp lệ hoặc đã bị hỏng. Vui lòng kiểm tra lại tệp.",
                "File");
        }

        using var workbookScope = workbook;
        var ws = workbook.Worksheets.FirstOrDefault();
        if (ws == null)
        {
            return Result.Validation<ImportJobDetailResponse>("Tệp Excel không có trang tính (worksheet) nào.", "File");
        }

        // Load reference data
        var activeYear = await _db.AcademicYears
            .AsNoTracking()
            .FirstOrDefaultAsync(y => y.Status == AcademicYearStateMachine.StatusActive, ct);

        var classLevels = await _db.ClassLevels
            .AsNoTracking()
            .Include(l => l.Branch)
            .ToDictionaryAsync(l => l.Code.Trim().ToUpperInvariant(), ct);

        var classRooms = activeYear != null
            ? await _db.ClassRooms
                .AsNoTracking()
                .Include(c => c.ClassLevel)
                .Where(c => c.AcademicYearId == activeYear.Id && c.DeletedAt == null)
                .ToListAsync(ct)
            : new List<ClassRoom>();

        var existingStudents = await _db.Students
            .AsNoTracking()
            .Include(s => s.Guardians)
                .ThenInclude(sg => sg.Guardian)
            .ToListAsync(ct);

        var existingCodes = new HashSet<string>(
            await _db.Students.IgnoreQueryFilters().Select(s => s.Code).ToListAsync(ct),
            StringComparer.OrdinalIgnoreCase
        );

        var rowReports = new List<ImportRowReportDto>();
        var parsedRows = new List<ParsedRowData>();

        var lastRowNumber = ws.LastRowUsed()?.RowNumber() ?? 0;
        if (lastRowNumber <= 1)
        {
            return Result.Validation<ImportJobDetailResponse>("Tệp Excel không chứa dòng dữ liệu nào sau tiêu đề cột.", "File");
        }

        if (lastRowNumber - 1 > MaxImportRows)
        {
            return Result.Validation<ImportJobDetailResponse>($"Số dòng trong tệp vượt quá giới hạn cho phép ({MaxImportRows} dòng).", "File");
        }

        var inBatchNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        var validRowsCount = 0;
        var warningRowsCount = 0;
        var errorRowsCount = 0;

        for (int row = 2; row <= lastRowNumber; row++)
        {
            var errors = new List<string>();
            var warnings = new List<string>();

            var code = ws.Cell(row, 1).GetString().Trim();
            var holyName = ws.Cell(row, 2).GetString().Trim();
            var rawFullName = ws.Cell(row, 3).GetString().Trim();
            var birthDateCell = ws.Cell(row, 4);
            var gender = ws.Cell(row, 5).GetString().Trim();
            var area = ws.Cell(row, 6).GetString().Trim();
            var address = ws.Cell(row, 7).GetString().Trim();
            var classLevelCode = ws.Cell(row, 8).GetString().Trim();
            var section = ws.Cell(row, 9).GetString().Trim();
            var guardianName = ws.Cell(row, 10).GetString().Trim();
            var guardianRel = ws.Cell(row, 11).GetString().Trim();
            var guardianPhone = ws.Cell(row, 12).GetString().Trim();
            var bloodType = ws.Cell(row, 13).GetString().Trim();
            var allergies = ws.Cell(row, 14).GetString().Trim();
            var baptismDateCell = ws.Cell(row, 15);
            var baptismPlace = ws.Cell(row, 16).GetString().Trim();
            var communionDateCell = ws.Cell(row, 17);
            var confirmationDateCell = ws.Cell(row, 18);
            var notes = ws.Cell(row, 19).GetString().Trim();

            // Skip completely empty row
            if (string.IsNullOrWhiteSpace(rawFullName) && string.IsNullOrWhiteSpace(code) && birthDateCell.IsEmpty())
            {
                continue;
            }

            // 1. FullName validation
            var fullName = VietnameseNormalizer.CleanDisplay(rawFullName);
            if (string.IsNullOrWhiteSpace(fullName))
            {
                errors.Add("Họ và tên bắt buộc phải có.");
            }

            // 2. BirthDate validation (Mandatory, not future, not today!)
            DateOnly? birthDate = ParseDateCell(birthDateCell);
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            if (!birthDate.HasValue)
            {
                errors.Add("Ngày sinh bắt buộc phải có và phải đúng định dạng ngày (dd/MM/yyyy).");
            }
            else if (birthDate.Value > today)
            {
                errors.Add($"Ngày sinh ({birthDate.Value:dd/MM/yyyy}) không thể ở tương lai.");
            }
            else if (birthDate.Value == today)
            {
                errors.Add("Hệ thống không chấp nhận ngày sinh là ngày hôm nay. Vui lòng nhập ngày sinh thực tế của em.");
            }

            // 3. Phone normalization
            var cleanPhone = PhoneNormalizer.Normalize(guardianPhone);
            if (!string.IsNullOrEmpty(guardianPhone) && string.IsNullOrEmpty(cleanPhone))
            {
                warnings.Add("Số điện thoại phụ huynh không hợp lệ.");
            }

            // 4. Class & Section check
            Guid? targetClassRoomId = null;
            int? branchId = null;
            if (!string.IsNullOrWhiteSpace(classLevelCode))
            {
                var upperLevel = classLevelCode.ToUpperInvariant();
                if (classLevels.TryGetValue(upperLevel, out var level))
                {
                    branchId = level.BranchId;

                    if (activeYear != null)
                    {
                        var normSection = section.Trim();
                        var matchedClass = classRooms.FirstOrDefault(c =>
                            c.ClassLevelId == level.Id &&
                            string.Equals(c.Section.Trim(), normSection, StringComparison.OrdinalIgnoreCase));

                        if (matchedClass != null)
                        {
                            targetClassRoomId = matchedClass.Id;
                            // Check Scope for classroom
                            var canAccess = await _scopeContext.CanAccessClassRoomAsync(matchedClass.Id, ct);
                            if (!canAccess)
                            {
                                errors.Add($"Lớp '{matchedClass.ClassName}' nằm ngoài phạm vi quản lý của tài khoản bạn.");
                            }
                        }
                        else
                        {
                            warnings.Add($"Không tìm thấy lớp cho cấp '{level.Code}' phân lớp '{section}' trong niên khóa đang hoạt động. Em sẽ được tạo mà chưa xếp lớp.");
                        }
                    }
                    else
                    {
                        warnings.Add("Hiện chưa có niên khóa nào đang hoạt động để xếp lớp trực tiếp.");
                    }
                }
                else
                {
                    errors.Add($"Mã cấp lớp '{classLevelCode}' không tồn tại trong danh mục hệ thống.");
                }
            }

            // 5. Duplicate check (Against in-batch and existing DB)
            var normName = VietnameseNormalizer.NormalizeName(fullName);
            if (birthDate.HasValue)
            {
                var batchKey = $"{normName}#{birthDate.Value:yyyyMMdd}";
                if (inBatchNames.Contains(batchKey))
                {
                    warnings.Add("Trùng lặp với một dòng khác ngay trong chính tệp tải lên.");
                }
                else
                {
                    inBatchNames.Add(batchKey);
                }

                // Check against existing students in DB
                var phones = string.IsNullOrEmpty(cleanPhone) ? new List<string>() : [cleanPhone];
                foreach (var ex in existingStudents)
                {
                    if (string.Equals(ex.Code, code, StringComparison.OrdinalIgnoreCase)) continue; // Self update

                    var exBirth = DateOnly.FromDateTime(ex.BirthDate);
                    var exPhones = ex.Guardians.Where(g => g.Guardian != null).Select(g => g.Guardian!.Phone).ToList();

                    var dup = StudentDuplicateChecker.Check(
                        normName,
                        birthDate.Value,
                        phones,
                        ex.FullNameNormalized,
                        exBirth,
                        exPhones,
                        ex.Id,
                        ex.Code,
                        ex.FullName
                    );

                    if (dup.Level == DuplicateLevel.Exact)
                    {
                        errors.Add(dup.Message!);
                        break;
                    }
                    else if (dup.Level == DuplicateLevel.Probable)
                    {
                        warnings.Add(dup.Message!);
                    }
                    else if (dup.Level == DuplicateLevel.Possible)
                    {
                        warnings.Add(dup.Message!);
                    }
                }
            }

            // 6. Sacraments Dates validation
            DateOnly? baptismDate = ParseDateCell(baptismDateCell);
            DateOnly? communionDate = ParseDateCell(communionDateCell);
            DateOnly? confirmationDate = ParseDateCell(confirmationDateCell);

            if (birthDate.HasValue && baptismDate.HasValue && baptismDate.Value < birthDate.Value)
            {
                errors.Add("Ngày Rửa tội không thể trước ngày sinh.");
            }
            if (baptismDate.HasValue && communionDate.HasValue && communionDate.Value < baptismDate.Value)
            {
                warnings.Add("Ngày Rước lễ lần đầu ghi nhận trước ngày Rửa tội.");
            }
            if (communionDate.HasValue && confirmationDate.HasValue && confirmationDate.Value < communionDate.Value)
            {
                warnings.Add("Ngày Thêm sức ghi nhận trước ngày Rước lễ lần đầu.");
            }

            var status = errors.Count > 0 ? "Error" : (warnings.Count > 0 ? "Warning" : "Valid");
            if (status == "Error") errorRowsCount++;
            else if (status == "Warning") warningRowsCount++;
            else validRowsCount++;

            rowReports.Add(new ImportRowReportDto(
                row,
                status,
                string.IsNullOrEmpty(code) ? null : code,
                fullName,
                birthDate?.ToString("dd/MM/yyyy"),
                classLevelCode,
                section,
                errors,
                warnings
            ));

            parsedRows.Add(new ParsedRowData(
                row,
                code,
                holyName,
                fullName,
                birthDate,
                gender,
                area,
                address,
                branchId,
                targetClassRoomId,
                guardianName,
                guardianRel,
                cleanPhone,
                bloodType,
                allergies,
                baptismDate,
                baptismPlace,
                communionDate,
                confirmationDate,
                notes,
                status != "Error" // IsValid
            ));
        }

        var payload = new InternalImportPayload(parsedRows, rowReports);
        var reportJson = JsonSerializer.Serialize(payload);

        var job = new ImportJob
        {
            Id = Guid.NewGuid(),
            ImportType = "Students",
            FileName = fileName,
            FileSha256 = fileSha256,
            UploadedBy = _currentUser.UserId.GetValueOrDefault(),
            Status = ImportJob.StatusValidated,
            TotalRows = parsedRows.Count,
            ValidRows = validRowsCount,
            WarningRows = warningRowsCount,
            ErrorRows = errorRowsCount,
            ReportJson = reportJson,
            CreatedAt = DateTime.UtcNow
        };

        _db.ImportJobs.Add(job);
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation("Đã chạy thử nhập tệp sinh viên {File} ({JobId}): {Valid} hợp lệ, {Warning} cảnh báo, {Error} lỗi", fileName, job.Id, validRowsCount, warningRowsCount, errorRowsCount);

        return Result.Ok(new ImportJobDetailResponse(
            job.Id,
            job.ImportType,
            job.FileName,
            job.FileSha256,
            job.Status,
            job.TotalRows,
            job.ValidRows,
            job.WarningRows,
            job.ErrorRows,
            rowReports,
            job.AppliedAt,
            job.CreatedAt
        ));
    }

    public async Task<Result<ImportJobDetailResponse>> GetImportJobByIdAsync(Guid id, CancellationToken ct = default)
    {
        var job = await _db.ImportJobs.AsNoTracking().FirstOrDefaultAsync(j => j.Id == id, ct);
        if (job == null)
        {
            return Result.NotFound<ImportJobDetailResponse>($"Không tìm thấy phiên nhập dữ liệu với Id '{id}'.");
        }

        var reports = new List<ImportRowReportDto>();
        if (!string.IsNullOrEmpty(job.ReportJson))
        {
            try
            {
                var payload = JsonSerializer.Deserialize<InternalImportPayload>(job.ReportJson);
                if (payload != null)
                {
                    reports = payload.Reports;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi đọc ReportJson cho JobId {JobId}", id);
            }
        }

        return Result.Ok(new ImportJobDetailResponse(
            job.Id,
            job.ImportType,
            job.FileName,
            job.FileSha256,
            job.Status,
            job.TotalRows,
            job.ValidRows,
            job.WarningRows,
            job.ErrorRows,
            reports,
            job.AppliedAt,
            job.CreatedAt
        ));
    }

    public async Task<Result<ApplyImportResult>> ApplyImportJobAsync(Guid id, CancellationToken ct = default)
    {
        var job = await _db.ImportJobs.FirstOrDefaultAsync(j => j.Id == id, ct);
        if (job == null)
        {
            return Result.NotFound<ApplyImportResult>($"Không tìm thấy phiên nhập dữ liệu với Id '{id}'.");
        }

        if (job.Status == ImportJob.StatusApplied)
        {
            return Result.Conflict<ApplyImportResult>("Phiên nhập này đã được áp dụng vào dữ liệu trước đó.");
        }

        if (job.Status != ImportJob.StatusValidated)
        {
            return Result.Validation<ApplyImportResult>($"Chỉ có thể áp dụng phiên nhập đang ở trạng thái '{ImportJob.StatusValidated}'. Trạng thái hiện tại: '{job.Status}'.");
        }

        if (string.IsNullOrEmpty(job.ReportJson))
        {
            return Result.Validation<ApplyImportResult>("Dữ liệu báo cáo của phiên nhập bị trống.");
        }

        InternalImportPayload? payload = null;
        try
        {
            payload = JsonSerializer.Deserialize<InternalImportPayload>(job.ReportJson);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi phân tích payload JSON của JobId {JobId}", id);
            return Result.Validation<ApplyImportResult>("Dữ liệu phiên nhập không hợp lệ hoặc bị hỏng.");
        }

        if (payload == null || payload.Rows.Count == 0)
        {
            return Result.Validation<ApplyImportResult>("Không có dòng dữ liệu nào để áp dụng.");
        }

        var validRows = payload.Rows.Where(r => r.IsValid).ToList();
        if (validRows.Count == 0)
        {
            return Result.Validation<ApplyImportResult>("Tất cả các dòng trong tệp đều có lỗi, không thể áp dụng.");
        }

        var activeYear = await _db.AcademicYears
            .AsNoTracking()
            .FirstOrDefaultAsync(y => y.Status == AcademicYearStateMachine.StatusActive, ct);

        // Sequence generator preparation
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

        var insertedCount = 0;
        var updatedCount = 0;
        var enrolledCount = 0;

        await using var transaction = await _db.Database.BeginTransactionAsync(ct);
        try
        {
            foreach (var row in validRows)
            {
                Student? student = null;

                // Check if existing student by Code
                if (!string.IsNullOrWhiteSpace(row.Code))
                {
                    student = await _db.Students
                        .Include(s => s.Guardians)
                        .FirstOrDefaultAsync(s => s.Code == row.Code.Trim(), ct);
                }

                if (student != null)
                {
                    // UPDATE EXISTING
                    student.FullName = row.FullName;
                    if (!string.IsNullOrWhiteSpace(row.HolyName)) student.HolyName = row.HolyName;
                    if (row.BirthDate.HasValue) student.BirthDate = row.BirthDate.Value.ToDateTime(TimeOnly.MinValue);
                    if (!string.IsNullOrWhiteSpace(row.Gender)) student.Gender = row.Gender;
                    if (row.BranchId.HasValue) student.BranchId = row.BranchId.Value;
                    if (!string.IsNullOrWhiteSpace(row.Area)) student.Area = row.Area;
                    if (!string.IsNullOrWhiteSpace(row.Address)) student.Address = row.Address;
                    if (!string.IsNullOrWhiteSpace(row.BloodType)) student.BloodType = row.BloodType;
                    if (!string.IsNullOrWhiteSpace(row.Allergies)) student.Allergies = row.Allergies;
                    if (!string.IsNullOrWhiteSpace(row.Notes)) student.Notes = row.Notes;

                    // Sacraments
                    if (row.BaptismDate.HasValue) student.BaptismDate = row.BaptismDate.Value.ToDateTime(TimeOnly.MinValue);
                    if (!string.IsNullOrWhiteSpace(row.BaptismPlace)) student.BaptismPlace = row.BaptismPlace;
                    if (row.CommunionDate.HasValue) student.CommunionDate = row.CommunionDate.Value.ToDateTime(TimeOnly.MinValue);
                    if (row.ConfirmationDate.HasValue) student.ConfirmationDate = row.ConfirmationDate.Value.ToDateTime(TimeOnly.MinValue);

                    student.UpdatedAt = DateTime.UtcNow;
                    updatedCount++;
                }
                else
                {
                    // CREATE NEW
                    maxSeq++;
                    var newCode = $"{prefix}{maxSeq:D4}";

                    student = new Student
                    {
                        Id = Guid.NewGuid(),
                        Code = newCode,
                        HolyName = row.HolyName ?? string.Empty,
                        FullName = row.FullName,
                        BirthDate = row.BirthDate!.Value.ToDateTime(TimeOnly.MinValue),
                        Gender = row.Gender,
                        BranchId = row.BranchId,
                        Area = row.Area,
                        Address = row.Address,
                        BloodType = row.BloodType,
                        Allergies = row.Allergies,
                        Status = StudentStateMachine.StatusActive,
                        JoinedOn = DateOnly.FromDateTime(DateTime.UtcNow),
                        Notes = row.Notes,
                        CreatedAt = DateTime.UtcNow
                    };

                    if (row.BaptismDate.HasValue) student.BaptismDate = row.BaptismDate.Value.ToDateTime(TimeOnly.MinValue);
                    if (!string.IsNullOrWhiteSpace(row.BaptismPlace)) student.BaptismPlace = row.BaptismPlace;
                    if (row.CommunionDate.HasValue) student.CommunionDate = row.CommunionDate.Value.ToDateTime(TimeOnly.MinValue);
                    if (row.ConfirmationDate.HasValue) student.ConfirmationDate = row.ConfirmationDate.Value.ToDateTime(TimeOnly.MinValue);

                    _db.Students.Add(student);
                    insertedCount++;

                    _db.StudentStatusChanges.Add(new StudentStatusChange
                    {
                        Id = Guid.NewGuid(),
                        StudentId = student.Id,
                        OldStatus = null,
                        NewStatus = StudentStateMachine.StatusActive,
                        Reason = $"Nhập danh sách từ tệp {job.FileName}",
                        ChangedBy = _currentUser.UserId != Guid.Empty ? _currentUser.UserId : null,
                        ChangedAt = DateTime.UtcNow
                    });
                }

                // Process Guardian
                if (!string.IsNullOrWhiteSpace(row.GuardianPhone) && !string.IsNullOrWhiteSpace(row.GuardianName))
                {
                    var cleanPhone = PhoneNormalizer.Normalize(row.GuardianPhone);
                    var guardian = await _db.Guardians.FirstOrDefaultAsync(g => g.Phone == cleanPhone, ct);
                    if (guardian == null)
                    {
                        guardian = new Guardian
                        {
                            Id = Guid.NewGuid(),
                            FullName = VietnameseNormalizer.CleanDisplay(row.GuardianName),
                            Phone = cleanPhone,
                            CreatedAt = DateTime.UtcNow
                        };
                        _db.Guardians.Add(guardian);
                    }

                    var alreadyLinked = await _db.StudentGuardians.AnyAsync(sg => sg.StudentId == student.Id && sg.GuardianId == guardian.Id, ct);
                    if (!alreadyLinked)
                    {
                        var hasPrimary = await _db.StudentGuardians.AnyAsync(sg => sg.StudentId == student.Id && sg.IsPrimary, ct);
                        _db.StudentGuardians.Add(new StudentGuardian
                        {
                            StudentId = student.Id,
                            GuardianId = guardian.Id,
                            Relationship = string.IsNullOrWhiteSpace(row.GuardianRelationship) ? "Other" : row.GuardianRelationship.Trim(),
                            IsPrimary = !hasPrimary,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }

                // Process Enrollment
                if (row.TargetClassRoomId.HasValue && activeYear != null)
                {
                    var hasActiveEnrollment = await _db.Enrollments
                        .AnyAsync(e => e.StudentId == student.Id && e.AcademicYearId == activeYear.Id && e.Status == "Active", ct);

                    if (!hasActiveEnrollment)
                    {
                        _db.Enrollments.Add(new Enrollment
                        {
                            Id = Guid.NewGuid(),
                            StudentId = student.Id,
                            ClassRoomId = row.TargetClassRoomId.Value,
                            AcademicYearId = activeYear.Id,
                            Status = "Active",
                            CreatedAt = DateTime.UtcNow
                        });
                        enrolledCount++;
                    }
                }
            }

            job.Status = ImportJob.StatusApplied;
            job.AppliedAt = DateTime.UtcNow;
            job.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);

            _logger.LogInformation("Áp dụng phiên nhập {JobId} thành công: {Insert} tạo mới, {Update} cập nhật, {Enroll} xếp lớp", job.Id, insertedCount, updatedCount, enrolledCount);

            return Result.Ok(new ApplyImportResult(
                job.Id,
                insertedCount,
                updatedCount,
                enrolledCount,
                $"Áp dụng thành công: Đã tạo mới {insertedCount} đoàn sinh, cập nhật {updatedCount} đoàn sinh, xếp vào lớp {enrolledCount} đoàn sinh."
            ));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(ct);
            _logger.LogError(ex, "Lỗi xảy ra trong quá trình áp dụng phiên nhập {JobId}", id);
            return Result.BadRequest<ApplyImportResult>(ErrorCodes.InternalError, $"Có lỗi xảy ra trong quá trình ghi dữ liệu: {ex.Message}");
        }
    }

    public async Task<Result<IReadOnlyList<ImportJobSummaryResponse>>> GetImportHistoryAsync(string? importType = null, CancellationToken ct = default)
    {
        var query = _db.ImportJobs.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(importType))
        {
            query = query.Where(j => j.ImportType == importType);
        }

        var list = await query
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => new ImportJobSummaryResponse(
                j.Id,
                j.ImportType,
                j.FileName,
                j.Status,
                j.TotalRows,
                j.ValidRows,
                j.WarningRows,
                j.ErrorRows,
                j.AppliedAt,
                j.CreatedAt
            ))
            .ToListAsync(ct);

        return Result.Ok<IReadOnlyList<ImportJobSummaryResponse>>(list);
    }

    public async Task<Result<ExportFileResult>> ExportStudentsAsync(int? branchId, Guid? classRoomId, string? status, CancellationToken ct = default)
    {
        var query = _db.Students.AsNoTracking();
        query = _scopeContext.Students(query);

        if (branchId.HasValue)
        {
            query = query.Where(s => s.BranchId == branchId.Value);
        }

        if (classRoomId.HasValue)
        {
            var enrolledIds = _db.Enrollments
                .AsNoTracking()
                .Where(e => e.ClassRoomId == classRoomId.Value && e.Status == "Active")
                .Select(e => e.StudentId);

            query = query.Where(s => enrolledIds.Contains(s.Id));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(s => s.Status == status);
        }

        var activeYear = await _db.AcademicYears
            .AsNoTracking()
            .FirstOrDefaultAsync(y => y.Status == AcademicYearStateMachine.StatusActive, ct);

        var hasContact = _currentUser.HasPermission(Permissions.Students.ViewContact);
        var hasHealth = _currentUser.HasPermission(Permissions.Students.ViewHealth);

        var students = await query
            .Include(s => s.BranchEntity)
            .Include(s => s.Guardians)
                .ThenInclude(sg => sg.Guardian)
            .Include(s => s.Enrollments)
                .ThenInclude(e => e.ClassRoom)
                    .ThenInclude(c => c!.ClassLevel)
            .OrderBy(s => s.FullName)
            .ToListAsync(ct);

        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Danh_Sach_Doan_Sinh");

        // Header
        for (int i = 0; i < StudentExcelColumns.Headers.Length; i++)
        {
            var cell = ws.Cell(1, i + 1);
            cell.Value = StudentExcelColumns.Headers[i];
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#1E3A8A");
            cell.Style.Font.FontColor = XLColor.White;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        }

        // Data Rows
        var row = 2;
        foreach (var s in students)
        {
            var activeEnrollment = activeYear != null
                ? s.Enrollments.FirstOrDefault(e => e.AcademicYearId == activeYear.Id && e.Status == "Active")
                : null;

            var primaryGuardian = s.Guardians.FirstOrDefault(g => g.IsPrimary) ?? s.Guardians.FirstOrDefault();

            ws.Cell(row, 1).Value = StudentExcelColumns.SanitizeForExport(s.Code);
            ws.Cell(row, 2).Value = StudentExcelColumns.SanitizeForExport(s.HolyName);
            ws.Cell(row, 3).Value = StudentExcelColumns.SanitizeForExport(s.FullName);
            ws.Cell(row, 4).Value = s.BirthDate.ToString("dd/MM/yyyy");
            ws.Cell(row, 5).Value = StudentExcelColumns.SanitizeForExport(s.Gender);
            ws.Cell(row, 6).Value = hasContact ? StudentExcelColumns.SanitizeForExport(s.Area) : "";
            ws.Cell(row, 7).Value = hasContact ? StudentExcelColumns.SanitizeForExport(s.Address) : "";
            ws.Cell(row, 8).Value = StudentExcelColumns.SanitizeForExport(activeEnrollment?.ClassRoom?.ClassLevel?.Code);
            ws.Cell(row, 9).Value = StudentExcelColumns.SanitizeForExport(activeEnrollment?.ClassRoom?.Section);
            ws.Cell(row, 10).Value = StudentExcelColumns.SanitizeForExport(primaryGuardian?.Guardian?.FullName);
            ws.Cell(row, 11).Value = StudentExcelColumns.SanitizeForExport(primaryGuardian?.Relationship);
            ws.Cell(row, 12).Value = hasContact ? StudentExcelColumns.SanitizeForExport(primaryGuardian?.Guardian?.Phone) : "";
            ws.Cell(row, 13).Value = hasHealth ? StudentExcelColumns.SanitizeForExport(s.BloodType) : "";
            ws.Cell(row, 14).Value = hasHealth ? StudentExcelColumns.SanitizeForExport(s.Allergies) : "";
            ws.Cell(row, 15).Value = s.BaptismDate?.ToString("dd/MM/yyyy") ?? "";
            ws.Cell(row, 16).Value = StudentExcelColumns.SanitizeForExport(s.BaptismPlace);
            ws.Cell(row, 17).Value = s.CommunionDate?.ToString("dd/MM/yyyy") ?? "";
            ws.Cell(row, 18).Value = s.ConfirmationDate?.ToString("dd/MM/yyyy") ?? "";
            ws.Cell(row, 19).Value = StudentExcelColumns.SanitizeForExport(s.Notes);

            row++;
        }

        ws.Columns().AdjustToContents();

        using var ms = new MemoryStream();
        workbook.SaveAs(ms);
        var bytes = ms.ToArray();

        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
        var result = new ExportFileResult(
            bytes,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"DoanSinh_Export_{timestamp}.xlsx"
        );

        _logger.LogInformation("Đã xuất danh sách {Count} đoàn sinh ra tệp Excel (Người xuất: {UserId})", students.Count, _currentUser.UserId);

        return Result.Ok(result);
    }

    private static DateOnly? ParseDateCell(IXLCell cell)
    {
        if (cell.IsEmpty()) return null;

        if (cell.DataType == XLDataType.DateTime)
        {
            var dt = cell.GetDateTime();
            return DateOnly.FromDateTime(dt);
        }

        var str = cell.GetString().Trim();
        if (string.IsNullOrEmpty(str)) return null;

        string[] formats = ["dd/MM/yyyy", "d/M/yyyy", "dd-MM-yyyy", "yyyy-MM-dd", "MM/dd/yyyy"];
        if (DateTime.TryParseExact(str, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed))
        {
            return DateOnly.FromDateTime(parsed);
        }

        if (DateTime.TryParse(str, out var generalParsed))
        {
            return DateOnly.FromDateTime(generalParsed);
        }

        return null;
    }
}

public record ParsedRowData(
    int RowNumber,
    string? Code,
    string? HolyName,
    string FullName,
    DateOnly? BirthDate,
    string? Gender,
    string? Area,
    string? Address,
    int? BranchId,
    Guid? TargetClassRoomId,
    string? GuardianName,
    string? GuardianRelationship,
    string? GuardianPhone,
    string? BloodType,
    string? Allergies,
    DateOnly? BaptismDate,
    string? BaptismPlace,
    DateOnly? CommunionDate,
    DateOnly? ConfirmationDate,
    string? Notes,
    bool IsValid
);

public record InternalImportPayload(
    List<ParsedRowData> Rows,
    List<ImportRowReportDto> Reports
);
