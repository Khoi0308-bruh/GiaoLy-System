using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "1,2,3")]
public class SacramentController : ControllerBase
{
    private readonly AppDbContext _context;

    public SacramentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("requirements")]
    public async Task<ActionResult<IEnumerable<SacramentRequirement>>> GetRequirements()
    {
        return await _context.SacramentRequirements.OrderBy(r => r.Order).ToListAsync();
    }

    [HttpGet("records/student/{studentId:guid}")]
    public async Task<ActionResult<IEnumerable<SacramentRecord>>> GetRecords(Guid studentId)
    {
        return await _context.SacramentRecords
            .Where(r => r.StudentId == studentId)
            .ToListAsync();
    }

    [HttpPost("records")]
    public async Task<IActionResult> SaveRecord([FromBody] SacramentRecord record)
    {
        var existing = await _context.SacramentRecords
            .FirstOrDefaultAsync(r => r.StudentId == record.StudentId && r.SacramentRequirementId == record.SacramentRequirementId);

        if (existing != null)
        {
            existing.IsCompleted = record.IsCompleted;
            existing.CompletedDate = record.CompletedDate;
            existing.Note = record.Note;
            _context.SacramentRecords.Update(existing);
        }
        else
        {
            record.Id = Guid.NewGuid();
            _context.SacramentRecords.Add(record);
        }

        await _context.SaveChangesAsync();
        return Ok(record);
    }
}
