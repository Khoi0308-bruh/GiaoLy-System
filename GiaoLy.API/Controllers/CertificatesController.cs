using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Certificates.Contracts;
using GiaoLy.Application.Certificates.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GiaoLy.API.Controllers;

[ApiController]
public class CertificatesController : ControllerBase
{
    private readonly ICertificateService _certificateService;

    public CertificatesController(ICertificateService certificateService)
    {
        _certificateService = certificateService;
    }

    [HttpGet("api/v1/students/{id:guid}/certificates")]
    [HttpGet("api/students/{id:guid}/certificates")]
    [RequirePermission(Permissions.Certificates.View)]
    public async Task<IActionResult> GetStudentCertificates(Guid id, CancellationToken ct)
    {
        var result = await _certificateService.GetStudentCertificatesAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/students/{id:guid}/certificates")]
    [HttpPost("api/students/{id:guid}/certificates")]
    [RequirePermission(Permissions.Certificates.Issue)]
    public async Task<IActionResult> IssueCertificate(
        Guid id,
        [FromBody] GiaoLy.Application.Certificates.Dtos.IssueCertificateRequest request,
        CancellationToken ct)
    {
        var result = await _certificateService.IssueCertificateAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/certificates/{id:guid}/revoke")]
    [HttpPost("api/certificates/{id:guid}/revoke")]
    [RequirePermission(Permissions.Certificates.Revoke)]
    public async Task<IActionResult> RevokeCertificate(
        Guid id,
        [FromBody] RevokeCertificateRequest request,
        CancellationToken ct)
    {
        var result = await _certificateService.RevokeCertificateAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/certificates/{id:guid}/pdf")]
    [HttpGet("api/certificates/{id:guid}/pdf")]
    [RequirePermission(Permissions.Certificates.View)]
    public async Task<IActionResult> GetCertificatePdf(Guid id, CancellationToken ct)
    {
        var result = await _certificateService.GetCertificatePdfAsync(id, ct);
        if (!result.IsSuccess)
        {
            return result.ToActionResult();
        }

        var file = result.Value!;
        return File(file.Content, file.ContentType, file.FileName);
    }

    [HttpGet("api/v1/public/certificates/verify")]
    [HttpGet("api/public/certificates/verify")]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimiterExtensions.PolicyVerify)]
    public async Task<IActionResult> VerifyPublicCertificate([FromQuery] string code, CancellationToken ct)
    {
        var result = await _certificateService.VerifyPublicCertificateAsync(code, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/public/certificates/pdf")]
    [HttpGet("api/public/certificates/pdf")]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimiterExtensions.PolicyVerify)]
    public async Task<IActionResult> GetPublicCertificatePdf([FromQuery] string code, CancellationToken ct)
    {
        var result = await _certificateService.GetPublicCertificatePdfAsync(code, ct);
        if (!result.IsSuccess)
        {
            return result.ToActionResult();
        }

        var file = result.Value!;
        return File(file.Content, file.ContentType, file.FileName);
    }
}
