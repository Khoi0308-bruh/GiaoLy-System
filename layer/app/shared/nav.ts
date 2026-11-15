// Sinh tự động từ tools/fe_model.py. Mục chỉ hiện khi người dùng có quyền xem tương ứng.
import type { PermissionCode } from './permissions'

export interface NavItem { label: string, to: string, permission?: PermissionCode }
export interface NavGroup { label: string, items: NavItem[] }

export const ADMIN_NAV: NavGroup[] = [
  { label: "Tổng quan", items: [
    { label: "Tổng quan", to: "/admin" },
  ] },
  { label: "Đoàn sinh", items: [
    { label: "Danh sách đoàn sinh", to: "/admin/doan-sinh", permission: 'students.view' },
    { label: "Thêm đoàn sinh", to: "/admin/doan-sinh/them", permission: 'students.create' },
    { label: "Nhập đoàn sinh từ Excel", to: "/admin/doan-sinh/nhap-excel", permission: 'students.import' },
    { label: "Yêu cầu chuẩn bị bí tích", to: "/admin/doan-sinh/yeu-cau-bi-tich", permission: 'sacraments.view' },
    { label: "Gia đình thiếu nhi", to: "/admin/gia-dinh", permission: 'students.view' },
  ] },
  { label: "Lớp học", items: [
    { label: "Niên khóa", to: "/admin/nien-khoa", permission: 'academic.view' },
    { label: "Danh sách lớp", to: "/admin/lop", permission: 'academic.view' },
    { label: "Ngành và cấp lớp", to: "/admin/to-chuc" },
  ] },
  { label: "Lên lớp", items: [
    { label: "Đợt xét lên lớp", to: "/admin/len-lop", permission: 'promotion.view' },
  ] },
  { label: "Hoạt động", items: [
    { label: "Sự kiện và trại", to: "/admin/trai", permission: 'camps.view' },
    { label: "Phân công trực lớp", to: "/admin/truc-lop", permission: 'duty.view' },
    { label: "Giáo án", to: "/admin/giao-an", permission: 'lessonplans.view' },
  ] },
  { label: "Truyền thông", items: [
    { label: "Thông báo", to: "/admin/thong-bao", permission: 'announcements.view' },
    { label: "Tài liệu", to: "/admin/tai-lieu", permission: 'documents.view' },
    { label: "Ban huynh trưởng", to: "/admin/huynh-truong", permission: 'leaders.view' },
    { label: "Banner trang chủ", to: "/admin/banner", permission: 'banners.manage' },
    { label: "Tin tức", to: "/admin/tin-tuc", permission: 'news.view' },
    { label: "Lịch phụng vụ", to: "/admin/lich-phung-vu", permission: 'liturgical.view' },
  ] },
  { label: "Báo cáo", items: [
    { label: "Báo cáo", to: "/admin/bao-cao", permission: 'reports.view' },
  ] },
  { label: "Hệ thống", items: [
    { label: "Người dùng", to: "/admin/nguoi-dung", permission: 'users.view' },
    { label: "Vai trò và quyền", to: "/admin/vai-tro", permission: 'roles.view' },
    { label: "Nhật ký kiểm toán", to: "/admin/nhat-ky", permission: 'audit.view' },
    { label: "Cấu hình nghiệp vụ", to: "/admin/cau-hinh", permission: 'settings.view' },
    { label: "Tác vụ nền", to: "/admin/tac-vu", permission: 'jobs.view' },
  ] },
]
