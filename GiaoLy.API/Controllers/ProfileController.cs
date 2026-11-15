using GiaoLy.API.Common;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Identity.Contracts;
using GiaoLy.Application.Identity.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GiaoLy.API.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/me")]
[Route("api/me")]
public class ProfileController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IConfiguration _config;
    private readonly IWebHostEnvironment _env;

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };

    public ProfileController(IAuthService authService, IConfiguration config, IWebHostEnvironment env)
    {
        _authService = authService;
        _config = config;
        _env = env;
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request, CancellationToken ct)
    {
        var result = await _authService.UpdateProfileAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPost("avatar")]
    [EnableRateLimiting(RateLimiterExtensions.PolicyUpload)]
    public async Task<IActionResult> UploadAvatar(IFormFile file, CancellationToken ct)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Bad Request",
                Detail = "Vui lòng chọn tệp ảnh hợp lệ."
            });
        }

        // Max 2 MB
        if (file.Length > 2 * 1024 * 1024)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Bad Request",
                Detail = "Dung lượng ảnh đại diện tối đa là 2 MB."
            });
        }

        var ext = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(ext) || !AllowedExtensions.Contains(ext))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Bad Request",
                Detail = "Chỉ chấp nhận định dạng ảnh JPG, PNG hoặc WEBP."
            });
        }

        // Validate magic bytes
        using var stream = file.OpenReadStream();
        var header = new byte[8];
        var bytesRead = await stream.ReadAsync(header, 0, header.Length, ct);
        stream.Position = 0;

        if (!IsValidImageHeader(header, ext))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Bad Request",
                Detail = "Nội dung tệp không phải là ảnh hợp lệ."
            });
        }

        var storageRoot = _config["Storage:Root"] ?? Path.Combine(_env.ContentRootPath, "uploads");
        var avatarsDir = Path.Combine(storageRoot, "avatars");
        if (!Directory.Exists(avatarsDir))
        {
            Directory.CreateDirectory(avatarsDir);
        }

        var fileName = $"{Guid.NewGuid():N}{ext.ToLowerInvariant()}";
        var fullPath = Path.Combine(avatarsDir, fileName);

        using (var destStream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(destStream, ct);
        }

        var relativePath = $"/uploads/avatars/{fileName}";
        var result = await _authService.UpdateAvatarAsync(relativePath, ct);
        return result.ToActionResult();
    }

    private static bool IsValidImageHeader(byte[] header, string ext)
    {
        if (header.Length < 4) return false;

        // JPEG: FF D8 FF
        if (header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF) return true;

        // PNG: 89 50 4E 47
        if (header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47) return true;

        // WEBP: RIFF ... WEBP (52 49 46 46)
        if (header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46) return true;

        return false;
    }
}
