using GiaoLy.API.Authorization;
using GiaoLy.API.Helpers;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CertificateController : ControllerBase
{
    private readonly AppDbContext _context;

    public CertificateController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>GET tra cứu chứng chỉ theo mã xác thực QR (Công khai cho toàn bộ phụ huynh/quan khách)</summary>
    [HttpGet("verify/{code}")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyCertificate(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
            return BadRequest("Mã xác thực không hợp lệ.");

        var cert = await _context.Certificates
            .Include(c => c.Student)
            .FirstOrDefaultAsync(c => c.VerificationCode.ToUpper() == code.ToUpper());

        if (cert == null)
            return NotFound(new { message = "Chứng chỉ này không tồn tại hoặc đã bị thu hồi khỏi hệ thống dữ liệu Giáo xứ." });

        return Ok(new
        {
            VerificationCode = cert.VerificationCode,
            CertificateType = cert.CertificateType,
            Celebrant = cert.Celebrant,
            Godparent = cert.Godparent,
            IssueDate = cert.IssueDate,
            SignedBy = cert.SignedBy,
            Student = new
            {
                HolyName = cert.Student?.HolyName,
                FullName = cert.Student?.FullName,
                BirthDate = cert.Student?.BirthDate,
                BaptismDate = cert.Student?.BaptismDate,
                BaptismPlace = cert.Student?.BaptismPlace,
                CommunionDate = cert.Student?.CommunionDate,
                ConfirmationDate = cert.Student?.ConfirmationDate
            }
        });
    }

    /// <summary>GET liệt kê toàn bộ chứng chỉ đã cấp của một đoàn sinh</summary>
    [HttpGet("student/{studentId:guid}")]
    public async Task<IActionResult> GetStudentCertificates(Guid studentId)
    {
        var certs = await _context.Certificates
            .Where(c => c.StudentId == studentId)
            .OrderByDescending(c => c.IssueDate)
            .ToListAsync();

        return Ok(certs);
    }

    /// <summary>GET tải PDF chứng thư với QuestPDF</summary>
    [HttpGet("download/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> DownloadCertificatePdf(Guid id)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var cert = await _context.Certificates
            .Include(c => c.Student)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (cert == null) return NotFound("Không tìm thấy chứng thư.");

        var document = QuestPDF.Fluent.Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(1.5f, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(14).FontFamily("Times New Roman"));

                page.Content().Border(5).BorderColor("#0A2540").Padding(1, Unit.Centimetre).Column(col =>
                {
                    col.Item().AlignCenter().Text("GIÁO XỨ CHÍNH TÒA").FontSize(16).SemiBold();
                    col.Item().AlignCenter().Text("SỨ ĐOÀN THIẾU NHI THÁNH THỂ").FontSize(18).Bold().FontColor("#B8860B");
                    
                    col.Item().PaddingTop(20).AlignCenter().Text($"CHỨNG THƯ {GetTypeName(cert.CertificateType).ToUpper()}").FontSize(36).Bold().FontColor("#800000");

                    col.Item().PaddingTop(20).AlignCenter().Text("Hân hoan chứng nhận:").FontSize(14).Italic();
                    col.Item().AlignCenter().Text($"{cert.Student?.HolyName} {cert.Student?.FullName}").FontSize(28).Bold().FontColor("#0A2540");

                    col.Item().PaddingTop(10).AlignCenter().Text($"Sinh ngày: {cert.Student?.BirthDate:dd/MM/yyyy}");
                    
                    col.Item().PaddingTop(15).AlignCenter().Text($"Đã lãnh nhận Bí tích {GetTypeName(cert.CertificateType)}");
                    col.Item().AlignCenter().Text($"Vào ngày {cert.IssueDate:dd/MM/yyyy}");
                    
                    col.Item().PaddingTop(10).AlignCenter().Text($"Người đỡ đầu: {cert.Godparent}").Italic();
                    col.Item().AlignCenter().Text($"Chủ sự: {cert.Celebrant}").Italic();

                    col.Item().PaddingTop(40).Row(row =>
                    {
                        row.RelativeItem().AlignLeft().Column(c => {
                            c.Item().Text($"Mã xác thực: {cert.VerificationCode}").FontSize(10).FontColor(Colors.Grey.Darken2);
                            c.Item().Text("(Tra cứu chứng chỉ số bằng mã này trên Hệ thống)").FontSize(10).FontColor(Colors.Grey.Darken2);
                        });
                        row.RelativeItem().AlignRight().Column(c =>
                        {
                            c.Item().AlignCenter().Text("Linh mục Chánh Xứ").Bold();
                            c.Item().PaddingTop(50).AlignCenter().Text(cert.SignedBy).Bold();
                        });
                    });
                });
            });
        });

        var pdfBytes = document.GeneratePdf();
        return File(pdfBytes, "application/pdf", $"ChungThu_{cert.VerificationCode}.pdf");
    }

    /// <summary>POST cấp chứng thư Bí tích mới cho đoàn sinh</summary>
    [HttpPost("issue")]
    [Authorize(Roles = "1,2")] // Chỉ Admin và Thư ký được cấp chứng chỉ
    public async Task<IActionResult> IssueCertificate([FromBody] IssueCertificateRequest request)
    {
        var student = await _context.Students.FindAsync(request.StudentId);
        if (student == null) return NotFound("Học sinh không tồn tại.");

        // Kiểm tra xem đã cấp chứng chỉ loại này chưa
        var exists = await _context.Certificates
            .AnyAsync(c => c.StudentId == request.StudentId && c.CertificateType.ToLower() == request.CertificateType.ToLower());

        if (exists)
            return BadRequest($"Đoàn sinh này đã được cấp Chứng thư {GetTypeName(request.CertificateType)} từ trước.");

        // Tạo mã xác thực độc nhất: CERT-[LOẠI]-[NĂM]-[4 KÝ TỰ NGẪU NHIÊN]
        string typeCode = GetTypeShortCode(request.CertificateType);
        string year = DateTimeHelper.GetVnNow().Year.ToString(); // Cross-platform safe
        string randomSegment = GenerateSecureCode(4);
        string verificationCode = $"CERT-{typeCode}-{year}-{randomSegment}";

        // Đảm bảo không trùng lặp mã xác thực
        while (await _context.Certificates.AnyAsync(c => c.VerificationCode == verificationCode))
        {
            randomSegment = GenerateSecureCode(4);
            verificationCode = $"CERT-{typeCode}-{year}-{randomSegment}";
        }

        var certificate = new Certificate
        {
            Id = Guid.NewGuid(),
            StudentId = request.StudentId,
            CertificateType = request.CertificateType,
            VerificationCode = verificationCode,
            Celebrant = request.Celebrant,
            Godparent = request.Godparent,
            IssueDate = DateTimeHelper.GetVnNow(), // Cross-platform safe
            SignedBy = string.IsNullOrWhiteSpace(request.SignedBy) ? "Cha Chánh Xứ" : request.SignedBy
        };

        _context.Certificates.Add(certificate);
        await _context.SaveChangesAsync();

        return Ok(certificate);
    }

    /// <summary>DELETE thu hồi chứng thư bí tích</summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "1,2")]
    public async Task<IActionResult> RevokeCertificate(Guid id)
    {
        var cert = await _context.Certificates.FindAsync(id);
        if (cert == null) return NotFound();

        _context.Certificates.Remove(cert);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private string GetTypeShortCode(string type)
    {
        return type.ToLower() switch
        {
            "baptism" => "BAP",
            "communion" => "COM",
            "confirmation" => "CON",
            _ => "OTH"
        };
    }

    private string GetTypeName(string type)
    {
        return type.ToLower() switch
        {
            "baptism" => "Rửa Tội",
            "communion" => "Rước Lễ",
            "confirmation" => "Thêm Sức",
            _ => "Khác"
        };
    }

    /// <summary>
    /// Sinh mã ngẫu nhiên bảo mật dùng RandomNumberGenerator (True Random từ OS).
    /// Thay thế new Random() vốn là giả ngẫu nhiên, có thể bị dự đoán.
    /// Mã xác thực Bí Tích là tài liệu pháp lý, bắt buộc dùng Cryptographically Secure Random.
    /// </summary>
    private static string GenerateSecureCode(int length)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Range(0, length)
            .Select(_ => chars[RandomNumberGenerator.GetInt32(chars.Length)])
            .ToArray());
    }
}

public class IssueCertificateRequest
{
    public Guid StudentId { get; set; }
    public string CertificateType { get; set; } = string.Empty; // Baptism, Communion, Confirmation
    public string Celebrant { get; set; } = string.Empty; // Linh mục cử hành
    public string Godparent { get; set; } = string.Empty; // Người đỡ đầu đỡ đầu
    public string SignedBy { get; set; } = "Cha Chánh Xứ";
}
