using System;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Reports.Dtos;

namespace GiaoLy.Application.Reports.Contracts;

public interface IReportService
{
    Task<Result<DashboardReportDto>> GetDashboardAsync(CancellationToken ct = default);
    Task<Result<StudentsByBranchReportDto>> GetStudentsByBranchAsync(Guid? academicYearId = null, CancellationToken ct = default);
    Task<Result<MissingDataReportDto>> GetMissingDataAsync(int? branchId = null, Guid? classRoomId = null, CancellationToken ct = default);
    Task<Result<PromotionSummaryReportDto>> GetPromotionSummaryAsync(Guid? academicYearId = null, int? branchId = null, CancellationToken ct = default);
    Task<Result<GradesSummaryReportDto>> GetGradesSummaryAsync(Guid? academicYearId = null, Guid? classRoomId = null, CancellationToken ct = default);
    Task<Result<ExportReportResultDto>> ExportReportAsync(ExportReportRequest request, CancellationToken ct = default);
}
