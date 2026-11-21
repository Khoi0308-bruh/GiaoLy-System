using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Security;

public class ScopeContext : IScopeContext
{
    private readonly ICurrentUser _currentUser;
    private readonly AppDbContext _db;

    public ScopeContext(ICurrentUser currentUser, AppDbContext db)
    {
        _currentUser = currentUser;
        _db = db;
    }

    public IQueryable<ClassRoom> ClassRooms(IQueryable<ClassRoom> query)
    {
        var scope = _currentUser.ScopeType;

        if (scope == "All")
        {
            return query;
        }

        if (scope == "Branch")
        {
            var branchId = _currentUser.BranchId;
            if (branchId is null)
            {
                return query.Where(_ => false);
            }

            return query.Where(c => c.Branch == branchId.Value);
        }

        if (scope == "Classroom")
        {
            var userId = _currentUser.UserId;
            if (userId is null)
            {
                return query.Where(_ => false);
            }

            // Giáo lý viên chủ nhiệm được ghi ở ClassRoomTeachers (IsLead = 1) — đúng nơi
            // màn hình phân công giáo lý viên ghi vào. Cột LeaderId chỉ là dữ liệu cũ,
            // chỉ dựa vào nó thì trưởng lớp vừa được phân công sẽ không thấy lớp nào.
            return query.Where(c =>
                c.LeaderId == userId ||
                c.Teachers.Any(t => t.IsLead && t.UserId == userId));
        }

        if (scope == "Guardian")
        {
            return query.Where(_ => false);
        }

        return query.Where(_ => false);
    }

    public IQueryable<Student> Students(IQueryable<Student> query)
    {
        var scope = _currentUser.ScopeType;

        if (scope == "All")
        {
            return query;
        }

        if (scope == "Branch")
        {
            var branchId = _currentUser.BranchId;
            if (branchId is null) return query.Where(_ => false);

            // Phạm vi ngành phải theo ngành ghi trên hồ sơ (Student.BranchId) — cùng định nghĩa
            // với danh sách đoàn sinh và dashboard. Lọc theo ghi danh sẽ làm mất toàn bộ hồ sơ
            // chưa xếp lớp và kéo cả hồ sơ của ngành khác đang học trong lớp của ngành này.
            return query.Where(s => s.BranchId == branchId.Value);
        }

        if (scope == "Classroom")
        {
            var userId = _currentUser.UserId;
            if (userId is null) return query.Where(_ => false);

            var leaderClassIds = _db.ClassRooms
                .Where(c =>
                    c.LeaderId == userId ||
                    c.Teachers.Any(t => t.IsLead && t.UserId == userId))
                .Select(c => c.Id);

            // Chỉ loại ghi danh đã rời lớp (chuyển đi, bỏ học). Ghi danh Promoted, Repeated
            // hay Graduated vẫn là học sinh của lớp trong niên khóa đó; nếu chỉ lấy "Active"
            // thì sau khi chạy đợt lên lớp, trưởng lớp sẽ thấy 0 đoàn sinh.
            var studentIds = _db.Enrollments
                .Where(e =>
                    e.Status != EnrollmentRules.Statuses.Transferred &&
                    e.Status != EnrollmentRules.Statuses.DropOut &&
                    leaderClassIds.Contains(e.ClassRoomId))
                .Select(e => e.StudentId);

            return query.Where(s => studentIds.Contains(s.Id));
        }

        if (scope == "Guardian")
        {
            return query.Where(_ => false);
        }

        return query.Where(_ => false);
    }

    public IQueryable<Enrollment> Enrollments(IQueryable<Enrollment> query)
    {
        var scope = _currentUser.ScopeType;

        if (scope == "All")
        {
            return query;
        }

        if (scope == "Branch")
        {
            var branchId = _currentUser.BranchId;
            if (branchId is null) return query.Where(_ => false);

            return query.Where(e => e.ClassRoom != null && e.ClassRoom.Branch == branchId.Value);
        }

        if (scope == "Classroom")
        {
            var userId = _currentUser.UserId;
            if (userId is null) return query.Where(_ => false);

            return query.Where(e => e.ClassRoom != null &&
                (e.ClassRoom.LeaderId == userId ||
                 e.ClassRoom.Teachers.Any(t => t.IsLead && t.UserId == userId)));
        }

        return query.Where(_ => false);
    }

    public async Task<bool> CanAccessClassRoomAsync(Guid classRoomId, CancellationToken ct = default)
    {
        return await ClassRooms(_db.ClassRooms).AnyAsync(c => c.Id == classRoomId, ct);
    }

    public async Task<bool> CanAccessStudentAsync(Guid studentId, CancellationToken ct = default)
    {
        return await Students(_db.Students).AnyAsync(s => s.Id == studentId, ct);
    }
}
