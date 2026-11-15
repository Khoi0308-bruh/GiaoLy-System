# Mô hình giao diện: màn hình -> endpoint backend -> quyền. Nguồn duy nhất cho bản đồ phủ và tài liệu.
SCREENS=[]
def S(area,route,title,group,perm,eps,actions="",note=""):
    e=[]
    for x in eps.split(";"):
        x=x.strip()
        if not x: continue
        m,p=x.split(" ",1); e.append((m.strip(),p.strip()))
    a=[]
    for x in actions.split(";"):
        x=x.strip()
        if not x: continue
        lab,pm=x.rsplit(":",1); a.append((lab.strip(),pm.strip()))
    SCREENS.append(dict(area=area,route=route,title=title,group=group,perm=perm,eps=e,actions=a,note=note))
A="admin";P="portal";G="guardian"
# ===== ĐĂNG NHẬP VÀ TÀI KHOẢN =====
S(A,"/dang-nhap","Đăng nhập","Tài khoản","PUBLIC","POST /auth/login; POST /auth/refresh","","Khóa tạm sau 5 lần sai; hiện thời gian còn lại; không nói tài khoản có tồn tại hay không")
S(A,"/doi-mat-khau-lan-dau","Đổi mật khẩu lần đầu","Tài khoản","AUTHED","POST /auth/change-password","","Bắt buộc khi MustChangePassword; chặn mọi trang khác")
S(A,"/admin/tai-khoan","Hồ sơ cá nhân","Tài khoản","AUTHED","GET /auth/me; PUT /me/profile; POST /me/avatar; POST /auth/change-password; POST /auth/logout","","Hiện vai trò, phạm vi và danh sách quyền của chính mình")
# ===== TỔNG QUAN =====
S(A,"/admin","Tổng quan","Tổng quan","AUTHED","GET /academic-years/active; GET /reports/dashboard; GET /announcements; GET /public/liturgical/today","Thẻ số liệu tổng quan:reports.view; Khung thông báo:announcements.view; Dải niên khóa hiện hành:academic.view","Thẻ số liệu theo phạm vi; dải phụng vụ; thông báo; việc cần làm theo quyền")
# ===== ĐOÀN SINH =====
S(A,"/admin/doan-sinh","Danh sách đoàn sinh","Đoàn sinh","students.view","GET /students; GET /students/stats; GET /students/export; GET /students/unassigned; GET /branches; GET /class-levels; GET /classrooms/{id}/roster",
  "Thêm đoàn sinh:students.create; Xuất Excel:students.export; Nhập Excel:students.import; Xem SĐT phụ huynh:students.view-contact; Xem nhóm máu, dị ứng:students.view-health; Xếp lớp cho em chưa có lớp:enrollments.manage",
  "Bộ lọc ngành, cấp lớp, trạng thái; tab Chưa xếp lớp; tìm không dấu; nhãn phạm vi đang xem")
S(A,"/admin/doan-sinh/them","Thêm đoàn sinh","Đoàn sinh","students.create","POST /students; POST /students/duplicates/check; GET /academic-years/{yearId}/classrooms","Chọn lớp để xếp ngay:academic.view","Kiểm tra trùng 3 mức khi nhập; cảnh báo ngành theo tuổi; ghi nhận đồng ý của phụ huynh")
S(A,"/admin/doan-sinh/nhap-excel","Nhập đoàn sinh từ Excel","Đoàn sinh","students.import","GET /imports/students/template; POST /imports/students; GET /imports/{id}; POST /imports/{id}/apply; POST /imports/{id}/cancel","","Bốn bước: tải mẫu, tải file, xem báo cáo từng dòng, áp dụng")
S(A,"/admin/doan-sinh/{id}","Hồ sơ đoàn sinh","Đoàn sinh","students.view",
  "GET /students/{id}; PATCH /students/{id}; POST /students/{id}/status; DELETE /students/{id}; POST /students/{id}/restore; POST /students/{id}/photo; GET /students/{id}/guardians; PUT /students/{id}/guardians; GET /students/{id}/notes; POST /students/{id}/notes; DELETE /student-notes/{noteId}; GET /students/{id}/history; GET /students/{id}/enrollments; GET /students/{id}/sacraments; PUT /students/{id}/sacraments/{type}; DELETE /students/{id}/sacraments/{type}; GET /students/{id}/requirement-progress; PUT /students/{id}/requirement-progress/{requirementId}; GET /students/{id}/certificates; POST /students/{id}/certificates; POST /certificates/{id}/revoke; GET /certificates/{id}/pdf; GET /guardian-links; POST /guardian-links; DELETE /guardian-links/{id}",
  "Tab Bí tích:sacraments.view; Tab Chứng chỉ:certificates.view; Tab Lịch sử ghi danh:enrollments.view; Sửa hồ sơ:students.update; Đổi trạng thái:students.change-status; Xóa:students.delete; Khôi phục:students.restore; Viết ghi chú:students.notes.write; Cập nhật bí tích:sacraments.update; Cấp chứng chỉ:certificates.issue; Thu hồi chứng chỉ:certificates.revoke; Liên kết tài khoản phụ huynh:guardians.link; Xem liên hệ phụ huynh:students.view-contact; Xem thông tin sức khỏe:students.view-health",
  "Bảy tab: Thông tin, Phụ huynh, Bí tích và chứng chỉ, Học tập, Lịch sử, Ghi chú, Liên kết tài khoản")
