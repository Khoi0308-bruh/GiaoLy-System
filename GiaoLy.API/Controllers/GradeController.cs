using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GradeController : ControllerBase
{
    private readonly AppDbContext _context;

    public GradeController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>GET bảng điểm lớp học. Tự động khởi tạo bản ghi điểm rỗng nếu chưa tồn tại</summary>
    [HttpGet("classroom/{classRoomId:guid}")]
    public async Task<ActionResult<IEnumerable<GradeDto>>> GetClassRoomGrades(Guid classRoomId)
    {
        var classRoom = await _context.ClassRooms.AsNoTracking().FirstOrDefaultAsync(c => c.Id == classRoomId);
        if (classRoom == null) return NotFound("Lớp học không tồn tại.");

        // Lấy danh sách các học sinh đã xếp vào lớp này
        var enrollments = await _context.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.Grade)
            .Where(e => e.ClassRoomId == classRoomId && e.Status == "Active")
            .ToListAsync();

        var existingGrades = enrollments
            .Where(e => e.Grade != null)
            .ToDictionary(e => e.StudentId, e => e.Grade!);

        var result = new List<GradeDto>();

        foreach (var enroll in enrollments)
        {
            if (enroll.Student == null) continue;

            if (existingGrades.TryGetValue(enroll.StudentId, out var grade))
            {
                result.Add(MapToDto(grade, enroll.Student));
            }
            else
            {
                // Khởi tạo dòng điểm trống cho học sinh mới
                result.Add(new GradeDto
                {
                    Id = Guid.Empty, // Đánh dấu chưa lưu trên DB
                    StudentId = enroll.StudentId,
                    StudentFullName = enroll.Student.FullName,
                    StudentHolyName = enroll.Student.HolyName,
                    ClassRoomId = classRoomId,
                    Oral = 0,
                    SmallTest = 0,
                    BigTest = 0,
                    FinalExam = 0,
                    Absences = 0,
                    TotalSessions = 30,
                    GPA = 0,
                    AttendanceRate = 1.0,
                    IsQualified = false
                });
            }
        }

        return Ok(result.OrderBy(r => r.StudentFullName));
    }

    /// <summary>POST lưu/cập nhật bảng điểm hàng loạt — classRoomId trong route để ABAC Handler kiểm tra quyền</summary>
    [HttpPost("save/{classRoomId:guid}")]
    [Authorize(Policy = "IsClassTeacher")] // ABAC: Tự động kiểm tra GLV có phụ trách lớp không
    public async Task<IActionResult> SaveGrades(Guid classRoomId, [FromBody] List<SaveGradeRequest> requests)
    {
        if (requests == null || !requests.Any())
            return BadRequest("Không có dữ liệu lưu trữ.");

        foreach (var req in requests)
        {
            Grade? grade = null;

            if (req.Id != Guid.Empty)
            {
                // [Vá Lỗ Hổng IDOR]: Kiểm tra chéo ClassRoomId từ URL qua Enrollment
                grade = await _context.Grades
                    .Include(g => g.Enrollment)
                    .FirstOrDefaultAsync(g => g.Id == req.Id && g.Enrollment!.ClassRoomId == classRoomId);
            }
            else
            {
                var enroll = await _context.Enrollments
                    .FirstOrDefaultAsync(e => e.StudentId == req.StudentId && e.ClassRoomId == classRoomId && e.Status == "Active");
                if (enroll != null)
                {
                    grade = await _context.Grades.FirstOrDefaultAsync(g => g.EnrollmentId == enroll.Id);
                    if (grade == null)
                    {
                        grade = new Grade
                        {
                            Id = Guid.NewGuid(),
                            EnrollmentId = enroll.Id
                        };
                        _context.Grades.Add(grade);
                    }
                }
            }

            if (grade != null)
            {
                grade.Oral = (decimal)req.Oral;
                grade.SmallTest = (decimal)req.SmallTest;
                grade.BigTest = (decimal)req.BigTest;
                grade.FinalExam = (decimal)req.FinalExam;
                grade.Absences = req.Absences;
                grade.TotalSessions = req.TotalSessions > 0 ? req.TotalSessions : 30;

                // Giai đoạn 4A — Tính toán GPA/IsQualified trước khi lưu vào DB.
                // Bắt buộc gọi trước SaveChanges để cột GPA và IsQualified được cập nhật đúng.
                grade.Calculate();
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    /// <summary>GET xuất báo cáo Excel/CSV mã hóa UTF-8 BOM chuẩn tiếng Việt</summary>
    [HttpGet("classroom/{classRoomId:guid}/export")]
    [Authorize(Policy = "IsClassTeacher")] // Vá lỗ hổng IDOR: Chỉ cho phép GV xuất điểm lớp mình
    public async Task<IActionResult> ExportClassGrades(Guid classRoomId)
    {
        var classRoom = await _context.ClassRooms.AsNoTracking()
            .Include(c => c.AcademicYear)
            .FirstOrDefaultAsync(c => c.Id == classRoomId);

        if (classRoom == null) return NotFound("Lớp học không tồn tại.");

        var enrollments = await _context.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.Grade)
            .Where(e => e.ClassRoomId == classRoomId && e.Status == "Active")
            .ToListAsync();

        var grades = enrollments
            .Where(e => e.Grade != null)
            .ToDictionary(e => e.StudentId, e => e.Grade!);

        using var workbook = new ClosedXML.Excel.XLWorkbook();
        var worksheet = workbook.Worksheets.Add("BangDiem");

        // Header
        worksheet.Cell(1, 1).Value = "STT";
        worksheet.Cell(1, 2).Value = "Tên Thánh";
        worksheet.Cell(1, 3).Value = "Họ và Tên";
        worksheet.Cell(1, 4).Value = "Điểm Miệng";
        worksheet.Cell(1, 5).Value = "Điểm 15 Phút";
        worksheet.Cell(1, 6).Value = "Điểm 1 Tiết";
        worksheet.Cell(1, 7).Value = "Điểm Học Kỳ";
        worksheet.Cell(1, 8).Value = "Vắng";
        worksheet.Cell(1, 9).Value = "Tổng Buổi";
        worksheet.Cell(1, 10).Value = "ĐTB";
        worksheet.Cell(1, 11).Value = "Kết Quả";
        
        var headerRow = worksheet.Row(1);
        headerRow.Style.Font.Bold = true;
        headerRow.Style.Fill.BackgroundColor = ClosedXML.Excel.XLColor.LightGray;

        int rowIdx = 2;
        int stt = 1;

        foreach (var enroll in enrollments.OrderBy(e => e.Student?.FullName))
        {
            if (enroll.Student == null) continue;

            double oral = 0, small = 0, big = 0, final = 0, gpa = 0;
            int abs = 0, total = 30;
            string result = "Ở lại";

            if (grades.TryGetValue(enroll.StudentId, out var g))
            {
                oral = (double)(g.Oral ?? 0m);
                small = (double)(g.SmallTest ?? 0m);
                big = (double)(g.BigTest ?? 0m);
                final = (double)(g.FinalExam ?? 0m);
                abs = g.Absences ?? 0;
                total = g.TotalSessions ?? 30;
                gpa = g.GPA;
                result = g.IsQualified ? "Lên lớp" : "Ở lại";
            }

            worksheet.Cell(rowIdx, 1).Value = stt;
            worksheet.Cell(rowIdx, 2).Value = enroll.Student.HolyName;
            worksheet.Cell(rowIdx, 3).Value = enroll.Student.FullName;
            worksheet.Cell(rowIdx, 4).Value = oral;
            worksheet.Cell(rowIdx, 5).Value = small;
            worksheet.Cell(rowIdx, 6).Value = big;
            worksheet.Cell(rowIdx, 7).Value = final;
            worksheet.Cell(rowIdx, 8).Value = abs;
            worksheet.Cell(rowIdx, 9).Value = total;
            worksheet.Cell(rowIdx, 10).Value = gpa;
            worksheet.Cell(rowIdx, 11).Value = result;

            rowIdx++;
            stt++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        var content = stream.ToArray();

        string safeClassName = classRoom.ClassName.Replace(" ", "_");
        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Bang_Diem_{safeClassName}.xlsx");
    }

    /// <summary>GET xuất báo cáo PDF chuẩn mộc bằng QuestPDF</summary>
    [HttpGet("classroom/{classRoomId:guid}/export-pdf")]
    [Authorize(Policy = "IsClassTeacher")] // Vá lỗ hổng IDOR
    public async Task<IActionResult> ExportClassGradesPdf(Guid classRoomId)
    {
        var classRoom = await _context.ClassRooms.AsNoTracking()
            .Include(c => c.AcademicYear)
            .FirstOrDefaultAsync(c => c.Id == classRoomId);

        if (classRoom == null) return NotFound("Lớp học không tồn tại.");

        var enrollments = await _context.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.Grade)
            .Where(e => e.ClassRoomId == classRoomId && e.Status == "Active")
            .ToListAsync();

        var grades = enrollments
            .Where(e => e.Grade != null)
            .ToDictionary(e => e.StudentId, e => e.Grade!);

        var document = QuestPDF.Fluent.Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(1, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().Element(compose =>
                {
                    compose.Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text($"BẢNG ĐIỂM GIÁO LÝ - LỚP {classRoom.ClassName.ToUpper()}").FontSize(16).SemiBold();
                            col.Item().Text($"Niên Khóa: {classRoom.AcademicYear?.Name ?? ""}").FontSize(12);
                            col.Item().Text($"GLV Chủ nhiệm: {classRoom.MainTeacher}").FontSize(12);
                        });
                    });
                });

                page.Content().PaddingVertical(1, Unit.Centimetre).Column(x =>
                {
                    x.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(30); // STT
                            columns.RelativeColumn(2); // Thánh hiệu
                            columns.RelativeColumn(3); // Họ Tên
                            columns.RelativeColumn(1); // Miệng
                            columns.RelativeColumn(1); // 15P
                            columns.RelativeColumn(1); // 1 Tiết
                            columns.RelativeColumn(1); // Học Kỳ
                            columns.RelativeColumn(1); // Vắng
                            columns.RelativeColumn(1); // ĐTB
                            columns.RelativeColumn(1.5f); // Kết quả
                        });

                        table.Header(header =>
                        {
                            header.Cell().BorderBottom(1).PaddingBottom(5).Text("STT").SemiBold();
                            header.Cell().BorderBottom(1).PaddingBottom(5).Text("Tên Thánh").SemiBold();
                            header.Cell().BorderBottom(1).PaddingBottom(5).Text("Họ và Tên").SemiBold();
                            header.Cell().BorderBottom(1).PaddingBottom(5).Text("Miệng").SemiBold();
                            header.Cell().BorderBottom(1).PaddingBottom(5).Text("15 Phút").SemiBold();
                            header.Cell().BorderBottom(1).PaddingBottom(5).Text("1 Tiết").SemiBold();
                            header.Cell().BorderBottom(1).PaddingBottom(5).Text("Học Kỳ").SemiBold();
                            header.Cell().BorderBottom(1).PaddingBottom(5).Text("Vắng").SemiBold();
                            header.Cell().BorderBottom(1).PaddingBottom(5).Text("ĐTB").SemiBold();
                            header.Cell().BorderBottom(1).PaddingBottom(5).Text("Kết Quả").SemiBold();
                        });

                        int stt = 1;
                        foreach (var enroll in enrollments.OrderBy(e => e.Student?.FullName))
                        {
                            if (enroll.Student == null) continue;

                            double oral = 0, small = 0, big = 0, final = 0, gpa = 0;
                            int abs = 0;
                            string result = "Ở lại";

                            if (grades.TryGetValue(enroll.StudentId, out var g))
                            {
                                oral = (double)(g.Oral ?? 0m);
                                small = (double)(g.SmallTest ?? 0m);
                                big = (double)(g.BigTest ?? 0m);
                                final = (double)(g.FinalExam ?? 0m);
                                abs = g.Absences ?? 0;
                                gpa = g.GPA;
                                result = g.IsQualified ? "Lên lớp" : "Ở lại";
                            }

                            table.Cell().PaddingVertical(3).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Text(stt.ToString());
                            table.Cell().PaddingVertical(3).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Text(enroll.Student.HolyName);
                            table.Cell().PaddingVertical(3).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Text(enroll.Student.FullName);
                            table.Cell().PaddingVertical(3).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Text(oral.ToString());
                            table.Cell().PaddingVertical(3).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Text(small.ToString());
                            table.Cell().PaddingVertical(3).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Text(big.ToString());
                            table.Cell().PaddingVertical(3).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Text(final.ToString());
                            table.Cell().PaddingVertical(3).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Text(abs.ToString());
                            table.Cell().PaddingVertical(3).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Text(gpa.ToString());
                            table.Cell().PaddingVertical(3).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Text(result);

                            stt++;
                        }
                    });
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Trang ");
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
            });
        });

        var pdfBytes = document.GeneratePdf();
        string safeClassName = classRoom.ClassName.Replace(" ", "_");
        return File(pdfBytes, "application/pdf", $"Bang_Diem_{safeClassName}.pdf");
    }

    private GradeDto MapToDto(Grade g, Student s)
    {
        return new GradeDto
        {
            Id = g.Id,
            StudentId = g.StudentId,
            StudentFullName = s.FullName,
            StudentHolyName = s.HolyName,
            ClassRoomId = g.ClassRoomId,
            Oral = (double)(g.Oral ?? 0m),
            SmallTest = (double)(g.SmallTest ?? 0m),
            BigTest = (double)(g.BigTest ?? 0m),
            FinalExam = (double)(g.FinalExam ?? 0m),
            Absences = g.Absences ?? 0,
            TotalSessions = g.TotalSessions ?? 30,
            GPA = g.GPA,
            AttendanceRate = g.AttendanceRate,
            IsQualified = g.IsQualified
        };
    }
}

public class GradeDto
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public string StudentFullName { get; set; } = string.Empty;
    public string StudentHolyName { get; set; } = string.Empty;
    public Guid ClassRoomId { get; set; }
    public double Oral { get; set; }
    public double SmallTest { get; set; }
    public double BigTest { get; set; }
    public double FinalExam { get; set; }
    public int Absences { get; set; }
    public int TotalSessions { get; set; }
    public double GPA { get; set; }
    public double AttendanceRate { get; set; }
    public bool IsQualified { get; set; }
}

public class SaveGradeRequest
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid ClassRoomId { get; set; }
    public double Oral { get; set; }
    public double SmallTest { get; set; }
    public double BigTest { get; set; }
    public double FinalExam { get; set; }
    public int Absences { get; set; }
    public int TotalSessions { get; set; }
}
