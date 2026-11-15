using GiaoLy.Application.Certificates.Dtos;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Imports.Dtos;

namespace GiaoLy.Application.Certificates.Contracts;

public interface ICertificateService
{
    Task<Result<IReadOnlyList<CertificateDto>>> GetStudentCertificatesAsync(Guid studentId, CancellationToken ct = default);
    Task<Result<CertificateDto>> IssueCertificateAsync(Guid studentId, IssueCertificateRequest request, CancellationToken ct = default);
    Task<Result<CertificateDto>> RevokeCertificateAsync(Guid certificateId, RevokeCertificateRequest request, CancellationToken ct = default);
    Task<Result<ExportFileResult>> GetCertificatePdfAsync(Guid certificateId, CancellationToken ct = default);
    Task<Result<PublicCertificateVerifyDto>> VerifyPublicCertificateAsync(string code, CancellationToken ct = default);
    Task<Result<ExportFileResult>> GetPublicCertificatePdfAsync(string code, CancellationToken ct = default);
}
