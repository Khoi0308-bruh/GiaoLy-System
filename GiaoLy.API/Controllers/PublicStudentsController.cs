using GiaoLy.API.Common;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Enums;
using GiaoLy.Domain.Rules;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.API.Controllers;

/// <summary>
/// Tra cứu công khai tối thiểu cho đoàn sinh/phụ huynh.
/// Chỉ trả về: mã đoàn sinh, họ tên đã che bớt, lớp, ngành, niên khóa, điểm trung bình.
/// Không trả GUID nội bộ, số điện thoại, địa chỉ, thông tin sức khỏe hay ghi chú.
/// </summary>
[ApiController]
[Route("api/v1/public/students")]
public class PublicStudentsController : ControllerBase
{
    private const string NotFoundDetail = "Không tìm thấy hồ sơ đoàn sinh phù hợp. Vui lòng kiểm tra lại họ tên, ngày sinh hoặc mã đoàn sinh.";

    private readonly AppDbContext _context;

    public PublicStudentsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Tra cứu theo mã đoàn sinh, hoặc theo họ tên đầy đủ + ngày sinh (khớp chính xác).
    /// </summary>
    [HttpGet("lookup")]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimiterExtensions.PolicyVerify)]
    public async Task<IActionResult> Lookup(
        [FromQuery] string? code,
        [FromQuery] string? fullName,
        [FromQuery] DateOnly? birthDate,
        CancellationToken ct)
    {
        var hasCode = !string.IsNullOrWhiteSpace(code);
        var hasNameWithBirthDate = !string.IsNullOrWhiteSpace(fullName) && birthDate.HasValue;

        if (!hasCode && !hasNameWithBirthDate)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Yêu cầu không hợp lệ",
                Detail = "Nhập mã đoàn sinh, hoặc họ tên đầy đủ kèm ngày sinh."
            });
        }

        var query = _context.Students.AsNoTracking().Where(s => s.DeletedAt == null);

        List<Student> matches;

        if (hasCode)
        {
            var normalizedCode = code!.Trim().ToUpperInvariant();
            matches = await query
                .Where(s => s.Code.ToUpper() == normalizedCode)
                .Take(2)
                .ToListAsync(ct);
        }
        else
        {
            var normalizedName = VietnameseNormalizer.NormalizeName(fullName);
            var birth = birthDate!.Value;
            var from = birth.ToDateTime(TimeOnly.MinValue);
            var to = birth.AddDays(1).ToDateTime(TimeOnly.MinValue);

            // Lọc theo ngày sinh trong SQL, rồi so khớp họ tên ở bộ nhớ bằng cùng hàm chuẩn hoá:
            // dữ liệu cũ có FullNameNormalized lưu theo chuẩn khác nên không thể so trực tiếp trong DB.
            var candidates = await query
                .Where(s => s.BirthDate >= from && s.BirthDate < to)
                .Take(50)
                .ToListAsync(ct);

            matches = candidates
                .Where(s => VietnameseNormalizer.NormalizeName(s.FullName) == normalizedName)
                .Take(2)
                .ToList();
        }

        if (matches.Count == 0)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Không tìm thấy",
                Detail = NotFoundDetail
            });
        }

        if (matches.Count > 1)
        {
            // Không tiết lộ danh sách: yêu cầu tra cứu bằng mã đoàn sinh để xác định đúng hồ sơ.
            return Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Nhiều hồ sơ khớp",
                Detail = "Có nhiều hồ sơ khớp thông tin đã nhập. Vui lòng tra cứu bằng mã đoàn sinh."
            });
        }

        var student = matches[0];
        return Ok(await BuildLookupResultAsync(student, ct));
    }

    private async Task<PublicStudentLookupDto> BuildLookupResultAsync(Student student, CancellationToken ct)
    {
        var enrollment = await _context.Enrollments.AsNoTracking()
            .Include(e => e.ClassRoom)!.ThenInclude(c => c!.ClassLevel)
            .Include(e => e.AcademicYear)
            .Include(e => e.Grade)
            .Where(e => e.StudentId == student.Id)
            .OrderByDescending(e => e.AcademicYear!.StartDate)
            .FirstOrDefaultAsync(ct);

        string? branchName = null;
        if (student.BranchId.HasValue)
        {
            branchName = await _context.Branches.AsNoTracking()
                .Where(b => b.Id == student.BranchId.Value)
                .Select(b => b.Name)
                .FirstOrDefaultAsync(ct);
        }
        branchName ??= BranchFallbackName(student.Branch);

        var gpa = enrollment?.Grade?.ComputedGpa;

        return new PublicStudentLookupDto
        {
            StudentCode = student.Code,
            DisplayName = MaskName(student.FullName),
            ClassName = enrollment?.ClassRoom?.ClassName ?? student.ClassName,
            Branch = branchName,
            AcademicYear = enrollment?.AcademicYear?.Name,
            AverageGrade = gpa.HasValue ? Math.Round((double)gpa.Value, 2) : null
        };
    }

    /// <summary>Che bớt ký tự giữa của từng từ: "Nguyễn Văn An" → "N***** V** A*".</summary>
    private static string MaskName(string fullName)
    {
        if (string.IsNullOrWhiteSpace(fullName)) return string.Empty;

        var words = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var masked = words.Select(word => word.Length <= 1
            ? word
            : word[0] + new string('*', word.Length - 1));

        return string.Join(' ', masked);
    }

    private static string BranchFallbackName(HolyBranch branch) => branch switch
    {
        HolyBranch.Au => "Ấu Nhi",
        HolyBranch.Thieu => "Thiếu Nhi",
        HolyBranch.Nghia => "Nghĩa Sĩ",
        HolyBranch.Hiep => "Hiệp Sĩ",
        _ => "Chưa phân ngành"
    };
}

/// <summary>Kết quả tra cứu công khai — cố định 6 trường, không có dữ liệu định danh nội bộ.</summary>
public class PublicStudentLookupDto
{
    public string StudentCode { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? ClassName { get; set; }
    public string? Branch { get; set; }
    public string? AcademicYear { get; set; }
    public double? AverageGrade { get; set; }
}
