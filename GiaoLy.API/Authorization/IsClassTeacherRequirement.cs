using Microsoft.AspNetCore.Authorization;

namespace GiaoLy.API.Authorization;

/// <summary>
/// Marker class — Định nghĩa yêu cầu phân quyền "Người dùng phải là GLV phụ trách lớp này".
/// Được đăng ký trong Program.cs thành Policy tên "IsClassTeacher".
/// Được xử lý bởi IsClassTeacherHandler.
/// </summary>
public class IsClassTeacherRequirement : IAuthorizationRequirement { }
