using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StudentScoreController : ControllerBase
{
    private readonly AppDbContext _context;

    public StudentScoreController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("class/{className}")]
    public async Task<ActionResult<IEnumerable<StudentScoreDto>>> GetScoresByClass(string className)
    {
        className = Uri.UnescapeDataString(className);
        
        // Lấy danh sách học sinh thuộc lớp này
        var students = await _context.Students.AsNoTracking()
            .Where(s => s.ClassName == className && s.IsActive)
            .OrderBy(s => s.FullName)
            .ToListAsync();

        if (!students.Any()) return NotFound("Lớp này không có học sinh hoặc không tồn tại.");

        var studentIds = students.Select(s => s.Id).ToList();

        // Lấy điểm hiện tại
        var existingScores = await _context.StudentScores.AsNoTracking()
            .Where(s => studentIds.Contains(s.StudentId))
            .ToDictionaryAsync(s => s.StudentId);

        var result = new List<StudentScoreDto>();

        foreach (var student in students)
        {
            if (existingScores.TryGetValue(student.Id, out var score))
            {
                result.Add(new StudentScoreDto
                {
                    Id = score.Id,
                    StudentId = score.StudentId,
                    FullName = student.FullName,
                    HolyName = student.HolyName,
                    ClassName = score.ClassName,
                    Semester1 = score.Semester1,
                    Semester2 = score.Semester2,
                    FinalScore = score.FinalScore,
                    Remarks = score.Remarks
                });
            }
            else
            {
                // Trả về Dto rỗng cho người dùng nhập
                result.Add(new StudentScoreDto
                {
                    Id = Guid.Empty,
                    StudentId = student.Id,
                    FullName = student.FullName,
                    HolyName = student.HolyName,
                    ClassName = className,
                    Semester1 = null,
                    Semester2 = null,
                    FinalScore = null,
                    Remarks = null
                });
            }
        }

        return Ok(result);
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveScores([FromBody] List<StudentScoreDto> requests)
    {
        if (requests == null || !requests.Any()) return BadRequest("Không có dữ liệu.");

        var toInsert = new List<StudentScore>();
        var toUpdate = new List<StudentScore>();

        foreach (var req in requests)
        {
            if (req.Id != Guid.Empty)
            {
                var score = await _context.StudentScores.FindAsync(req.Id);
                if (score != null)
                {
                    score.Semester1 = req.Semester1;
                    score.Semester2 = req.Semester2;
                    score.FinalScore = req.FinalScore ?? (req.Semester1 + req.Semester2) / 2.0;
                    score.Remarks = req.Remarks;
                    toUpdate.Add(score);
                }
            }
            else
            {
                // Kiểm tra xem đã có điểm trong DB chưa (phòng trường hợp submit 2 lần)
                var existing = await _context.StudentScores
                    .FirstOrDefaultAsync(s => s.StudentId == req.StudentId);
                    
                if (existing != null)
                {
                    existing.Semester1 = req.Semester1;
                    existing.Semester2 = req.Semester2;
                    existing.FinalScore = req.FinalScore ?? (req.Semester1 + req.Semester2) / 2.0;
                    existing.Remarks = req.Remarks;
                    toUpdate.Add(existing);
                }
                else
                {
                    var newScore = new StudentScore
                    {
                        Id = Guid.NewGuid(),
                        StudentId = req.StudentId,
                        ClassName = req.ClassName,
                        Semester1 = req.Semester1,
                        Semester2 = req.Semester2,
                        FinalScore = req.FinalScore ?? (req.Semester1 + req.Semester2) / 2.0,
                        Remarks = req.Remarks
                    };
                    toInsert.Add(newScore);
                }
            }
        }

        if (toInsert.Any()) await _context.StudentScores.AddRangeAsync(toInsert);
        if (toUpdate.Any()) _context.StudentScores.UpdateRange(toUpdate);

        await _context.SaveChangesAsync();
        return Ok(new { message = "Lưu điểm thành công." });
    }
}

public class StudentScoreDto
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string HolyName { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public double? Semester1 { get; set; }
    public double? Semester2 { get; set; }
    public double? FinalScore { get; set; }
    public string? Remarks { get; set; }
}
