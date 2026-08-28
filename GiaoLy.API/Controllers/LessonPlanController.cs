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
public class LessonPlanController : ControllerBase
{
    private readonly AppDbContext _context;

    public LessonPlanController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LessonPlan>>> GetLessonPlans()
    {
        return await _context.LessonPlans.OrderByDescending(p => p.CreatedDate).ToListAsync();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<LessonPlan>> GetLessonPlan(Guid id)
    {
        var plan = await _context.LessonPlans.FindAsync(id);
        if (plan == null) return NotFound();
        return plan;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePlan([FromBody] LessonPlan plan)
    {
        plan.Id = Guid.NewGuid();
        plan.CreatedDate = DateTime.UtcNow;
        _context.LessonPlans.Add(plan);
        await _context.SaveChangesAsync();
        return Ok(plan);
    }
}