S(A,"/admin/doan-sinh/yeu-cau-bi-tich","Yêu cầu chuẩn bị bí tích","Đoàn sinh","sacraments.view","GET /sacrament-requirements; POST /sacrament-requirements; PUT /sacrament-requirements/{id}","Thêm, sửa yêu cầu:sacraments.manage-requirements")
S(A,"/admin/gia-dinh","Gia đình thiếu nhi","Đoàn sinh","students.view","GET /families; POST /families; PUT /families/{id}; DELETE /families/{id}; PUT /families/{id}/members","Quản lý gia đình:families.manage")
# ===== LỚP HỌC VÀ NIÊN KHÓA =====
S(A,"/admin/nien-khoa","Niên khóa","Lớp học","academic.view","GET /academic-years; GET /academic-years/{id}; POST /academic-years; PUT /academic-years/{id}; DELETE /academic-years/{id}; POST /academic-years/{id}/activate; POST /academic-years/{id}/close; POST /academic-years/{id}/archive; POST /academic-years/{id}/reopen; POST /academic-years/{id}/clone-structure",
  "Tạo niên khóa:academic.create; Sửa niên khóa:academic.update; Xóa niên khóa:academic.delete; Kích hoạt, chốt, lưu trữ, mở lại:academic.lifecycle","Thanh trạng thái bốn bước Planned, Active, Closing, Archived; nút chỉ hiện đúng bước kế tiếp hợp lệ")
S(A,"/admin/lop","Danh sách lớp","Lớp học","academic.view","GET /academic-years/{yearId}/classrooms; POST /academic-years/{yearId}/classrooms","Tạo lớp:academic.create")
S(A,"/admin/lop/{id}","Chi tiết lớp","Lớp học","academic.view","GET /classrooms/{id}; PUT /classrooms/{id}; DELETE /classrooms/{id}; PUT /classrooms/{id}/teachers; GET /classrooms/{id}/enrollments; POST /classrooms/{id}/enrollments; POST /enrollments/{id}/transfer; POST /enrollments/{id}/withdraw",
  "Sửa lớp:academic.update; Xóa lớp:academic.delete; Phân công giáo lý viên:classrooms.assign-teachers; Xếp lớp, chuyển lớp, rút lớp:enrollments.manage; Xem ghi danh:enrollments.view","Tab Danh sách, Giáo lý viên, Điểm số, Hoa thiêng")
S(A,"/admin/lop/{id}/diem-so","Sổ điểm","Lớp học","grades.view","GET /classrooms/{id}/grades; PUT /classrooms/{id}/grades; GET /enrollments/{id}/grade; POST /classrooms/{id}/grade-unlocks; GET /classrooms/{id}/grade-unlocks; GET /classrooms/{id}/grades/export",
  "Nhập, sửa điểm:grades.update; Mở khóa sổ điểm:grades.unlock; Xuất bảng điểm:grades.export","Biểu ngữ trạng thái khóa sổ; ô trống khác 0; xung đột phiên bản hiện danh sách dòng bị người khác sửa")
