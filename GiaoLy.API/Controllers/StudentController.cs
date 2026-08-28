using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using GiaoLy.API.Helpers;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StudentController : ControllerBase
{
    public class CheckDuplicateRequest
    {
        public string FullName { get; set; } = string.Empty;
        public DateTime? BirthDate { get; set; }
    }

    public class AssignClassesRequest
    {
        public List<Guid> StudentIds { get; set; } = new();
        public int NumberOfClasses { get; set; }
        public string BranchPrefix { get; set; } = string.Empty; // e.g. "Ấu"
        public string Method { get; set; } = "Random"; // "Random" or "Area"
    }
    
    private readonly AppDbContext _context;

    public StudentController(AppDbContext context)
    {
        _context = context;
    }

    // 1. Lấy danh sách tất cả đoàn sinh (Dùng cho Dashboard stats - Cần refactor sau)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
    {
        return await _context.Students.ToListAsync();
    }

    [HttpGet("paged")]
    public async Task<ActionResult> GetStudentsPaged(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20, 
        [FromQuery] string? search = null,
        [FromQuery] int? branch = null,
        [FromQuery] string? className = null,
        [FromQuery] bool? hasBaptism = null,
        [FromQuery] bool? hasCommunion = null,
        [FromQuery] bool? hasConfirmation = null)
    {
        var query = _context.Students.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(s => s.FullName.ToLower().Contains(searchLower) || (s.HolyName != null && s.HolyName.ToLower().Contains(searchLower)));
        }

        if (branch.HasValue && branch.Value > 0)
        {
            query = query.Where(s => (int)s.Branch == branch.Value);
        }

        if (!string.IsNullOrWhiteSpace(className))
        {
            if (className == "UNASSIGNED")
            {
                query = query.Where(s => string.IsNullOrEmpty(s.ClassName));
            }
            else
            {
                var classNameLower = className.ToLower();
                query = query.Where(s => s.ClassName != null && s.ClassName.ToLower() == classNameLower);
            }
        }

        if (hasBaptism.HasValue)
            query = hasBaptism.Value ? query.Where(s => s.BaptismDate.HasValue) : query.Where(s => !s.BaptismDate.HasValue);
            
        if (hasCommunion.HasValue)
            query = hasCommunion.Value ? query.Where(s => s.CommunionDate.HasValue) : query.Where(s => !s.CommunionDate.HasValue);
            
        if (hasConfirmation.HasValue)
            query = hasConfirmation.Value ? query.Where(s => s.ConfirmationDate.HasValue) : query.Where(s => !s.ConfirmationDate.HasValue);


        var totalCount = await query.CountAsync();
        var items = await query.OrderBy(s => s.FullName)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync();

        return Ok(new 
        { 
            total = totalCount, 
            page = page,
            pageSize = pageSize,
            items = items 
        });
    }

    // 2. Thêm mới một đoàn sinh
    [HttpPost]
    [RequirePermission("students.create")]
    public async Task<ActionResult<Student>> CreateStudent([FromBody] Student student)
    {
        if (student == null) return BadRequest();

        student.Id = Guid.NewGuid();
        student.IsActive = true;

        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        return Ok(student); // Trả về Ok kèm dữ liệu để Frontend nhận biết
    }
    [HttpGet("stats")]
    public async Task<IActionResult> GetStudentStats()
    {
        var stats = await _context.Students
            .GroupBy(s => s.Branch)
            .Select(g => new
            {
                Branch = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        return Ok(stats);
    }

    [HttpGet("classes/{branchId}")]
    public async Task<IActionResult> GetClassesByBranch(int branchId)
    {
        var classes = await _context.Students
            .Where(s => (int)s.Branch == branchId && !string.IsNullOrEmpty(s.ClassName))
            .Select(s => s.ClassName)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(classes);
    }

    [HttpPut("{id}")]
    [RequirePermission("students.update")]
    public async Task<IActionResult> UpdateStudent(Guid id, [FromBody] Student student)
    {
        if (id != student.Id) return BadRequest();

        _context.Entry(student).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Students.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }
    [HttpDelete("{id}")]
    [RequirePermission("students.delete")]
    public async Task<IActionResult> DeleteStudent(Guid id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null) return NotFound();

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("export-excel")]
    [RequirePermission("students.export")]
    public async Task<IActionResult> ExportExcel(
        [FromQuery] int? branch = null,
        [FromQuery] bool? hasBaptism = null,
        [FromQuery] bool? hasCommunion = null,
        [FromQuery] bool? hasConfirmation = null)
    {
        var query = _context.Students.AsNoTracking().AsQueryable();

        if (branch.HasValue && branch.Value > 0)
            query = query.Where(s => (int)s.Branch == branch.Value);

        if (hasBaptism.HasValue)
            query = hasBaptism.Value ? query.Where(s => s.BaptismDate.HasValue) : query.Where(s => !s.BaptismDate.HasValue);
            
        if (hasCommunion.HasValue)
            query = hasCommunion.Value ? query.Where(s => s.CommunionDate.HasValue) : query.Where(s => !s.CommunionDate.HasValue);
            
        if (hasConfirmation.HasValue)
            query = hasConfirmation.Value ? query.Where(s => s.ConfirmationDate.HasValue) : query.Where(s => !s.ConfirmationDate.HasValue);

        var students = await query.OrderBy(s => s.Branch).ThenBy(s => s.ClassName).ThenBy(s => s.FullName).ToListAsync();

        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("DanhSachDoanSinh");

        // Headers
        ws.Cell(1, 1).Value = "Tên Thánh";
        ws.Cell(1, 2).Value = "Họ và Tên";
        ws.Cell(1, 3).Value = "Ngày Sinh";
        ws.Cell(1, 4).Value = "Lớp";
        ws.Cell(1, 5).Value = "Ngành";
        ws.Cell(1, 6).Value = "SĐT Phụ Huynh";
        ws.Cell(1, 7).Value = "Nhóm Máu";
        ws.Cell(1, 8).Value = "Dị ứng / Bệnh lý";
        ws.Cell(1, 9).Value = "Rửa Tội (Ngày)";
        ws.Cell(1, 10).Value = "Rước Lễ (Ngày)";
        ws.Cell(1, 11).Value = "Thêm Sức (Ngày)";

        // Format header
        ws.Range("A1:K1").Style.Font.Bold = true;
        ws.Range("A1:K1").Style.Fill.BackgroundColor = XLColor.LightBlue;

        int row = 2;
        foreach (var s in students)
        {
            ws.Cell(row, 1).Value = s.HolyName;
            ws.Cell(row, 2).Value = s.FullName;
            ws.Cell(row, 3).Value = s.BirthDate.ToString("dd/MM/yyyy");
            ws.Cell(row, 4).Value = s.ClassName;
            ws.Cell(row, 5).Value = s.Branch.ToString();
            ws.Cell(row, 6).Value = s.ParentPhone;
            ws.Cell(row, 7).Value = s.BloodType;
            ws.Cell(row, 8).Value = s.Allergies;
            ws.Cell(row, 9).Value = s.BaptismDate?.ToString("dd/MM/yyyy");
            ws.Cell(row, 10).Value = s.CommunionDate?.ToString("dd/MM/yyyy");
            ws.Cell(row, 11).Value = s.ConfirmationDate?.ToString("dd/MM/yyyy");
            row++;
        }

        ws.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        var content = stream.ToArray();

        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"DanhSachDoanSinh_{DateTimeHelper.GetVnNow():yyyyMMdd}.xlsx");
    }

    [HttpGet("export-template")]
    [RequirePermission("students.import")]
    public IActionResult ExportTemplate()
    {
        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Data");

        // Headers
        ws.Cell(1, 1).Value = "Tên Thánh";
        ws.Cell(1, 2).Value = "Họ và Tên (*)";
        ws.Cell(1, 3).Value = "Ngày Sinh (DD/MM/YYYY)";
        ws.Cell(1, 4).Value = "Lớp (Ví dụ: Ấu 1)";
        ws.Cell(1, 5).Value = "Ngành (1-Chiên, 2-Ấu, 3-Thiếu, 4-Nghĩa, 5-Hiệp)";
        ws.Cell(1, 6).Value = "SĐT Phụ Huynh";
        ws.Cell(1, 7).Value = "Nhóm Máu";
        ws.Cell(1, 8).Value = "Dị ứng / Bệnh lý";
        ws.Cell(1, 9).Value = "Ngày Rửa Tội (DD/MM/YYYY)";
        ws.Cell(1, 10).Value = "Ngày Rước Lễ (DD/MM/YYYY)";
        ws.Cell(1, 11).Value = "Ngày Thêm Sức (DD/MM/YYYY)";

        ws.Range("A1:K1").Style.Font.Bold = true;
        ws.Range("A1:K1").Style.Fill.BackgroundColor = XLColor.LightBlue;
        
        // Demo row
        ws.Cell(2, 1).Value = "Giuse";
        ws.Cell(2, 2).Value = "Nguyễn Văn A";
        ws.Cell(2, 3).Value = "15/08/2010";
        ws.Cell(2, 4).Value = "Ấu 1";
        ws.Cell(2, 5).Value = "2";
        ws.Cell(2, 6).Value = "0901234567";

        ws.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "MauNhapLieu_DoanSinh.xlsx");
    }

    [HttpPost("check-duplicates")]
    [RequirePermission("students.import")]
    public async Task<IActionResult> CheckDuplicates([FromBody] List<CheckDuplicateRequest> requests)
    {
        if (requests == null || !requests.Any()) return Ok(new List<object>());

        var names = requests.Select(r => r.FullName.ToLower()).Distinct().ToList();
        var existingStudents = await _context.Students
            .Where(s => names.Contains(s.FullName.ToLower()))
            .Select(s => new { s.Id, s.FullName, s.BirthDate })
            .ToListAsync();

        var duplicates = new List<object>();
        foreach (var req in requests)
        {
            var dup = existingStudents.FirstOrDefault(s => 
                s.FullName.Equals(req.FullName, StringComparison.OrdinalIgnoreCase) && 
                ((!s.BirthDate.Equals(default(DateTime)) && req.BirthDate.HasValue && s.BirthDate.Date == req.BirthDate.Value.Date) || 
                 (!req.BirthDate.HasValue && s.BirthDate.Equals(default(DateTime))))
            );

            if (dup != null)
            {
                duplicates.Add(new { 
                    fullName = req.FullName, 
                    birthDate = req.BirthDate,
                    existingId = dup.Id 
                });
            }
        }
        
        return Ok(duplicates);
    }

    [HttpPost("bulk")]
    [RequirePermission("students.import")]
    public async Task<IActionResult> BulkImport([FromBody] List<Student> students)
    {
        if (students == null || !students.Any()) return BadRequest("Danh sách trống.");
        
        var toInsert = new List<Student>();
        var toUpdate = new List<Student>();

        // [Tối ưu hiệu năng] Tải trước danh sách ID hiện có vào bộ nhớ thay vì query N+1
        var incomingIds = students.Where(s => s.Id != Guid.Empty).Select(s => s.Id).ToList();
        var existingIds = new HashSet<Guid>();
        if (incomingIds.Any())
        {
            existingIds = new HashSet<Guid>(
                await _context.Students.Where(s => incomingIds.Contains(s.Id)).Select(s => s.Id).ToListAsync()
            );
        }

        foreach (var student in students)
        {
            if (student.Id != Guid.Empty && existingIds.Contains(student.Id))
            {
                student.IsActive = true;
                toUpdate.Add(student);
            }
            else
            {
                student.Id = Guid.NewGuid();
                student.IsActive = true;
                toInsert.Add(student);
            }
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            if (toInsert.Any()) await _context.Students.AddRangeAsync(toInsert);
            if (toUpdate.Any()) _context.Students.UpdateRange(toUpdate);
            
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return Ok(new
            {
                count = students.Count,
                message = $"✅ Đã import thành công {students.Count} đoàn sinh vào hệ thống."
            });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new
            {
                message = $"❌ Lỗi khi lưu dữ liệu, đã hủy toàn bộ tiến trình import: {ex.Message}"
            });
        }
    }

    [HttpPost("import-excel")]
    [RequirePermission("students.import")]
    public async Task<IActionResult> ImportExcel(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("File không hợp lệ");

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);

        XLWorkbook workbook;
        try
        {
            workbook = new XLWorkbook(stream);
        }
        catch (Exception)
        {
            return BadRequest("File không đúng định dạng Excel (.xlsx) hoặc file bị hỏng.");
        }

        using (workbook)
        {
            var worksheet = workbook.Worksheet(1); // Lấy sheet đầu tiên
            var range = worksheet.RangeUsed();
            if (range == null) return BadRequest("File Excel trống.");
            var rows = range.RowsUsed().Skip(1); // Bỏ qua dòng tiêu đề

            var students = new List<Student>();

        foreach (var row in rows)
        {
            try
            {
                // Helper để đọc ngày từ cell (hỗ trợ cả DateTime và String format YYYY-MM-DD)
                DateTime? ReadDate(IXLCell cell)
                {
                    if (cell.IsEmpty()) return null;
                    try { return cell.GetDateTime(); } catch { }
                    if (DateTime.TryParse(cell.GetValue<string>(), out var d)) return d;
                    return null;
                }

                var holyName = row.Cell(1).GetValue<string>().Trim();
                var fullName = row.Cell(2).GetValue<string>().Trim();
                if (string.IsNullOrEmpty(holyName) || string.IsNullOrEmpty(fullName)) continue;

                var student = new Student
                {
                    Id = Guid.NewGuid(),
                    HolyName = holyName,                           // Cột A
                    FullName = fullName,                           // Cột B
                    BirthDate = ReadDate(row.Cell(3)) ?? DateTimeHelper.GetVnNow(), // Cột C
                    ClassName = row.Cell(4).GetValue<string>(),    // Cột D
                    Branch = (GiaoLy.Domain.Enums.HolyBranch)row.Cell(5).GetValue<int>(), // Cột E (1-4)
                    BaptismDate = ReadDate(row.Cell(6)),
                    CommunionDate = ReadDate(row.Cell(7)),
                    ConfirmationDate = ReadDate(row.Cell(8)),
                    ParentName = row.Cell(9).GetValue<string>(),
                    ParentPhone = row.Cell(10).GetValue<string>(),
                    Address = row.Cell(11).GetValue<string>(),
                    Notes = row.Cell(12).GetValue<string>(),
                    IsActive = true
                };
                students.Add(student);
            }
            catch { continue; } // Bỏ qua dòng lỗi
        }

        // Giai đoạn 5B — Bọc trong DB Transaction để đảm bảo tính toàn vẹn dữ liệu (Atomicity).
        // Nếu bất kỳ dòng nào lỗi khi AddRange/SaveChanges, toàn bộ bị Rollback.
        // Tránh tình trạng import nửa vời, dữ liệu rác trong DB.
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            await _context.Students.AddRangeAsync(students);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return Ok(new
            {
                count = students.Count,
                message = $"✅ Đã import thành công {students.Count} đoàn sinh vào hệ thống."
            });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new
            {
                message = $"❌ Lỗi khi lưu dữ liệu, đã hủy toàn bộ tiến trình import: {ex.Message}"
            });
        }
        }
    }

    [HttpPost("assign-classes")]
    [RequirePermission("students.update")]
    public async Task<IActionResult> AssignClasses([FromBody] AssignClassesRequest request)
    {
        if (request.StudentIds == null || !request.StudentIds.Any() || request.NumberOfClasses <= 0)
            return BadRequest("Dữ liệu đầu vào không hợp lệ.");

        var students = await _context.Students
            .Where(s => request.StudentIds.Contains(s.Id))
            .ToListAsync();

        if (!students.Any()) return NotFound("Không tìm thấy đoàn sinh nào.");

        int numClasses = request.NumberOfClasses;
        
        if (request.Method == "Random")
        {
            var random = new Random();
            var shuffled = students.OrderBy(x => random.Next()).ToList();
            
            for (int i = 0; i < shuffled.Count; i++)
            {
                int classIndex = (i % numClasses) + 1;
                shuffled[i].ClassName = $"{request.BranchPrefix} {classIndex}";
            }
        }
        else if (request.Method == "Area")
        {
            // Group by Area
            var grouped = students.GroupBy(s => s.Area ?? "Khác").ToList();
            int currentClassIndex = 1;
            int studentsPerClass = (int)Math.Ceiling((double)students.Count / numClasses);
            int currentClassCount = 0;

            foreach (var group in grouped)
            {
                foreach (var student in group)
                {
                    student.ClassName = $"{request.BranchPrefix} {currentClassIndex}";
                    currentClassCount++;
                    
                    if (currentClassCount >= studentsPerClass && currentClassIndex < numClasses)
                    {
                        currentClassIndex++;
                        currentClassCount = 0;
                    }
                }
            }
        }
        else
        {
            return BadRequest("Phương thức chia lớp không được hỗ trợ.");
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Đã xếp lớp thành công cho {students.Count} đoàn sinh." });
    }

    [AllowAnonymous]
    [HttpGet("verify")]
    public async Task<IActionResult> VerifyStudent([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q) || q.Length < 2)
            return BadRequest(new { message = "Vui lòng nhập ít nhất 2 ký tự." });

        var keyword = q.Trim().ToLower();

        var students = await _context.Students
            .Where(s => s.IsActive &&
                (s.FullName.ToLower().Contains(keyword) ||
                 s.HolyName.ToLower().Contains(keyword)))
            .OrderBy(s => s.FullName)
            .Take(10)
            .ToListAsync();

        var studentIds = students.Select(s => s.Id).ToList();

        // Lấy điểm trung bình từ bảng Grades
        var gradeAvgs = await _context.Grades
            .Where(g => studentIds.Contains(g.StudentId))
            .GroupBy(g => g.StudentId)
            .Select(grp => new { StudentId = grp.Key, Avg = grp.Average(g => g.GPA) })
            .ToListAsync();

        var results = students.Select(s =>
        {
            var avg = gradeAvgs.FirstOrDefault(g => g.StudentId == s.Id);
            return new
            {
                studentId = s.Id,
                studentName = (s.HolyName != null && s.HolyName != "" ? s.HolyName + " " : "") + s.FullName,
                branch = (int)s.Branch == 1 ? "Ấu Nhi" :
                         (int)s.Branch == 2 ? "Thiếu Nhi" :
                         (int)s.Branch == 3 ? "Nghĩa Sĩ" :
                         (int)s.Branch == 4 ? "Hiệp Sĩ" :
                         (int)s.Branch == 5 ? "Huynh Trưởng" : "Chưa phân loại",
                className = s.ClassName ?? "Chưa phân lớp",
                academicYear = (string?)null,
                averageGrade = avg != null ? (double?)Math.Round(avg.Avg, 2) : null,
                conduct = (string?)null
            };
        });

        return Ok(results);
    }
}