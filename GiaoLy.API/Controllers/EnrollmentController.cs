using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EnrollmentController : ControllerBase
{
    private readonly AppDbContext _context;

    public EnrollmentController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>GET danh sách học sinh thuộc một lớp học</summary>
    [HttpGet("classroom/{classRoomId:guid}")]
    public async Task<ActionResult<IEnumerable<Enrollment>>> GetClassRoomEnrollments(Guid classRoomId)
    {
        return await _context.Enrollments
            .Include(e => e.Student)
            .Where(e => e.ClassRoomId == classRoomId)
            .ToListAsync();
    }

    /// <summary>GET học sinh tự do (chưa xếp lớp) trong một niên khóa cụ thể</summary>
    [HttpGet("unassigned/{yearId:guid}")]
    public async Task<ActionResult<IEnumerable<Student>>> GetUnassignedStudents(Guid yearId)
    {
        // [Tối ưu hiệu năng]: Sử dụng IQueryable (Subquery) thay vì ToListAsync() để tránh lỗi quá tải tham số (Parameter Sniffing) khi số lượng lớn.
        var assignedStudentIdsQuery = _context.Enrollments
            .Where(e => e.ClassRoom!.AcademicYearId == yearId)
            .Select(e => e.StudentId);

        var unassignedStudents = await _context.Students
            .Where(s => s.IsActive && !assignedStudentIdsQuery.Contains(s.Id))
            .OrderBy(s => s.FullName)
            .ToListAsync();

        return Ok(unassignedStudents);
    }

    /// <summary>POST xếp học sinh vào lớp (hỗ trợ thêm hàng loạt)</summary>
    [HttpPost]
    [Authorize(Roles = "1,2")]
    public async Task<IActionResult> EnrollStudents([FromBody] EnrollRequest request)
    {
        if (request == null || !request.StudentIds.Any())
            return BadRequest("Danh sách học sinh trống.");

        var classRoom = await _context.ClassRooms.FindAsync(request.ClassRoomId);
        if (classRoom == null) return NotFound("Lớp học không tồn tại.");

        var newEnrollments = new List<Enrollment>();

        // [Tối ưu hiệu năng]: Truy vấn 1 lần thay vì dùng vòng lặp (Tránh lỗi N+1 Query)
        var existingStudentIds = await _context.Enrollments
            .Where(e => request.StudentIds.Contains(e.StudentId) && e.ClassRoomId == request.ClassRoomId)
            .Select(e => e.StudentId)
            .ToListAsync();

        foreach (var studentId in request.StudentIds)
        {
            if (existingStudentIds.Contains(studentId)) continue;

            newEnrollments.Add(new Enrollment
            {
                Id = Guid.NewGuid(),
                StudentId = studentId,
                ClassRoomId = request.ClassRoomId,
                Status = "Active",
                Note = "Được xếp vào lớp thủ công."
            });
        }

        if (newEnrollments.Any())
        {
            _context.Enrollments.AddRange(newEnrollments);
            await _context.SaveChangesAsync();
        }

        return Ok(new { count = newEnrollments.Count });
    }

    /// <summary>DELETE rút học sinh ra khỏi lớp</summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "1,2")]
    public async Task<IActionResult> UnenrollStudent(Guid id)
    {
        var enrollment = await _context.Enrollments.FindAsync(id);
        if (enrollment == null) return NotFound();

        _context.Enrollments.Remove(enrollment);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>POST Lên lớp tự động (Smart Promotion)</summary>
    [HttpPost("promote")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> PromoteStudents([FromBody] PromotionRequest request)
    {
        if (request.SourceYearId == request.TargetYearId)
            return BadRequest("Niên khóa nguồn và niên khóa đích không thể trùng nhau.");

        var sourceRooms = await _context.ClassRooms
            .Where(r => r.AcademicYearId == request.SourceYearId)
            .ToListAsync();

        var targetRooms = await _context.ClassRooms
            .Where(r => r.AcademicYearId == request.TargetYearId)
            .ToListAsync();

        int promotedCount = 0;

        foreach (var sourceRoom in sourceRooms)
        {
            var studentIds = await _context.Enrollments
                .Where(e => e.ClassRoomId == sourceRoom.Id && e.Status == "Active")
                .Select(e => e.StudentId)
                .ToListAsync();

            if (!studentIds.Any()) continue;

            // Xác định tên lớp đích luỹ tiến (ví dụ: Ấu 1 -> Ấu 2)
            string targetClassName = PromoteClassName(sourceRoom.ClassName);
            var targetRoom = targetRooms.FirstOrDefault(r => r.ClassName == targetClassName);

            if (targetRoom == null)
            {
                targetRoom = new ClassRoom
                {
                    Id = Guid.NewGuid(),
                    AcademicYearId = request.TargetYearId,
                    ClassName = targetClassName,
                    Branch = sourceRoom.Branch,
                    MainTeacher = sourceRoom.MainTeacher,
                    RoomName = sourceRoom.RoomName
                };
                _context.ClassRooms.Add(targetRoom);
                targetRooms.Add(targetRoom);
                await _context.SaveChangesAsync();
            }

            foreach (var studentId in studentIds)
            {
                var alreadyEnrolled = await _context.Enrollments
                    .AnyAsync(e => e.StudentId == studentId && e.ClassRoom!.AcademicYearId == request.TargetYearId);

                if (alreadyEnrolled) continue;

                _context.Enrollments.Add(new Enrollment
                {
                    Id = Guid.NewGuid(),
                    StudentId = studentId,
                    ClassRoomId = targetRoom.Id,
                    Status = "Active",
                    Note = $"Được tự động lên lớp từ {sourceRoom.ClassName}"
                });
                promotedCount++;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { count = promotedCount });
    }

    private string PromoteClassName(string name)
    {
        name = name.Trim();
        var map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "Chiên 1", "Chiên 2" },
            { "Chiên 2", "Chiên 3" },
            { "Chiên 3", "Ấu 1" },
            { "Ấu 1", "Ấu 2" },
            { "Ấu 2", "Ấu 3" },
            { "Ấu 3", "Thiếu 1" },
            { "Thiếu 1", "Thiếu 2" },
            { "Thiếu 2", "Thiếu 3" },
            { "Thiếu 3", "Nghĩa 1" },
            { "Nghĩa 1", "Nghĩa 2" },
            { "Nghĩa 2", "Nghĩa 3" },
            { "Nghĩa 3", "Nghĩa 4" },
            { "Nghĩa 4", "Hiệp 1" },
            { "Hiệp 1", "Hiệp 2" },
            { "Hiệp 2", "Hiệp 3" },
            { "Hiệp 3", "Hiệp 4" }
        };

        if (map.TryGetValue(name, out string? nextClass) && nextClass != null)
        {
            return nextClass;
        }

        // Fallback for custom names
        return Regex.Replace(name, @"\d+", match =>
        {
            if (int.TryParse(match.Value, out int currentVal))
            {
                return (currentVal + 1).ToString();
            }
            return match.Value;
        });
    }
}

public class EnrollRequest
{
    public Guid ClassRoomId { get; set; }
    public List<Guid> StudentIds { get; set; } = new();
}

public class PromotionRequest
{
    public Guid SourceYearId { get; set; }
    public Guid TargetYearId { get; set; }
}
