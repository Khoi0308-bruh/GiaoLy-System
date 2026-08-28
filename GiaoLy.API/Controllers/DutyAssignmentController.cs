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
public class DutyAssignmentController : ControllerBase
{
    private readonly AppDbContext _context;

    public DutyAssignmentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("classroom/{classRoomId:guid}")]
    public async Task<ActionResult<IEnumerable<DutyAssignment>>> GetByClass(Guid classRoomId)
    {
        return await _context.DutyAssignments
            .Where(d => d.ClassRoomId == classRoomId)
            .OrderBy(d => d.DutyDate)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> CreateAssignment([FromBody] DutyAssignment assignment)
    {
        assignment.Id = Guid.NewGuid();
        _context.DutyAssignments.Add(assignment);
        await _context.SaveChangesAsync();
        return Ok(assignment);
    }
}
