// Sinh tự động từ permission-matrix.csv. Không sửa tay: chạy tools/build_layer.py
export const PERMISSIONS = {
  Users: {
    View: 'users.view', // Xem danh sách người dùng
    Create: 'users.create', // Thêm người dùng
    Update: 'users.update', // Sửa người dùng
    Delete: 'users.delete', // Vô hiệu hóa người dùng
    AssignRole: 'users.assign-role', // Gán vai trò cho người dùng
    ResetPassword: 'users.reset-password', // Đặt lại mật khẩu người khác
  },
  Roles: {
    View: 'roles.view', // Xem vai trò và danh mục quyền
    Create: 'roles.create', // Thêm vai trò
    Update: 'roles.update', // Sửa vai trò
    Delete: 'roles.delete', // Xóa vai trò
    Assign: 'roles.assign', // Gán quyền cho vai trò
  },
  Guardians: {
    Link: 'guardians.link', // Liên kết tài khoản phụ huynh với đoàn sinh
  },
  Students: {
    View: 'students.view', // Xem danh sách và hồ sơ cơ bản
    Create: 'students.create', // Thêm đoàn sinh
    Update: 'students.update', // Sửa hồ sơ đoàn sinh
    Delete: 'students.delete', // Xóa mềm đoàn sinh
    Restore: 'students.restore', // Khôi phục đoàn sinh
    ChangeStatus: 'students.change-status', // Đổi trạng thái đoàn sinh
    ViewContact: 'students.view-contact', // Xem SĐT phụ huynh và địa chỉ
    ViewHealth: 'students.view-health', // Xem nhóm máu, dị ứng, ghi chú sức khỏe
    NotesWrite: 'students.notes.write', // Viết ghi chú về đoàn sinh
    Import: 'students.import', // Nhập đoàn sinh từ Excel
    Export: 'students.export', // Xuất danh sách đoàn sinh
  },
  Org: {
    Manage: 'org.manage', // Quản lý ngành và cấp lớp
  },
  Academic: {
    View: 'academic.view', // Xem niên khóa và lớp
    Create: 'academic.create', // Thêm niên khóa, lớp
    Update: 'academic.update', // Sửa niên khóa, lớp
    Delete: 'academic.delete', // Xóa niên khóa, lớp
    Lifecycle: 'academic.lifecycle', // Kích hoạt, chốt, lưu trữ, mở lại niên khóa
  },
  Classrooms: {
    AssignTeachers: 'classrooms.assign-teachers', // Phân công giáo lý viên cho lớp
  },
  Families: {
    Manage: 'families.manage', // Quản lý gia đình thiếu nhi
  },
  Enrollments: {
    View: 'enrollments.view', // Xem ghi danh
    Manage: 'enrollments.manage', // Xếp lớp, chuyển lớp, rút lớp
  },
  Promotion: {
    View: 'promotion.view', // Xem đợt xét lên lớp
    Create: 'promotion.create', // Tạo đợt xét lên lớp
    Decide: 'promotion.decide', // Duyệt hoặc từ chối đề xuất lên lớp
    Apply: 'promotion.apply', // Áp dụng đợt lên lớp
  },
  Grades: {
    View: 'grades.view', // Xem điểm
    Update: 'grades.update', // Nhập và sửa điểm
    Unlock: 'grades.unlock', // Mở khóa sổ điểm một lớp
    Export: 'grades.export', // Xuất bảng điểm
  },
  Sacraments: {
    View: 'sacraments.view', // Xem bí tích
    Update: 'sacraments.update', // Cập nhật bí tích và tiến độ chuẩn bị
    ManageRequirements: 'sacraments.manage-requirements', // Quản lý yêu cầu chuẩn bị bí tích
  },
  Certificates: {
    View: 'certificates.view', // Xem chứng chỉ
    Issue: 'certificates.issue', // Cấp chứng chỉ
    Revoke: 'certificates.revoke', // Thu hồi chứng chỉ
  },
  Camps: {
    View: 'camps.view', // Xem sự kiện
    Manage: 'camps.manage', // Quản lý sự kiện
    Register: 'camps.register', // Đăng ký đoàn sinh vào sự kiện
    Collect: 'camps.collect', // Thu phí sự kiện
  },
  Duty: {
    View: 'duty.view', // Xem phân công trực
    Manage: 'duty.manage', // Quản lý phân công trực
  },
  LessonPlans: {
    View: 'lessonplans.view', // Xem giáo án
    Manage: 'lessonplans.manage', // Quản lý giáo án của mình
    ManageAll: 'lessonplans.manage-all', // Quản lý mọi giáo án trong phạm vi
  },
  Bouquets: {
    View: 'bouquets.view', // Xem hoa thiêng
    Give: 'bouquets.give', // Ghi hoa thiêng
    Manage: 'bouquets.manage', // Đảo hoa thiêng
  },
  Announcements: {
    View: 'announcements.view', // Xem thông báo
    Create: 'announcements.create', // Đăng thông báo
    Update: 'announcements.update', // Sửa thông báo
    Delete: 'announcements.delete', // Xóa thông báo
  },
  Documents: {
    View: 'documents.view', // Xem tài liệu nội bộ
    Create: 'documents.create', // Tải tài liệu lên
    Update: 'documents.update', // Sửa tài liệu
    Delete: 'documents.delete', // Xóa tài liệu
  },
  Leaders: {
    View: 'leaders.view', // Xem ban huynh trưởng
    Create: 'leaders.create', // Thêm huynh trưởng
    Update: 'leaders.update', // Sửa huynh trưởng
    Delete: 'leaders.delete', // Xóa huynh trưởng
  },
  Banners: {
    Manage: 'banners.manage', // Quản lý banner
  },
  News: {
    View: 'news.view', // Xem tin tức quản trị
    Create: 'news.create', // Thêm nguồn tin
    Update: 'news.update', // Sửa nguồn tin, ẩn bài
    Delete: 'news.delete', // Xóa nguồn tin
  },
  Liturgical: {
    View: 'liturgical.view', // Xem lịch phụng vụ quản trị
    Update: 'liturgical.update', // Cập nhật lịch phụng vụ
  },
  Reports: {
    View: 'reports.view', // Xem báo cáo
    Export: 'reports.export', // Xuất báo cáo
  },
  Portal: {
    ChildrenView: 'portal.children.view', // Cổng phụ huynh: xem con của mình
  },
  Audit: {
    View: 'audit.view', // Xem nhật ký kiểm toán
  },
  Settings: {
    View: 'settings.view', // Xem cấu hình nghiệp vụ
    Manage: 'settings.manage', // Sửa cấu hình nghiệp vụ
  },
  Jobs: {
    View: 'jobs.view', // Xem tác vụ nền
    Run: 'jobs.run', // Chạy tác vụ nền
  },
} as const

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS][keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]]
