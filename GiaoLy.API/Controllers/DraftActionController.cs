using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "1,2")] // BĐH và Thư ký
public class DraftActionController : ControllerBase
{
    private readonly AppDbContext _context;

    public DraftActionController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{academicYearId:guid}")]
    public async Task<ActionResult<IEnumerable<DraftAction>>> GetDrafts(Guid academicYearId)
    {
        return await _context.DraftActions.AsNoTracking()
            .Include(d => d.Student)
            .Include(d => d.SuggestedClassRoom)
            .Where(d => d.TargetAcademicYearId == academicYearId)
            .ToListAsync();
    }

    [HttpPost("approve/{id:guid}")]
    public async Task<IActionResult> ApproveDraft(Guid id)
    {
        var draft = await _context.DraftActions.FindAsync(id);
        if (draft == null) return NotFound();

        if (draft.Status != "Pending") return BadRequest("Chỉ có thể duyệt nháp đang chờ xử lý.");

        draft.Status = "Approved";
        
        // Nếu đã gán lớp thì xếp luôn vào lớp đó
        if (draft.SuggestedClassRoomId.HasValue)
        {
            _context.Enrollments.Add(new Enrollment
            {
                Id = Guid.NewGuid(),
                StudentId = draft.StudentId,
                ClassRoomId = draft.SuggestedClassRoomId.Value,
                Status = "Active"
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }
    
    [HttpPost("reject/{id:guid}")]
    public async Task<IActionResult> RejectDraft(Guid id)
    {
        var draft = await _context.DraftActions.FindAsync(id);
        if (draft == null) return NotFound();

        draft.Status = "Rejected";
        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpPost("bulk-approve/{academicYearId:guid}")]
    public async Task<IActionResult> BulkApprove(Guid academicYearId)
    {
        var drafts = await _context.DraftActions
            .Where(d => d.TargetAcademicYearId == academicYearId && d.Status == "Pending")
            .ToListAsync();

        if (!drafts.Any()) return Ok(new { success = true, count = 0 });

        foreach (var draft in drafts)
        {
            draft.Status = "Approved";
            if (draft.SuggestedClassRoomId.HasValue)
            {
                _context.Enrollments.Add(new Enrollment
                {
                    Id = Guid.NewGuid(),
                    StudentId = draft.StudentId,
                    ClassRoomId = draft.SuggestedClassRoomId.Value,
                    Status = "Active"
                });
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { success = true, count = drafts.Count });
    }

    [HttpPost("bulk-reject/{academicYearId:guid}")]
    public async Task<IActionResult> BulkReject(Guid academicYearId)
    {
        var drafts = await _context.DraftActions
            .Where(d => d.TargetAcademicYearId == academicYearId && d.Status == "Pending")
            .ToListAsync();

        if (!drafts.Any()) return Ok(new { success = true, count = 0 });

        foreach (var draft in drafts)
        {
            draft.Status = "Rejected";
        }

        await _context.SaveChangesAsync();
        return Ok(new { success = true, count = drafts.Count });
    }
}
