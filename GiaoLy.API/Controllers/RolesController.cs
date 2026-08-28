using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GiaoLy.API.Helpers;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly AppDbContext _context;

    public RolesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [RequirePermission("roles.view")]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _context.Roles
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.Code,
                r.Description,
                UserCount = r.Users.Count
            })
            .ToListAsync();

        return Ok(roles);
    }

    [HttpGet("{id}")]
    [RequirePermission("roles.view")]
    public async Task<IActionResult> GetRole(Guid id)
    {
        var role = await _context.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (role == null) return NotFound();

        return Ok(new
        {
            role.Id,
            role.Name,
            role.Code,
            role.Description,
            Permissions = role.RolePermissions.Select(rp => rp.PermissionId).ToList()
        });
    }

    [HttpPost]
    [RequirePermission("roles.create")]
    public async Task<IActionResult> CreateRole([FromBody] Role dto)
    {
        var role = new Role
        {
            Name = dto.Name,
            Code = dto.Code,
            Description = dto.Description
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        return Ok(role);
    }

    [HttpPut("{id}")]
    [RequirePermission("roles.update")]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] Role dto)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null) return NotFound();

        role.Name = dto.Name;
        role.Code = dto.Code;
        role.Description = dto.Description;

        await _context.SaveChangesAsync();
        return Ok(role);
    }

    [HttpDelete("{id}")]
    [RequirePermission("roles.delete")]
    public async Task<IActionResult> DeleteRole(Guid id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null) return NotFound();

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa thành công" });
    }

    [HttpGet("permissions")]
    [RequirePermission("roles.view")]
    public async Task<IActionResult> GetPermissions()
    {
        var permissions = await _context.Permissions
            .OrderBy(p => p.Module)
            .ThenBy(p => p.Name)
            .ToListAsync();

        return Ok(permissions);
    }

    [HttpPost("{roleId}/permissions")]
    [RequirePermission("roles.assign")]
    public async Task<IActionResult> AssignPermissions(Guid roleId, [FromBody] List<Guid> permissionIds)
    {
        var role = await _context.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Id == roleId);

        if (role == null) return NotFound();

        _context.RolePermissions.RemoveRange(role.RolePermissions);
        
        foreach (var pId in permissionIds)
        {
            _context.RolePermissions.Add(new RolePermission
            {
                RoleId = roleId,
                PermissionId = pId
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật quyền thành công" });
    }

    [HttpPost("migrate-users")]
    [RequirePermission("roles.update")]
    public async Task<IActionResult> MigrateUsers()
    {
        var users = await _context.Users.Where(u => u.RoleId == null).ToListAsync();
        var roles = await _context.Roles.ToListAsync();

        int count = 0;
        foreach (var user in users)
        {
            var targetRole = roles.FirstOrDefault(r => r.Code == user.Role);
            if (targetRole != null)
            {
                user.RoleId = targetRole.Id;
                count++;
            }
        }

        if (count > 0)
        {
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = $"Đã chuyển đổi thành công {count} tài khoản sang hệ thống RBAC mới." });
    }
}