S(A,"/admin/lop/{id}/hoa-thieng","Hoa thiêng","Lớp học","bouquets.view","GET /classrooms/{id}/bouquets; POST /classrooms/{id}/bouquets; POST /bouquets/{id}/reverse; GET /classrooms/{id}/bouquets/leaderboard","Ghi hoa thiêng:bouquets.give; Đảo dòng ghi nhầm:bouquets.manage")
S(A,"/admin/to-chuc","Ngành và cấp lớp","Lớp học","AUTHED","GET /branches; GET /class-levels; POST /branches; PUT /branches/{id}; POST /class-levels; PUT /class-levels/{id}","Thêm, sửa ngành và cấp lớp:org.manage")
# ===== LÊN LỚP =====
S(A,"/admin/len-lop","Đợt xét lên lớp","Lên lớp","promotion.view","GET /promotion-batches; POST /promotion-batches","Tạo đợt xét:promotion.create")
S(A,"/admin/len-lop/{id}","Duyệt đề xuất lên lớp","Lên lớp","promotion.view","GET /promotion-batches/{id}; GET /promotion-batches/{id}/drafts; POST /promotion-drafts/{id}/approve; POST /promotion-drafts/{id}/reject; PUT /promotion-drafts/{id}/target-class; POST /promotion-batches/{id}/approve-qualified; POST /promotion-batches/{id}/apply; POST /promotion-batches/{id}/cancel",
  "Duyệt, từ chối, chọn lớp đích:promotion.decide; Áp dụng đợt:promotion.apply; Hủy đợt:promotion.create","Bảng đề xuất có cột kết quả điểm, lý do, trạng thái Stale; nút áp dụng chỉ bật khi hết Pending")
# ===== HOẠT ĐỘNG =====
S(A,"/admin/trai","Sự kiện và trại","Hoạt động","camps.view","GET /camps; POST /camps; PUT /camps/{id}; DELETE /camps/{id}","Tạo, sửa, xóa sự kiện:camps.manage")
S(A,"/admin/trai/{id}","Đăng ký và thu phí sự kiện","Hoạt động","camps.view","GET /camps/{id}/registrations; POST /camps/{id}/registrations; PUT /camps/{id}/registrations/{registrationId}; DELETE /camps/{id}/registrations/{registrationId}; POST /camps/registrations/{registrationId}/payments; POST /camps/payments/{id}/reverse; GET /camps/{id}/finance",
  "Đăng ký đoàn sinh:camps.register; Thu phí, hoàn phí, xem tổng thu:camps.collect","Cột đã thu, còn thiếu tính từ sổ cái; không có điểm danh")
S(A,"/admin/truc-lop","Phân công trực lớp","Hoạt động","duty.view","GET /duty-assignments; POST /duty-assignments; PUT /duty-assignments/{id}; DELETE /duty-assignments/{id}","Phân công:duty.manage")
S(A,"/admin/giao-an","Giáo án","Hoạt động","lessonplans.view","GET /lesson-plans; GET /lesson-plans/{id}; POST /lesson-plans; PUT /lesson-plans/{id}; DELETE /lesson-plans/{id}","Soạn, sửa giáo án của mình:lessonplans.manage; Sửa giáo án của người khác:lessonplans.manage-all")
# ===== TRUYỀN THÔNG =====
S(A,"/admin/thong-bao","Thông báo","Truyền thông","announcements.view","GET /announcements; POST /announcements; PUT /announcements/{id}; DELETE /announcements/{id}","Đăng:announcements.create; Sửa:announcements.update; Xóa:announcements.delete","Chọn đối tượng nhận chỉ trong phạm vi của mình")
S(A,"/admin/tai-lieu","Tài liệu","Truyền thông","documents.view","GET /documents; GET /documents/{id}/download; POST /documents; PUT /documents/{id}; DELETE /documents/{id}","Tải lên:documents.create; Sửa:documents.update; Xóa:documents.delete")
S(A,"/admin/huynh-truong","Ban huynh trưởng","Truyền thông","leaders.view","GET /leaders; POST /leaders; PUT /leaders/{id}; DELETE /leaders/{id}","Thêm:leaders.create; Sửa:leaders.update; Xóa:leaders.delete")
S(A,"/admin/banner","Banner trang chủ","Truyền thông","banners.manage","GET /public/banners; POST /banners; PUT /banners/{id}; DELETE /banners/{id}","Quản lý banner:banners.manage","Lưu ý: cần thêm GET /banners (quản trị) để thấy cả banner đang tắt")
S(A,"/admin/tin-tuc","Tin tức","Truyền thông","news.view","GET /news/sources; POST /news/sources; PUT /news/sources/{id}; DELETE /news/sources/{id}; PUT /news/articles/{id}; GET /public/news","Thêm nguồn:news.create; Sửa nguồn, ẩn bài:news.update; Xóa nguồn:news.delete","Lưu ý: cần thêm GET /news/articles (quản trị) để thấy cả bài đang ẩn")
S(A,"/admin/lich-phung-vu","Lịch phụng vụ","Truyền thông","liturgical.view","GET /liturgical; PUT /liturgical/{date}","Ghi đè phụng vụ một ngày:liturgical.update")
# ===== BÁO CÁO VÀ HỆ THỐNG =====
S(A,"/admin/bao-cao","Báo cáo","Báo cáo","reports.view","GET /reports/students-by-branch; GET /reports/missing-data; GET /reports/promotion-summary; GET /reports/grades-summary; POST /reports/export","Xuất báo cáo:reports.export")
S(A,"/admin/nguoi-dung","Người dùng","Hệ thống","users.view","GET /users; GET /users/{id}; POST /users; PUT /users/{id}; PUT /users/{id}/role; POST /users/{id}/reset-password; POST /users/{id}/deactivate; POST /users/{id}/activate",
  "Thêm người dùng:users.create; Sửa:users.update; Gán vai trò:users.assign-role; Đặt lại mật khẩu:users.reset-password; Vô hiệu hóa:users.delete","Hiện mật khẩu tạm đúng một lần")
