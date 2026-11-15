using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
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

            return query.Where(c => c.LeaderId == userId);
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

            var activeClassIds = _db.ClassRooms
                .Where(c => c.Branch == branchId.Value)
                .Select(c => c.Id);

            var studentIds = _db.Enrollments
                .Where(e => e.Status == "Active" && activeClassIds.Contains(e.ClassRoomId))
                .Select(e => e.StudentId);

            return query.Where(s => studentIds.Contains(s.Id));
        }

        if (scope == "Classroom")
        {
            var userId = _currentUser.UserId;
            if (userId is null) return query.Where(_ => false);

            var activeClassIds = _db.ClassRooms
                .Where(c => c.LeaderId == userId)
                .Select(c => c.Id);

            var studentIds = _db.Enrollments
                .Where(e => e.Status == "Active" && activeClassIds.Contains(e.ClassRoomId))
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

            return query.Where(e => e.ClassRoom != null && e.ClassRoom.LeaderId == userId);
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
