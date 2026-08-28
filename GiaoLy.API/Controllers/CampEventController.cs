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
public class CampEventController : ControllerBase
{
    private readonly AppDbContext _context;

    public CampEventController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CampEvent>>> GetEvents()
    {
        return await _context.CampEvents.OrderByDescending(e => e.StartDate).ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> CreateEvent([FromBody] CampEvent campEvent)
    {
        campEvent.Id = Guid.NewGuid();
        _context.CampEvents.Add(campEvent);
        await _context.SaveChangesAsync();
        return Ok(campEvent);
    }

    [HttpGet("{eventId:guid}/registrations")]
    public async Task<ActionResult<IEnumerable<CampRegistration>>> GetRegistrations(Guid eventId)
    {
        return await _context.CampRegistrations
            .Where(r => r.CampEventId == eventId)
            .ToListAsync();
    }

    [HttpPost("registrations")]
    public async Task<IActionResult> RegisterStudent([FromBody] CampRegistration registration)
    {
        registration.Id = Guid.NewGuid();
        _context.CampRegistrations.Add(registration);
        await _context.SaveChangesAsync();
        return Ok(registration);
    }
}