S(A,"/admin/vai-tro","Vai trò và quyền","Hệ thống","roles.view","GET /roles; GET /permissions; POST /roles; PUT /roles/{id}; DELETE /roles/{id}; PUT /roles/{id}/permissions",
  "Thêm vai trò:roles.create; Sửa vai trò:roles.update; Xóa vai trò:roles.delete; Gán quyền:roles.assign","Cây quyền theo module; ô quyền mình không có bị khóa kèm lý do")
S(A,"/admin/nhat-ky","Nhật ký kiểm toán","Hệ thống","audit.view","GET /audit-logs","")
S(A,"/admin/cau-hinh","Cấu hình nghiệp vụ","Hệ thống","settings.view","GET /system/settings; PUT /system/settings/{key}","Sửa cấu hình:settings.manage")
S(A,"/admin/tac-vu","Tác vụ nền","Hệ thống","jobs.view","GET /system/jobs; POST /system/jobs/{name}/run","Chạy tác vụ:jobs.run")
# ===== TRANG CÔNG KHAI =====
S(P,"/","Trang chủ","Công khai","PUBLIC","GET /public/banners; GET /public/announcements; GET /public/liturgical/today; GET /public/news; GET /public/stats","","Dải màu theo ngày phụng vụ; không có dữ liệu cá nhân")
S(P,"/thong-bao","Thông báo giáo xứ","Công khai","PUBLIC","GET /public/announcements")
S(P,"/tin-tuc","Tin Giáo hội","Công khai","PUBLIC","GET /public/news; GET /public/news/image")
S(P,"/thu-vien","Thư viện tài liệu","Công khai","PUBLIC","GET /public/documents; GET /public/documents/{id}/download")
S(P,"/ban-huynh-truong","Ban huynh trưởng","Công khai","PUBLIC","GET /public/leaders")
S(P,"/lich-phung-vu","Lịch phụng vụ","Công khai","PUBLIC","GET /public/liturgical/date/{date}; GET /public/liturgical/month/{year}/{month}; GET /public/liturgical/today")
S(P,"/xac-thuc-chung-chi","Xác thực chứng chỉ","Công khai","PUBLIC","GET /public/certificates/verify; GET /public/certificates/pdf","","Tên đã che; giới hạn tần suất hiện thông báo thân thiện")
# ===== CỔNG PHỤ HUYNH =====
S(G,"/phu-huynh","Các con của tôi","Phụ huynh","portal.children.view","GET /portal/children; GET /portal/announcements")
S(G,"/phu-huynh/{id}","Hồ sơ của con","Phụ huynh","portal.children.view","GET /portal/children/{id}; GET /portal/children/{id}/grades; GET /portal/children/{id}/certificates; GET /portal/children/{id}/certificates/{certificateId}/pdf","","Không có ghi chú nội bộ; chỉ hiển thị con của mình")
INTERNAL=[("GET","/health"),("GET","/health/ready")]  # không có giao diện, dành cho giám sát
