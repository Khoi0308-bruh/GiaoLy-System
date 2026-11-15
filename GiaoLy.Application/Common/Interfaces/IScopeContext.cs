using GiaoLy.Domain.Entities;

namespace GiaoLy.Application.Common.Interfaces;

public interface IScopeContext
{
    IQueryable<ClassRoom> ClassRooms(IQueryable<ClassRoom> query);
    IQueryable<Student> Students(IQueryable<Student> query);
    IQueryable<Enrollment> Enrollments(IQueryable<Enrollment> query);
    Task<bool> CanAccessClassRoomAsync(Guid classRoomId, CancellationToken ct = default);
    Task<bool> CanAccessStudentAsync(Guid studentId, CancellationToken ct = default);
}
