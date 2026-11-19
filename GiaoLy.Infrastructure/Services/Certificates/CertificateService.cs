using System.Security.Cryptography;
using GiaoLy.Application.Certificates.Contracts;
using GiaoLy.Application.Certificates.Dtos;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Imports.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace GiaoLy.Infrastructure.Services.Certificates;

public class CertificateService : ICertificateService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUser _currentUser;

    public CertificateService(AppDbContext context, ICurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<Result<IReadOnlyList<CertificateDto>>> GetStudentCertificatesAsync(Guid studentId, CancellationToken ct = default)
    {
        var studentExists = await _context.Students.AnyAsync(s => s.Id == studentId && s.DeletedAt == null, ct);
        if (!studentExists)
        {
            return Result.NotFound<IReadOnlyList<CertificateDto>>("Không tìm thấy đoàn sinh.");
        }

        var certs = await _context.Certificates.AsNoTracking()
            .Include(c => c.Student)
            .Include(c => c.Issuer)
            .Include(c => c.Revoker)
            .Where(c => c.StudentId == studentId)
            .OrderByDescending(c => c.IssuedAt)
            .ToListAsync(ct);

        var dtos = certs.Select(MapToDto).ToList();
        return Result.Ok<IReadOnlyList<CertificateDto>>(dtos);
    }

    public async Task<Result<CertificateDto>> IssueCertificateAsync(
        Guid studentId,
        IssueCertificateRequest request,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request?.CertificateType))
        {
            return Result.BadRequest<CertificateDto>("Loại chứng chỉ bí tích không được để trống.");
        }

        var canonicalType = SacramentRules.NormalizeSacramentType(request.CertificateType);
        if (canonicalType == null)
        {
            return Result.BadRequest<CertificateDto>(
                $"Loại bí tích '{request.CertificateType}' không hợp lệ. Chỉ chấp nhận: Baptism, FirstCommunion, Confirmation.");
        }

        var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == studentId && s.DeletedAt == null, ct);
        if (student == null)
        {
            return Result.NotFound<CertificateDto>("Không tìm thấy đoàn sinh.");
        }

        // Tìm hồ sơ bí tích tương ứng
        var sacrament = await _context.StudentSacraments
            .FirstOrDefaultAsync(ss => ss.StudentId == studentId && ss.SacramentType == canonicalType, ct);

        if (sacrament == null)
        {
            return Result.BadRequest<CertificateDto>(
                $"Đoàn sinh chưa có bản ghi ghi nhận bí tích {CertificateRules.GetTypeNameVi(canonicalType)} trong hồ sơ.");
        }

        if (!sacrament.ReceivedOn.HasValue)
        {
            return Result.BadRequest<CertificateDto>(
                $"Hồ sơ bí tích {CertificateRules.GetTypeNameVi(canonicalType)} chưa có ngày lãnh nhận. Bắt buộc phải có ngày lãnh để cấp chứng chỉ.");
        }

        // Kiểm tra xem đã có chứng chỉ hiệu lực (Issued) chưa (Mục 6.8 & Chỉ mục duy nhất)
        var existingIssued = await _context.Certificates.AnyAsync(
            c => c.StudentId == studentId && c.CertificateType == canonicalType && c.Status == CertificateRules.Statuses.Issued,
            ct);

        if (existingIssued)
        {
            return Result.Failure<CertificateDto>(
                409,
                ErrorCodes.CertAlreadyIssued,
                $"Đoàn sinh đã có chứng chỉ bí tích {CertificateRules.GetTypeNameVi(canonicalType)} đang có hiệu lực. Vui lòng thu hồi chứng chỉ cũ nếu cần cấp lại.");
        }

        // Sinh mã xác thực an toàn mật mã 12 ký tự: CERT-{BAP|COM|CON}-{năm}-XXXX-XXXX-XXXX
        var year = DateTime.UtcNow.Year;
        string verificationCode;
        do
        {
            verificationCode = CertificateRules.GenerateVerificationCode(canonicalType, year);
        }
        while (await _context.Certificates.AnyAsync(c => c.VerificationCode == verificationCode, ct));

        // Đọc thông tin giáo xứ từ SystemSettings (nếu có)
        var parish = "Giáo Xứ Chính Tòa";
        var diocese = "Giáo Phận Đà Nẵng";

        var settings = await _context.SystemSettings.AsNoTracking()
            .Where(s => s.Key == "Parish.Name" || s.Key == "Parish.Diocese")
            .ToDictionaryAsync(s => s.Key, s => s.Value, ct);

        if (settings.TryGetValue("Parish.Name", out var pName) && !string.IsNullOrWhiteSpace(pName)) parish = pName;
        if (settings.TryGetValue("Parish.Diocese", out var dName) && !string.IsNullOrWhiteSpace(dName)) diocese = dName;

        // Tạo ảnh chụp bất biến (Immutable Snapshot)
        var snapshot = new CertificateRules.CertificateSnapshot
        {
            StudentId = student.Id,
            StudentCode = student.Code,
            HolyName = student.HolyName,
            FullName = student.FullName,
            BirthDate = DateOnly.FromDateTime(student.BirthDate),
            SacramentType = canonicalType,
            ReceivedOn = sacrament.ReceivedOn,
            Place = sacrament.Place,
            Minister = sacrament.Minister,
            Sponsor = sacrament.Sponsor,
            BookNumber = sacrament.BookNumber,
            Parish = parish,
            Diocese = diocese
        };

        var snapshotJson = CertificateRules.SerializeSnapshot(snapshot);

        // Sinh trước PDF để tính SHA-256 băm lưu trữ
        var signedBy = string.IsNullOrWhiteSpace(request.SignedBy) ? "Cha Chánh Xứ" : request.SignedBy.Trim();
        var pdfBytes = GeneratePdfFromSnapshot(snapshot, verificationCode, DateTime.UtcNow, signedBy);
        var sha256Hash = Convert.ToHexString(SHA256.HashData(pdfBytes)).ToLowerInvariant();

        var certificate = new Certificate
        {
            Id = Guid.NewGuid(),
            StudentId = student.Id,
            StudentSacramentId = sacrament.Id,
            CertificateType = canonicalType,
            VerificationCode = verificationCode,
            Snapshot = snapshotJson,
            IssuedAt = DateTime.UtcNow,
            IssuedBy = _currentUser.UserId ?? Guid.Empty,
            SignedBy = signedBy,
            Status = CertificateRules.Statuses.Issued,
            PdfSha256 = sha256Hash,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Certificates.AddAsync(certificate, ct);
        await _context.SaveChangesAsync(ct);

        var issuer = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == certificate.IssuedBy, ct);
        certificate.Student = student;
        certificate.Issuer = issuer;

        return Result.Created(MapToDto(certificate));
    }

    public async Task<Result<CertificateDto>> RevokeCertificateAsync(
        Guid certificateId,
        RevokeCertificateRequest request,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request?.Reason))
        {
            return Result.BadRequest<CertificateDto>("Lý do thu hồi chứng chỉ không được để trống.");
        }

        var certificate = await _context.Certificates
            .Include(c => c.Student)
            .Include(c => c.Issuer)
            .FirstOrDefaultAsync(c => c.Id == certificateId, ct);

        if (certificate == null)
        {
            return Result.NotFound<CertificateDto>("Không tìm thấy chứng chỉ.");
        }

        if (certificate.Status == CertificateRules.Statuses.Revoked)
        {
            return Result.BadRequest<CertificateDto>("Chứng chỉ này đã bị thu hồi từ trước.");
        }

        certificate.Status = CertificateRules.Statuses.Revoked;
        certificate.RevokedAt = DateTime.UtcNow;
        certificate.RevokedBy = _currentUser.UserId;
        certificate.RevokeReason = request.Reason.Trim();
        certificate.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);

        var revoker = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == certificate.RevokedBy, ct);
        certificate.Revoker = revoker;

        return Result.Ok(MapToDto(certificate));
    }

    public async Task<Result<ExportFileResult>> GetCertificatePdfAsync(Guid certificateId, CancellationToken ct = default)
    {
        var certificate = await _context.Certificates.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == certificateId, ct);

        if (certificate == null)
        {
            return Result.NotFound<ExportFileResult>("Không tìm thấy chứng chỉ.");
        }

        var snapshot = CertificateRules.DeserializeSnapshot(certificate.Snapshot);
        if (snapshot == null)
        {
            return Result.BadRequest<ExportFileResult>("Không thể đọc dữ liệu ảnh chụp của chứng chỉ.");
        }

        var pdfBytes = GeneratePdfFromSnapshot(snapshot, certificate.VerificationCode, certificate.IssuedAt, certificate.SignedBy ?? "Cha Chánh Xứ", certificate.Status, certificate.RevokedAt);
        var fileName = $"ChungChi_{certificate.CertificateType}_{certificate.VerificationCode}.pdf";

        var result = new ExportFileResult(pdfBytes, "application/pdf", fileName);
        return Result.Ok(result);
    }

    public async Task<Result<PublicCertificateVerifyDto>> VerifyPublicCertificateAsync(string code, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return Result.BadRequest<PublicCertificateVerifyDto>("Mã xác thực không được để trống.");
        }

        var normalizedCode = code.Trim().ToUpperInvariant();
        var certificate = await _context.Certificates.AsNoTracking()
            .FirstOrDefaultAsync(c => c.VerificationCode == normalizedCode, ct);

        if (certificate == null)
        {
            return Result.NotFound<PublicCertificateVerifyDto>("Không tìm thấy chứng chỉ với mã xác thực này hoặc mã đã bị hủy.");
        }

        var snapshot = CertificateRules.DeserializeSnapshot(certificate.Snapshot);
        var maskedName = CertificateRules.MaskStudentName(snapshot?.FullName);

        var dto = new PublicCertificateVerifyDto
        {
            VerificationCode = certificate.VerificationCode,
            CertificateType = certificate.CertificateType,
            CertificateTypeName = CertificateRules.GetTypeNameVi(certificate.CertificateType),
            MaskedFullName = maskedName,
            HolyName = snapshot?.HolyName,
            ReceivedOn = snapshot?.ReceivedOn,
            Place = snapshot?.Place,
            Parish = snapshot?.Parish ?? "Giáo Xứ",
            Diocese = snapshot?.Diocese ?? "Giáo Phận",
            Status = certificate.Status,
            IssuedAt = certificate.IssuedAt,
            RevokedAt = certificate.RevokedAt
        };

        return Result.Ok(dto);
    }

    public async Task<Result<ExportFileResult>> GetPublicCertificatePdfAsync(string code, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return Result.BadRequest<ExportFileResult>("Mã xác thực không được để trống.");
        }

        var normalizedCode = code.Trim().ToUpperInvariant();
        var certificate = await _context.Certificates.AsNoTracking()
            .FirstOrDefaultAsync(c => c.VerificationCode == normalizedCode, ct);

        if (certificate == null)
        {
            return Result.NotFound<ExportFileResult>("Không tìm thấy chứng chỉ với mã xác thực này.");
        }

        var snapshot = CertificateRules.DeserializeSnapshot(certificate.Snapshot);
        if (snapshot == null)
        {
            return Result.BadRequest<ExportFileResult>("Không thể đọc dữ liệu ảnh chụp của chứng chỉ.");
        }

        var pdfBytes = GeneratePdfFromSnapshot(snapshot, certificate.VerificationCode, certificate.IssuedAt, certificate.SignedBy ?? "Cha Chánh Xứ", certificate.Status, certificate.RevokedAt);
        var fileName = $"ChungChi_{certificate.CertificateType}_{certificate.VerificationCode}.pdf";

        var result = new ExportFileResult(pdfBytes, "application/pdf", fileName);
        return Result.Ok(result);
    }

    private static byte[] GeneratePdfFromSnapshot(
        CertificateRules.CertificateSnapshot snapshot,
        string verificationCode,
        DateTime issuedAt,
        string signedBy,
        string? status = null,
        DateTime? revokedAt = null)
    {
        var typeNameVi = CertificateRules.GetTypeNameVi(snapshot.SacramentType).ToUpperInvariant();

        var doc = QuestPDF.Fluent.Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(1.5f, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(13).FontFamily("Times New Roman"));

                page.Content().Border(4).BorderColor("#0A2540").Padding(1.2f, Unit.Centimetre).Column(col =>
                {
                    // Tiêu đề giáo phận & giáo xứ
                    col.Item().AlignCenter().Text(snapshot.Diocese.ToUpperInvariant()).FontSize(14).SemiBold().FontColor("#555555");
                    col.Item().AlignCenter().Text(snapshot.Parish.ToUpperInvariant()).FontSize(17).Bold().FontColor("#0A2540");

                    // Tên chứng thư
                    col.Item().PaddingTop(15).AlignCenter().Text($"CHỨNG THƯ BÍ TÍCH {typeNameVi}").FontSize(32).Bold().FontColor("#800000");

                    // Đánh dấu rõ chứng chỉ đã bị thu hồi để bản in không còn giá trị sử dụng
                    if (string.Equals(status, CertificateRules.Statuses.Revoked, StringComparison.OrdinalIgnoreCase))
                    {
                        var revokedLabel = revokedAt.HasValue
                            ? $"CHỨNG CHỈ ĐÃ BỊ THU HỒI NGÀY {revokedAt.Value:dd/MM/yyyy} — KHÔNG CÒN GIÁ TRỊ"
                            : "CHỨNG CHỈ ĐÃ BỊ THU HỒI — KHÔNG CÒN GIÁ TRỊ";

                        col.Item().PaddingTop(10).AlignCenter()
                            .Background("#FDECEC").Border(2).BorderColor("#B00020").PaddingVertical(8).PaddingHorizontal(14)
                            .Text(revokedLabel).FontSize(16).Bold().FontColor("#B00020");
                    }

                    // Chứng nhận
                    col.Item().PaddingTop(15).AlignCenter().Text("Hân hoan chứng nhận:").FontSize(13).Italic();
                    col.Item().AlignCenter().Text($"{snapshot.HolyName} {snapshot.FullName}").FontSize(26).Bold().FontColor("#0A2540");

                    col.Item().PaddingTop(5).AlignCenter().Text($"Sinh ngày: {snapshot.BirthDate:dd/MM/yyyy}");

                    // Chi tiết bí tích (Quan trọng F6: In đúng ngày lãnh nhận ReceivedOn, không in ngày cấp IssuedAt)
                    col.Item().PaddingTop(15).AlignCenter().Text(t =>
                    {
                        t.Span("Đã lãnh nhận ");
                        t.Span($"Bí tích {CertificateRules.GetTypeNameVi(snapshot.SacramentType)}").Bold();
                        t.Span(" vào ngày ");
                        t.Span(snapshot.ReceivedOn.HasValue ? $"{snapshot.ReceivedOn.Value:dd/MM/yyyy}" : "---").Bold();
                    });

                    if (!string.IsNullOrWhiteSpace(snapshot.Place))
                    {
                        col.Item().AlignCenter().Text($"Tại: {snapshot.Place}");
                    }

                    col.Item().PaddingTop(8).Row(r =>
                    {
                        r.RelativeItem().AlignCenter().Text($"Linh mục ban: {(string.IsNullOrWhiteSpace(snapshot.Minister) ? "---" : snapshot.Minister)}").Italic();
                        r.RelativeItem().AlignCenter().Text($"Người đỡ đầu: {(string.IsNullOrWhiteSpace(snapshot.Sponsor) ? "---" : snapshot.Sponsor)}").Italic();
                    });

                    if (!string.IsNullOrWhiteSpace(snapshot.BookNumber))
                    {
                        col.Item().AlignCenter().Text($"Số sổ bí tích: {snapshot.BookNumber}").FontSize(11).FontColor(Colors.Grey.Darken1);
                    }

                    // Chân trang: Mã xác thực, ngày cấp & chữ ký
                    col.Item().PaddingTop(35).Row(row =>
                    {
                        row.RelativeItem(2).AlignLeft().Column(c =>
                        {
                            c.Item().Text($"Mã xác thực: {verificationCode}").FontSize(11).Bold().FontColor("#0A2540");
                            if (string.Equals(status, CertificateRules.Statuses.Revoked, StringComparison.OrdinalIgnoreCase))
                            {
                                c.Item().Text("Tình trạng: Đã thu hồi").FontSize(11).Bold().FontColor("#B00020");
                            }
                            c.Item().Text($"Tra cứu trực tuyến tại cổng thông tin xác thực giáo xứ.").FontSize(9).FontColor(Colors.Grey.Darken2);
                            c.Item().Text($"Ngày cấp chứng chỉ: {issuedAt:dd/MM/yyyy}").FontSize(9).FontColor(Colors.Grey.Darken2);
                        });

                        row.RelativeItem(1).AlignRight().Column(c =>
                        {
                            c.Item().AlignCenter().Text("Đại diện Giáo xứ").Bold().FontSize(12);
                            c.Item().PaddingTop(45).AlignCenter().Text(signedBy).Bold().FontSize(13);
                        });
                    });
                });
            });
        });

        return doc.GeneratePdf();
    }

    private static CertificateDto MapToDto(Certificate c)
    {
        var snapshot = CertificateRules.DeserializeSnapshot(c.Snapshot);

        return new CertificateDto
        {
            Id = c.Id,
            StudentId = c.StudentId,
            StudentCode = c.Student?.Code ?? snapshot?.StudentCode ?? string.Empty,
            HolyName = c.Student?.HolyName ?? snapshot?.HolyName,
            FullName = c.Student?.FullName ?? snapshot?.FullName ?? string.Empty,
            BirthDate = snapshot != null ? snapshot.BirthDate : (c.Student != null ? DateOnly.FromDateTime(c.Student.BirthDate) : DateOnly.MinValue),
            CertificateType = c.CertificateType,
            CertificateTypeName = CertificateRules.GetTypeNameVi(c.CertificateType),
            VerificationCode = c.VerificationCode,
            ReceivedOn = snapshot?.ReceivedOn,
            Place = snapshot?.Place,
            Minister = snapshot?.Minister,
            Sponsor = snapshot?.Sponsor,
            BookNumber = snapshot?.BookNumber,
            IssuedAt = c.IssuedAt,
            IssuedByName = c.Issuer?.FullName ?? c.Issuer?.Username,
            SignedBy = c.SignedBy,
            Status = c.Status,
            RevokedAt = c.RevokedAt,
            RevokedByName = c.Revoker?.FullName ?? c.Revoker?.Username,
            RevokeReason = c.RevokeReason,
            PdfSha256 = c.PdfSha256
        };
    }
}
