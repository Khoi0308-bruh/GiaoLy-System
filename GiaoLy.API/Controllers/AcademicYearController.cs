using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AcademicYearController : ControllerBase
{
    private readonly AppDbContext _context;

    public AcademicYearController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AcademicYear>>> GetYears()
    {
        return await _context.AcademicYears.OrderByDescending(x => x.StartDate).ToListAsync();
    }

    [HttpGet("active")]
    public async Task<ActionResult<AcademicYear>> GetActiveYear()
    {
        var year = await _context.AcademicYears.FirstOrDefaultAsync(x => x.IsActive);
        if (year == null) return NotFound("Chưa có niên khóa nào đang hoạt động.");
        return Ok(year);
    }

    [HttpPost]
    [Authorize(Roles = "1")]
    public async Task<ActionResult<AcademicYear>> CreateYear([FromBody] AcademicYear year)
    {
        year.Id = Guid.NewGuid();
        // Nếu set năm này là Active, tắt các năm khác trực tiếp trong DB
        if (year.IsActive)
        {
            await _context.AcademicYears
                .Where(x => x.IsActive)
                .ExecuteUpdateAsync(s => s.SetProperty(y => y.IsActive, false));
        }

        _context.AcademicYears.Add(year);
        await _context.SaveChangesAsync();
        return Ok(year);
    }

    [HttpPost("activate-new-year")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> ActivateNewYear([FromBody] Guid newYearId)
    {
        // Bản vá: Tắt tất cả niên khóa đang Active trực tiếp dưới DB chỉ với 1 câu lệnh SQL
        await _context.AcademicYears
            .Where(y => y.IsActive)
            .ExecuteUpdateAsync(s => s.SetProperty(y => y.IsActive, false));

        var currentYear = await _context.AcademicYears.FindAsync(newYearId);
        if (currentYear == null) return NotFound("Không tìm thấy niên khóa yêu cầu.");

        currentYear.IsActive = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Kích hoạt niên khóa mới thành công, toàn hệ thống đã đồng bộ dữ liệu." });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> DeleteYear(Guid id)
    {
        var year = await _context.AcademicYears.FindAsync(id);
        if (year == null) return NotFound();
        _context.AcademicYears.Remove(year);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("clone")]
    [Authorize(Roles = "1,2")]
    public async Task<IActionResult> CloneFromOldYear([FromBody] CloneYearRequest request)
    {
        var oldYear = await _context.AcademicYears.FindAsync(request.OldYearId);
        var newYear = await _context.AcademicYears.FindAsync(request.NewYearId);
        if (oldYear == null || newYear == null) return NotFound("Không tìm thấy niên khóa.");

        // 1. Copy danh sách lớp học (Reset GLV)
        var oldClasses = await _context.ClassRooms.AsNoTracking()
            .Where(c => c.AcademicYearId == request.OldYearId)
            .ToListAsync();

        var classMap = new Dictionary<Guid, Guid>();

        foreach (var oldClass in oldClasses)
        {
            var newClass = new ClassRoom
            {
                Id = Guid.NewGuid(),
                AcademicYearId = request.NewYearId,
                ClassName = oldClass.ClassName,
                Branch = oldClass.Branch,
                RoomName = oldClass.RoomName,
                MainTeacher = string.Empty,
                LeaderId = null // Quan trọng: Bỏ trống GLV để phân công lại
            };
            _context.ClassRooms.Add(newClass);
            classMap[oldClass.Id] = newClass.Id;
        }

        await _context.SaveChangesAsync();

        // 2. Tạo danh sách DraftAction cho học sinh
        var oldClassIds = oldClasses.Select(c => c.Id).ToList();
        var enrollments = await _context.Enrollments.AsNoTracking()
            .Include(e => e.Grade)
            .Where(e => oldClassIds.Contains(e.ClassRoomId) && e.Status == "Active")
            .ToListAsync();

        var grades = enrollments
            .Where(e => e.Grade != null)
            .ToDictionary(e => e.StudentId, e => e.Grade!);

        var draftActions = new List<DraftAction>();

        foreach (var enroll in enrollments)
        {
            grades.TryGetValue(enroll.StudentId, out var grade);

            bool isQualified = grade?.IsQualified ?? false;
            string reason = string.Empty;

            if (!isQualified)
            {
                if (grade == null) reason = "Chưa có điểm";
                else if (grade.GPA < 5.0) reason = $"ĐTB thấp ({grade.GPA})";
                else reason = $"Vắng {grade.Absences}/{grade.TotalSessions} buổi";
            }

            draftActions.Add(new DraftAction
            {
                Id = Guid.NewGuid(),
                TargetAcademicYearId = request.NewYearId,
                StudentId = enroll.StudentId,
                // Nếu ở lại, gợi ý xếp lại vào đúng lớp cũ (đã copy sang năm mới). Nếu lên lớp, để trống để BĐH tự xếp.
                SuggestedClassRoomId = isQualified ? null : classMap.GetValueOrDefault(enroll.ClassRoomId),
                IsQualified = isQualified,
                Reason = reason,
                Status = "Pending"
            });
        }

        if (draftActions.Any())
        {
            _context.DraftActions.AddRange(draftActions);
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "Sao chép thành công. Đã tạo danh sách lớp mới và dự kiến lên lớp." });
    }

    // ── ClassRoom sub-routes ──────────────────────────────────────────────────

    [HttpGet("{yearId:guid}/classrooms")]
    public async Task<ActionResult<IEnumerable<ClassRoom>>> GetClassRooms(Guid yearId)
    {
        return await _context.ClassRooms
            .Where(c => c.AcademicYearId == yearId)
            .OrderBy(c => c.Branch)
            .ThenBy(c => c.ClassName)
            .ToListAsync();
    }

    [HttpPost("{yearId:guid}/classrooms")]
    [Authorize(Roles = "1")]
    public async Task<ActionResult<ClassRoom>> CreateClassRoom(Guid yearId, [FromBody] ClassRoom room)
    {
        room.Id = Guid.NewGuid();
        room.AcademicYearId = yearId;
        _context.ClassRooms.Add(room);
        await _context.SaveChangesAsync();
        return Ok(room);
    }

    [HttpDelete("classrooms/{id:guid}")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> DeleteClassRoom(Guid id)
    {
        var room = await _context.ClassRooms.FindAsync(id);
        if (room == null) return NotFound();

        // Xoá toàn bộ enrollments liên kết trước
        var enrollments = await _context.Enrollments.Where(e => e.ClassRoomId == id).ToListAsync();
        _context.Enrollments.RemoveRange(enrollments);

        _context.ClassRooms.Remove(room);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("classrooms/{id:guid}")]
    [Authorize(Roles = "1,2")]
    public async Task<IActionResult> UpdateClassRoom(Guid id, [FromBody] ClassRoom room)
    {
        var existing = await _context.ClassRooms.FindAsync(id);
        if (existing == null) return NotFound();

        existing.ClassName = room.ClassName;
        existing.Branch = room.Branch;
        existing.MainTeacher = room.MainTeacher;
        existing.RoomName = room.RoomName;
        existing.LeaderId = room.LeaderId; // Bản vá: Cho phép gán tài khoản phụ trách để phân quyền

        await _context.SaveChangesAsync();
        return Ok(existing);
    }
}

public class CloneYearRequest
{
    public Guid OldYearId { get; set; }
    public Guid NewYearId { get; set; }
}