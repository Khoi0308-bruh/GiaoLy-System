using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Imports.Dtos;
using GiaoLy.Application.Portal.Dtos;

namespace GiaoLy.Application.Portal.Contracts;

public interface IParentPortalService
{
    Task<Result<List<PortalChildSummaryDto>>> GetMyChildrenAsync(CancellationToken ct = default);
    Task<Result<PortalChildDetailDto>> GetChildDetailAsync(Guid childId, CancellationToken ct = default);
    Task<Result<List<PortalChildGradeDto>>> GetChildGradesAsync(Guid childId, CancellationToken ct = default);
    Task<Result<List<PortalChildCertificateDto>>> GetChildCertificatesAsync(Guid childId, CancellationToken ct = default);
    Task<Result<ExportFileResult>> GetChildCertificatePdfAsync(Guid childId, Guid certificateId, CancellationToken ct = default);
    Task<Result<List<PortalAnnouncementDto>>> GetParentAnnouncementsAsync(CancellationToken ct = default);
}
