using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BannersController : ControllerBase
{
    private readonly AppDbContext _context;

    public BannersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/banners/active (For Web Portal)
    [HttpGet("active")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Banner>>> GetActiveBanners()
    {
        return await _context.Banners
            .Where(b => b.IsActive)
            .OrderBy(b => b.OrderIndex)
            .ThenByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    // GET: api/banners (For Admin)
    [HttpGet]
    [RequirePermission("system.manage")]
    public async Task<ActionResult<IEnumerable<Banner>>> GetAllBanners()
    {
        return await _context.Banners
            .OrderBy(b => b.OrderIndex)
            .ThenByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    [HttpPost]
    [RequirePermission("system.manage")]
    public async Task<ActionResult<Banner>> CreateBanner(Banner banner)
    {
        banner.Id = Guid.NewGuid();
        banner.CreatedAt = DateTime.UtcNow;
        _context.Banners.Add(banner);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAllBanners), new { id = banner.Id }, banner);
    }

    [HttpPut("{id}")]
    [RequirePermission("system.manage")]
    public async Task<IActionResult> UpdateBanner(Guid id, Banner banner)
    {
        if (id != banner.Id) return BadRequest();

        var existing = await _context.Banners.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Title = banner.Title;
        existing.ImageUrl = banner.ImageUrl;
        existing.Link = banner.Link;
        existing.OrderIndex = banner.OrderIndex;
        existing.IsActive = banner.IsActive;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [RequirePermission("system.manage")]
    public async Task<IActionResult> DeleteBanner(Guid id)
    {
        var banner = await _context.Banners.FindAsync(id);
        if (banner == null) return NotFound();

        _context.Banners.Remove(banner);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
