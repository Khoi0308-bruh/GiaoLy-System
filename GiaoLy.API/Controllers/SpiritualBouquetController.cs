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
[Authorize(Roles = "1,2,3")] // Admin, Thư ký, GLV
public class SpiritualBouquetController : ControllerBase
{
    private readonly AppDbContext _context;

    public SpiritualBouquetController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("classroom/{classRoomId:guid}")]
    public async Task<ActionResult<IEnumerable<SpiritualBouquet>>> GetByClass(Guid classRoomId)
    {
        return await _context.SpiritualBouquets
            .Where(b => b.ClassRoomId == classRoomId)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> AddBouquet([FromBody] SpiritualBouquet bouquet)
    {
        bouquet.Id = Guid.NewGuid();
        bouquet.Date = DateTime.Now;
        _context.SpiritualBouquets.Add(bouquet);
        await _context.SaveChangesAsync();
        return Ok(bouquet);
    }
}
