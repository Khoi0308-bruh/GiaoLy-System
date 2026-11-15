EXISTING=set("""users.view users.create users.update users.delete roles.view roles.create roles.update roles.delete roles.assign
students.view students.create students.update students.delete students.import students.export academic.view academic.create academic.update academic.delete
grades.view grades.update certificates.view certificates.issue leaders.view leaders.create leaders.update leaders.delete
announcements.view announcements.create announcements.update announcements.delete documents.view documents.create documents.update documents.delete
liturgical.view liturgical.update news.view news.create news.update news.delete reports.view reports.export""".split())
P=[ # code, name, module
("users.view","Xem danh sách người dùng","Users"),("users.create","Thêm người dùng","Users"),("users.update","Sửa người dùng","Users"),("users.delete","Vô hiệu hóa người dùng","Users"),
("users.assign-role","Gán vai trò cho người dùng","Users"),("users.reset-password","Đặt lại mật khẩu người khác","Users"),
("roles.view","Xem vai trò và danh mục quyền","Roles"),("roles.create","Thêm vai trò","Roles"),("roles.update","Sửa vai trò","Roles"),("roles.delete","Xóa vai trò","Roles"),("roles.assign","Gán quyền cho vai trò","Roles"),
("guardians.link","Liên kết tài khoản phụ huynh với đoàn sinh","Students"),
("students.view","Xem danh sách và hồ sơ cơ bản","Students"),("students.create","Thêm đoàn sinh","Students"),("students.update","Sửa hồ sơ đoàn sinh","Students"),
("students.delete","Xóa mềm đoàn sinh","Students"),("students.restore","Khôi phục đoàn sinh","Students"),("students.change-status","Đổi trạng thái đoàn sinh","Students"),
("students.view-contact","Xem SĐT phụ huynh và địa chỉ","Students"),("students.view-health","Xem nhóm máu, dị ứng, ghi chú sức khỏe","Students"),
("students.notes.write","Viết ghi chú về đoàn sinh","Students"),("students.import","Nhập đoàn sinh từ Excel","Students"),("students.export","Xuất danh sách đoàn sinh","Students"),
("org.manage","Quản lý ngành và cấp lớp","Academic"),("academic.view","Xem niên khóa và lớp","Academic"),("academic.create","Thêm niên khóa, lớp","Academic"),("academic.update","Sửa niên khóa, lớp","Academic"),
("academic.delete","Xóa niên khóa, lớp","Academic"),("academic.lifecycle","Kích hoạt, chốt, lưu trữ, mở lại niên khóa","Academic"),("classrooms.assign-teachers","Phân công giáo lý viên cho lớp","Academic"),
("families.manage","Quản lý gia đình thiếu nhi","Academic"),
("enrollments.view","Xem ghi danh","Enrollments"),("enrollments.manage","Xếp lớp, chuyển lớp, rút lớp","Enrollments"),
("promotion.view","Xem đợt xét lên lớp","Promotion"),("promotion.create","Tạo đợt xét lên lớp","Promotion"),("promotion.decide","Duyệt hoặc từ chối đề xuất lên lớp","Promotion"),("promotion.apply","Áp dụng đợt lên lớp","Promotion"),
("grades.view","Xem điểm","Grades"),("grades.update","Nhập và sửa điểm","Grades"),("grades.unlock","Mở khóa sổ điểm một lớp","Grades"),("grades.export","Xuất bảng điểm","Grades"),
("sacraments.view","Xem bí tích","Sacraments"),("sacraments.update","Cập nhật bí tích và tiến độ chuẩn bị","Sacraments"),("sacraments.manage-requirements","Quản lý yêu cầu chuẩn bị bí tích","Sacraments"),
("certificates.view","Xem chứng chỉ","Certificates"),("certificates.issue","Cấp chứng chỉ","Certificates"),("certificates.revoke","Thu hồi chứng chỉ","Certificates"),
("camps.view","Xem sự kiện","Camps"),("camps.manage","Quản lý sự kiện","Camps"),("camps.register","Đăng ký đoàn sinh vào sự kiện","Camps"),("camps.collect","Thu phí sự kiện","Camps"),
("duty.view","Xem phân công trực","Duty"),("duty.manage","Quản lý phân công trực","Duty"),
("lessonplans.view","Xem giáo án","LessonPlans"),("lessonplans.manage","Quản lý giáo án của mình","LessonPlans"),("lessonplans.manage-all","Quản lý mọi giáo án trong phạm vi","LessonPlans"),
("bouquets.view","Xem hoa thiêng","Bouquets"),("bouquets.give","Ghi hoa thiêng","Bouquets"),("bouquets.manage","Đảo hoa thiêng","Bouquets"),
("announcements.view","Xem thông báo","Announcements"),("announcements.create","Đăng thông báo","Announcements"),("announcements.update","Sửa thông báo","Announcements"),("announcements.delete","Xóa thông báo","Announcements"),
("documents.view","Xem tài liệu nội bộ","Documents"),("documents.create","Tải tài liệu lên","Documents"),("documents.update","Sửa tài liệu","Documents"),("documents.delete","Xóa tài liệu","Documents"),
("leaders.view","Xem ban huynh trưởng","Leaders"),("leaders.create","Thêm huynh trưởng","Leaders"),("leaders.update","Sửa huynh trưởng","Leaders"),("leaders.delete","Xóa huynh trưởng","Leaders"),
("banners.manage","Quản lý banner","Content"),
("news.view","Xem tin tức quản trị","News"),("news.create","Thêm nguồn tin","News"),("news.update","Sửa nguồn tin, ẩn bài","News"),("news.delete","Xóa nguồn tin","News"),
("liturgical.view","Xem lịch phụng vụ quản trị","Liturgical"),("liturgical.update","Cập nhật lịch phụng vụ","Liturgical"),
("reports.view","Xem báo cáo","Reports"),("reports.export","Xuất báo cáo","Reports"),
("portal.children.view","Cổng phụ huynh: xem con của mình","Portal"),
("audit.view","Xem nhật ký kiểm toán","Platform"),("settings.view","Xem cấu hình nghiệp vụ","Platform"),("settings.manage","Sửa cấu hình nghiệp vụ","Platform"),
("jobs.view","Xem tác vụ nền","Platform"),("jobs.run","Chạy tác vụ nền","Platform")]
PERMS=[(c,n,m,c in EXISTING) for c,n,m in P]
ALLC=[p[0] for p in PERMS]
STAFF=[c for c in ALLC if not c.startswith("portal.")]
ROLES=[
 dict(code="SystemAdmin",name="Quản trị hệ thống",scope="All",system=True,grants=list(STAFF),desc="Toàn quyền, kể cả vai trò, cấu hình, tác vụ nền"),
 dict(code="ExecutiveBoard",name="Ban điều hành",scope="All",system=True,
  grants=[c for c in STAFF if c not in ("roles.create","roles.update","roles.delete","roles.assign","settings.manage","jobs.run")],desc="Toàn quyền nghiệp vụ, không sửa vai trò, cấu hình, tác vụ nền"),
 dict(code="SecretaryTreasurer",name="Thư ký và thủ quỹ",scope="All",system=True,
  grants="students.view students.create students.update students.restore students.change-status students.view-contact students.view-health students.notes.write students.import students.export guardians.link academic.view families.manage enrollments.view enrollments.manage promotion.view promotion.create promotion.decide grades.view grades.export sacraments.view sacraments.update sacraments.manage-requirements certificates.view certificates.issue certificates.revoke camps.view camps.manage camps.register camps.collect duty.view lessonplans.view bouquets.view announcements.view announcements.create announcements.update announcements.delete documents.view documents.create documents.update documents.delete leaders.view news.view liturgical.view reports.view reports.export".split(),desc="Hồ sơ, ghi danh, chứng chỉ, thu phí, thông báo"),
 dict(code="DivisionLeader",name="Trưởng ngành",scope="Branch",system=True,
  grants="students.view students.create students.update students.change-status students.view-contact students.view-health students.notes.write academic.view classrooms.assign-teachers families.manage enrollments.view enrollments.manage promotion.view promotion.decide grades.view grades.update grades.export sacraments.view sacraments.update certificates.view camps.view camps.manage camps.register duty.view duty.manage lessonplans.view lessonplans.manage lessonplans.manage-all bouquets.view bouquets.give bouquets.manage announcements.view announcements.create announcements.update documents.view documents.create leaders.view news.view liturgical.view reports.view".split(),desc="Quản lý các lớp thuộc ngành mình"),
 dict(code="Catechist",name="Giáo lý viên",scope="Classroom",system=True,
  grants="students.view students.view-contact students.view-health students.notes.write academic.view enrollments.view grades.view grades.update sacraments.view sacraments.update certificates.view camps.view camps.register duty.view lessonplans.view lessonplans.manage bouquets.view bouquets.give announcements.view documents.view leaders.view news.view liturgical.view reports.view".split(),desc="Quản lý lớp mình phụ trách"),
 dict(code="Guardian",name="Phụ huynh",scope="Guardian",system=True,grants=["portal.children.view"],desc="Chỉ xem con của mình qua cổng phụ huynh"),
]
# ---- endpoints
EP=[]
def E(module,method,path,perm,scope,summary,tables=(),audit=False,rl=None,extra=(),note=""):
    EP.append(dict(module=module,method=method,path="/api/v1"+path,perm=perm,scope=scope,summary=summary,tables=list(tables),audit=audit,rl=rl,extra=list(extra),note=note))
ID="Định danh"
E(ID,"POST","/auth/login","PUBLIC","NONE","Đăng nhập; khóa tạm sau 5 lần sai",["Users","RefreshTokens"],True,"login")
E(ID,"POST","/auth/refresh","PUBLIC","NONE","Đổi refresh token lấy access token mới (xoay vòng)",["RefreshTokens","Users"],False,"login")
E(ID,"POST","/auth/logout","AUTHED","SELF","Đăng xuất, thu hồi refresh token",["RefreshTokens"],True)
E(ID,"GET","/auth/me","AUTHED","SELF","Hồ sơ, vai trò, quyền và phạm vi của người đang đăng nhập",["Users","Roles","RolePermissions"])
E(ID,"POST","/auth/change-password","AUTHED","SELF","Đổi mật khẩu, thu hồi mọi phiên cũ",["Users","RefreshTokens"],True)
E(ID,"PUT","/me/profile","AUTHED","SELF","Sửa hồ sơ cá nhân",["Users"],True)
E(ID,"POST","/me/avatar","AUTHED","SELF","Tải ảnh đại diện (2 MB, kiểm tra byte đầu tệp)",["Users"],True,"upload")
E(ID,"GET","/users","users.view","ALL","Danh sách người dùng (phân trang)",["Users","Roles"])
E(ID,"GET","/users/{id}","users.view","ALL","Chi tiết người dùng",["Users","Roles","ClassRoomTeachers"])
E(ID,"POST","/users","users.create","ALL","Tạo tài khoản, sinh mật khẩu tạm",["Users"],True)
E(ID,"PUT","/users/{id}","users.update","ALL","Sửa thông tin người dùng (không đổi vai trò)",["Users"],True)
E(ID,"PUT","/users/{id}/role","users.assign-role","ALL","Gán vai trò và ngành, kiểm tra PrivilegeGuard",["Users","Roles","RolePermissions"],True,note="Không gán vai trò có quyền vượt quyền của người gán")
E(ID,"POST","/users/{id}/reset-password","users.reset-password","ALL","Đặt lại mật khẩu, bắt đổi lần đầu",["Users","RefreshTokens"],True)
E(ID,"POST","/users/{id}/deactivate","users.delete","ALL","Vô hiệu hóa tài khoản, thu hồi phiên",["Users","RefreshTokens"],True,note="Không hạ hay khóa quản trị cuối cùng")
E(ID,"POST","/users/{id}/activate","users.update","ALL","Kích hoạt lại tài khoản",["Users"],True)
E(ID,"GET","/roles","roles.view","ALL","Danh sách vai trò kèm quyền",["Roles","RolePermissions"])
E(ID,"POST","/roles","roles.create","ALL","Tạo vai trò (mã không trùng mã dành riêng)",["Roles"],True)
E(ID,"PUT","/roles/{id}","roles.update","ALL","Sửa vai trò (vai trò hệ thống không đổi mã)",["Roles"],True)
E(ID,"DELETE","/roles/{id}","roles.delete","ALL","Xóa vai trò chưa có người dùng",["Roles","Users"],True)
E(ID,"GET","/permissions","roles.view","ALL","Danh mục quyền theo module",["Permissions"])
E(ID,"PUT","/roles/{id}/permissions","roles.assign","ALL","Gán quyền cho vai trò, không cấp quyền mình không có",["RolePermissions","Roles","Permissions"],True)
E(ID,"GET","/guardian-links","guardians.link","STUDENT","Tài khoản phụ huynh liên kết với một đoàn sinh",["GuardianLinks","Users"])
E(ID,"POST","/guardian-links","guardians.link","STUDENT","Liên kết tài khoản phụ huynh với đoàn sinh",["GuardianLinks","Users","Students"],True)
E(ID,"DELETE","/guardian-links/{id}","guardians.link","STUDENT","Gỡ liên kết",["GuardianLinks"],True)
OR="Tổ chức"
E(OR,"GET","/branches","AUTHED","NONE","Danh sách ngành (dữ liệu tham chiếu)",["Branches"])
E(OR,"POST","/branches","org.manage","ALL","Thêm ngành",["Branches"],True)
E(OR,"PUT","/branches/{id}","org.manage","ALL","Sửa ngành",["Branches"],True)
E(OR,"GET","/class-levels","AUTHED","NONE","Danh sách cấp lớp",["ClassLevels"])
E(OR,"POST","/class-levels","org.manage","ALL","Thêm cấp lớp (đặt cấp kế tiếp)",["ClassLevels"],True)
E(OR,"PUT","/class-levels/{id}","org.manage","ALL","Sửa cấp lớp",["ClassLevels"],True)
E(OR,"GET","/academic-years","academic.view","ALL","Danh sách niên khóa",["AcademicYears"])
E(OR,"GET","/academic-years/active","academic.view","ALL","Niên khóa đang hoạt động",["AcademicYears"])
E(OR,"GET","/academic-years/{id}","academic.view","ALL","Chi tiết niên khóa",["AcademicYears"])
E(OR,"POST","/academic-years","academic.create","ALL","Tạo niên khóa (trạng thái Planned)",["AcademicYears"],True)
E(OR,"PUT","/academic-years/{id}","academic.update","ALL","Sửa tên, ngày (không sửa trạng thái)",["AcademicYears"],True)
E(OR,"DELETE","/academic-years/{id}","academic.delete","ALL","Xóa niên khóa Planned chưa có lớp",["AcademicYears","ClassRooms"],True)
E(OR,"POST","/academic-years/{id}/activate","academic.lifecycle","ALL","Planned sang Active",["AcademicYears"],True)
E(OR,"POST","/academic-years/{id}/close","academic.lifecycle","ALL","Active sang Closing: khóa sổ điểm",["AcademicYears"],True)
E(OR,"POST","/academic-years/{id}/archive","academic.lifecycle","ALL","Closing sang Archived khi hết đề xuất chưa xử lý",["AcademicYears","PromotionBatches"],True)
E(OR,"POST","/academic-years/{id}/reopen","academic.lifecycle","ALL","Closing sang Active, cần lý do",["AcademicYears"],True)
E(OR,"POST","/academic-years/{id}/clone-structure","academic.update","ALL","Sao chép cơ cấu lớp từ niên khóa khác (chạy lại không trùng)",["ClassRooms","AcademicYears"],True)
E(OR,"GET","/academic-years/{yearId}/classrooms","academic.view","CLASSROOM","Danh sách lớp trong phạm vi",["ClassRooms","ClassRoomTeachers","ClassLevels"])
E(OR,"POST","/academic-years/{yearId}/classrooms","academic.create","ALL","Tạo lớp",["ClassRooms"],True)
E(OR,"GET","/classrooms/{id}","academic.view","CLASSROOM","Chi tiết lớp",["ClassRooms","ClassRoomTeachers"])
E(OR,"PUT","/classrooms/{id}","academic.update","CLASSROOM","Sửa lớp",["ClassRooms"],True)
E(OR,"DELETE","/classrooms/{id}","academic.delete","CLASSROOM","Xóa mềm lớp chưa có ghi danh",["ClassRooms","Enrollments"],True)
E(OR,"PUT","/classrooms/{id}/teachers","classrooms.assign-teachers","CLASSROOM","Gán chủ nhiệm và phụ tá",["ClassRoomTeachers","Users"],True)
E(OR,"GET","/classrooms/{id}/roster","students.view","CLASSROOM","Danh sách đoàn sinh của lớp",["Enrollments","Students"])
E(OR,"GET","/families","students.view","CLASSROOM","Danh sách gia đình thiếu nhi",["Families"])
E(OR,"POST","/families","families.manage","CLASSROOM","Tạo gia đình thiếu nhi",["Families"],True)
E(OR,"PUT","/families/{id}","families.manage","CLASSROOM","Sửa gia đình",["Families"],True)
E(OR,"DELETE","/families/{id}","families.manage","CLASSROOM","Xóa mềm gia đình",["Families"],True)
E(OR,"PUT","/families/{id}/members","families.manage","CLASSROOM","Gán đoàn sinh vào gia đình",["Families","Students"],True)
S="Đoàn sinh"
E(S,"GET","/students","students.view","STUDENT","Danh sách phân trang, lọc ngành, lớp, trạng thái, tìm không dấu",["Students"],extra=["students.view-contact"],note="Trường liên hệ chỉ trả khi có quyền")
E(S,"GET","/students/{id}","students.view","STUDENT","Hồ sơ đoàn sinh (lọc trường theo quyền)",["Students","StudentGuardians","Guardians","StudentSacraments","Families"],extra=["students.view-contact","students.view-health"])
E(S,"POST","/students","students.create","STUDENT","Tạo đoàn sinh, kiểm tra trùng 3 mức, có thể xếp lớp ngay",["Students","Guardians","StudentGuardians","Enrollments"],True,note="Lớp xếp phải nằm trong phạm vi")
E(S,"PATCH","/students/{id}","students.update","STUDENT","Cập nhật từng phần (DTO), kiểm tra phiên bản dòng",["Students"],True)
E(S,"POST","/students/{id}/status","students.change-status","STUDENT","Đổi trạng thái kèm lý do (Left đóng ghi danh)",["Students","StudentStatusChanges","Enrollments"],True)
E(S,"DELETE","/students/{id}","students.delete","STUDENT","Xóa mềm",["Students"],True)
E(S,"POST","/students/{id}/restore","students.restore","STUDENT","Khôi phục",["Students"],True)
E(S,"POST","/students/{id}/photo","students.update","STUDENT","Tải ảnh đoàn sinh",["Students"],True,"upload")
E(S,"GET","/students/{id}/guardians","students.view-contact","STUDENT","Phụ huynh của đoàn sinh",["StudentGuardians","Guardians"])
E(S,"PUT","/students/{id}/guardians","students.update","STUDENT","Thay danh sách phụ huynh, dùng lại phụ huynh theo SĐT",["StudentGuardians","Guardians"],True)
E(S,"GET","/students/{id}/notes","students.view","STUDENT","Ghi chú (ghi chú riêng tư chỉ tác giả thấy)",["StudentNotes"])
E(S,"POST","/students/{id}/notes","students.notes.write","STUDENT","Thêm ghi chú",["StudentNotes"],True)
E(S,"DELETE","/student-notes/{noteId}","students.notes.write","SELF","Xóa mềm ghi chú của mình",["StudentNotes"],True)
E(S,"GET","/students/{id}/history","students.view","STUDENT","Lịch sử ghi danh và đổi trạng thái",["Enrollments","StudentStatusChanges"])
E(S,"POST","/students/duplicates/check","students.create","STUDENT","Kiểm tra trùng trước khi tạo",["Students","StudentGuardians","Guardians"])
E(S,"GET","/students/unassigned","students.view","STUDENT","Đoàn sinh chưa xếp lớp trong niên khóa",["Students","Enrollments"],note="Em chưa xếp lớp: vai trò phạm vi ngành hoặc lớp có enrollments.manage thấy thông tin cơ bản để nhận em vào lớp mình")
E(S,"GET","/students/stats","students.view","STUDENT","Thống kê theo ngành, lớp, trạng thái",["Students","Enrollments"])
E(S,"GET","/students/export","students.export","STUDENT","Xuất Excel theo phạm vi và quyền trường, chống chèn công thức",["Students"],True,"export",extra=["students.view-contact","students.view-health"])
E(S,"GET","/imports/students/template","students.import","ALL","Tải file mẫu, cùng nguồn cột với bộ đọc",[])
E(S,"POST","/imports/students","students.import","STUDENT","Tải file và chạy thử, trả báo cáo từng dòng (chưa ghi)",["ImportJobs"],True,"upload")
E(S,"GET","/imports/{id}","students.import","SELF","Xem báo cáo lượt nhập",["ImportJobs"])
E(S,"POST","/imports/{id}/apply","students.import","SELF","Áp dụng các dòng hợp lệ trong một transaction",["ImportJobs","Students","Guardians","StudentGuardians","Enrollments"],True)
E(S,"POST","/imports/{id}/cancel","students.import","SELF","Hủy lượt nhập",["ImportJobs"],True)
E(S,"GET","/students/{id}/sacraments","sacraments.view","STUDENT","Bí tích đã lãnh",["StudentSacraments"])
E(S,"PUT","/students/{id}/sacraments/{type}","sacraments.update","STUDENT","Ghi hoặc sửa bí tích, kiểm tra thứ tự thời gian",["StudentSacraments"],True)
E(S,"DELETE","/students/{id}/sacraments/{type}","sacraments.update","STUDENT","Xóa ghi nhận nhầm (không được nếu đã có chứng chỉ hiệu lực)",["StudentSacraments","Certificates"],True)
E(S,"GET","/sacrament-requirements","sacraments.view","ALL","Yêu cầu chuẩn bị bí tích",["SacramentRequirements"])
E(S,"POST","/sacrament-requirements","sacraments.manage-requirements","ALL","Thêm yêu cầu",["SacramentRequirements"],True)
E(S,"PUT","/sacrament-requirements/{id}","sacraments.manage-requirements","ALL","Sửa yêu cầu",["SacramentRequirements"],True)
E(S,"GET","/students/{id}/requirement-progress","sacraments.view","STUDENT","Tiến độ chuẩn bị",["StudentRequirementProgress","SacramentRequirements"])
E(S,"PUT","/students/{id}/requirement-progress/{requirementId}","sacraments.update","STUDENT","Cập nhật tiến độ",["StudentRequirementProgress"],True)
EN="Ghi danh và lên lớp"
E(EN,"GET","/classrooms/{id}/enrollments","enrollments.view","CLASSROOM","Ghi danh của lớp",["Enrollments","Students"])
E(EN,"POST","/classrooms/{id}/enrollments","enrollments.manage","CLASSROOM","Xếp đoàn sinh vào lớp (một lớp đang học mỗi năm)",["Enrollments","Students"],True)
E(EN,"POST","/enrollments/{id}/transfer","enrollments.manage","CLASSROOM","Chuyển lớp trong cùng niên khóa, cả hai lớp phải trong phạm vi",["Enrollments"],True)
E(EN,"POST","/enrollments/{id}/withdraw","enrollments.manage","CLASSROOM","Rút khỏi lớp (DropOut), giữ lịch sử",["Enrollments"],True)
E(EN,"GET","/students/{id}/enrollments","enrollments.view","STUDENT","Các ghi danh của đoàn sinh",["Enrollments"])
E(EN,"GET","/promotion-batches","promotion.view","CLASSROOM","Danh sách đợt xét lên lớp",["PromotionBatches"])
E(EN,"POST","/promotion-batches","promotion.create","ALL","Tạo đợt: sinh đề xuất cho mọi em đang học (chạy lại không trùng)",["PromotionBatches","PromotionDrafts","Enrollments","Grades","ClassLevels","ClassRooms"],True)
E(EN,"GET","/promotion-batches/{id}","promotion.view","CLASSROOM","Chi tiết và tổng hợp đợt",["PromotionBatches"])
E(EN,"GET","/promotion-batches/{id}/drafts","promotion.view","CLASSROOM","Đề xuất trong phạm vi",["PromotionDrafts","Students"])
E(EN,"POST","/promotion-drafts/{id}/approve","promotion.decide","CLASSROOM","Duyệt, tính lại điểm, báo Stale nếu đã đổi",["PromotionDrafts","Grades"],True)
E(EN,"POST","/promotion-drafts/{id}/reject","promotion.decide","CLASSROOM","Từ chối (chỉ khi Pending)",["PromotionDrafts"],True)
E(EN,"PUT","/promotion-drafts/{id}/target-class","promotion.decide","CLASSROOM","Chọn lớp đích thủ công",["PromotionDrafts","ClassRooms"],True)
E(EN,"POST","/promotion-batches/{id}/approve-qualified","promotion.decide","CLASSROOM","Duyệt hàng loạt các em đủ điều kiện và đã có lớp đích",["PromotionDrafts"],True)
E(EN,"POST","/promotion-batches/{id}/apply","promotion.apply","ALL","Áp dụng: tạo ghi danh mới, cập nhật ghi danh cũ, trong transaction",["PromotionBatches","PromotionDrafts","Enrollments"],True)
E(EN,"POST","/promotion-batches/{id}/cancel","promotion.create","ALL","Hủy đợt chưa áp dụng",["PromotionBatches","PromotionDrafts"],True)
G="Điểm số"
E(G,"GET","/classrooms/{id}/grades","grades.view","CLASSROOM","Bảng điểm lớp kèm GPA và trạng thái tính sẵn",["Grades","Enrollments"])
E(G,"PUT","/classrooms/{id}/grades","grades.update","CLASSROOM","Lưu điểm hàng loạt: kiểm tra khóa sổ, 0 đến 10, thuộc lớp, phiên bản dòng",["Grades","Enrollments","AcademicYears","GradeUnlocks"],True)
E(G,"GET","/enrollments/{id}/grade","grades.view","CLASSROOM","Điểm của một ghi danh",["Grades"])
E(G,"POST","/classrooms/{id}/grade-unlocks","grades.unlock","CLASSROOM","Mở khóa sổ điểm lớp có lý do và hạn",["GradeUnlocks"],True)
E(G,"GET","/classrooms/{id}/grade-unlocks","grades.view","CLASSROOM","Lịch sử mở khóa",["GradeUnlocks"])
E(G,"GET","/classrooms/{id}/grades/export","grades.export","CLASSROOM","Xuất bảng điểm",["Grades"],True,"export")
C="Chứng chỉ"
E(C,"GET","/students/{id}/certificates","certificates.view","STUDENT","Chứng chỉ của đoàn sinh",["Certificates"])
E(C,"POST","/students/{id}/certificates","certificates.issue","STUDENT","Cấp chứng chỉ từ bí tích đã ghi, lưu ảnh chụp, mã 12 ký tự",["Certificates","StudentSacraments"],True)
E(C,"POST","/certificates/{id}/revoke","certificates.revoke","STUDENT","Thu hồi kèm lý do (không xóa)",["Certificates"],True)
E(C,"GET","/certificates/{id}/pdf","certificates.view","STUDENT","Tải PDF từ ảnh chụp",["Certificates"])
E(C,"GET","/public/certificates/verify","PUBLIC","NONE","Xác thực theo mã: tên đã che, loại, ngày bí tích, giáo xứ, trạng thái",["Certificates"],False,"verify")
E(C,"GET","/public/certificates/pdf","PUBLIC","NONE","Người giữ mã tải PDF bằng mã xác thực",["Certificates"],False,"verify")
A="Hoạt động"
E(A,"GET","/camps","camps.view","BRANCH","Danh sách sự kiện theo ngành",["CampEvents"])
E(A,"POST","/camps","camps.manage","BRANCH","Tạo sự kiện",["CampEvents"],True)
E(A,"PUT","/camps/{id}","camps.manage","BRANCH","Sửa sự kiện",["CampEvents"],True)
E(A,"DELETE","/camps/{id}","camps.manage","BRANCH","Xóa mềm sự kiện chưa có thu phí",["CampEvents","CampPayments"],True)
E(A,"GET","/camps/{id}/registrations","camps.view","BRANCH","Đăng ký của sự kiện, kèm đã thu và còn thiếu",["CampRegistrations","Students","CampPayments"])
E(A,"POST","/camps/{id}/registrations","camps.register","STUDENT","Đăng ký đoàn sinh (không phải điểm danh)",["CampRegistrations"],True)
E(A,"PUT","/camps/{id}/registrations/{registrationId}","camps.register","STUDENT","Sửa tổ, ghi chú",["CampRegistrations"],True)
E(A,"DELETE","/camps/{id}/registrations/{registrationId}","camps.register","STUDENT","Hủy đăng ký",["CampRegistrations"],True)
E(A,"POST","/camps/registrations/{registrationId}/payments","camps.collect","BRANCH","Ghi một lần thu",["CampPayments","CampRegistrations"],True)
E(A,"POST","/camps/payments/{id}/reverse","camps.collect","BRANCH","Hoàn hoặc điều chỉnh bằng dòng âm",["CampPayments"],True)
E(A,"GET","/camps/{id}/finance","camps.collect","BRANCH","Tổng thu, còn thiếu",["CampPayments","CampRegistrations"])
E(A,"GET","/duty-assignments","duty.view","CLASSROOM","Phân công trực theo khoảng ngày",["DutyAssignments"])
E(A,"POST","/duty-assignments","duty.manage","CLASSROOM","Thêm phân công",["DutyAssignments"],True)
E(A,"PUT","/duty-assignments/{id}","duty.manage","CLASSROOM","Sửa phân công",["DutyAssignments"],True)
E(A,"DELETE","/duty-assignments/{id}","duty.manage","CLASSROOM","Xóa phân công",["DutyAssignments"],True)
E(A,"GET","/lesson-plans","lessonplans.view","CLASSROOM","Giáo án theo phạm vi hiển thị",["LessonPlans"])
E(A,"GET","/lesson-plans/{id}","lessonplans.view","CLASSROOM","Chi tiết giáo án",["LessonPlans"])
E(A,"POST","/lesson-plans","lessonplans.manage","CLASSROOM","Tạo giáo án, lọc HTML khi lưu",["LessonPlans"],True)
E(A,"PUT","/lesson-plans/{id}","lessonplans.manage","SELF","Sửa giáo án của mình",["LessonPlans"],True,extra=["lessonplans.manage-all"])
E(A,"DELETE","/lesson-plans/{id}","lessonplans.manage","SELF","Xóa mềm giáo án của mình",["LessonPlans"],True,extra=["lessonplans.manage-all"])
E(A,"GET","/classrooms/{id}/bouquets","bouquets.view","CLASSROOM","Sổ hoa thiêng của lớp",["SpiritualBouquets","Enrollments"])
E(A,"POST","/classrooms/{id}/bouquets","bouquets.give","CLASSROOM","Ghi hoa thiêng (tối đa theo cấu hình mỗi lần)",["SpiritualBouquets"],True)
E(A,"POST","/bouquets/{id}/reverse","bouquets.manage","CLASSROOM","Đảo một dòng ghi nhầm",["SpiritualBouquets"],True)
E(A,"GET","/classrooms/{id}/bouquets/leaderboard","bouquets.view","CLASSROOM","Bảng xếp hạng trong lớp",["SpiritualBouquets"])
N="Nội dung"
E(N,"GET","/public/announcements","PUBLIC","NONE","Thông báo công khai",["Announcements"],False,"public")
E(N,"GET","/announcements","announcements.view","CLASSROOM","Thông báo dành cho mình (theo đối tượng)",["Announcements"])
E(N,"POST","/announcements","announcements.create","CLASSROOM","Đăng thông báo, đối tượng trong phạm vi, lọc HTML",["Announcements"],True)
E(N,"PUT","/announcements/{id}","announcements.update","CLASSROOM","Sửa thông báo",["Announcements"],True)
E(N,"DELETE","/announcements/{id}","announcements.delete","CLASSROOM","Xóa mềm thông báo",["Announcements"],True)
E(N,"GET","/public/banners","PUBLIC","NONE","Banner đang bật",["Banners"],False,"public")
E(N,"POST","/banners","banners.manage","ALL","Thêm banner",["Banners"],True)
E(N,"PUT","/banners/{id}","banners.manage","ALL","Sửa banner",["Banners"],True)
E(N,"DELETE","/banners/{id}","banners.manage","ALL","Xóa mềm banner",["Banners"],True)
E(N,"GET","/public/documents","PUBLIC","NONE","Tài liệu công khai (AccessLevel Public)",["Documents"],False,"public")
E(N,"GET","/public/documents/{id}/download","PUBLIC","NONE","Tải tài liệu công khai",["Documents"],False,"public")
E(N,"GET","/documents","documents.view","BRANCH","Tài liệu nội bộ theo ngành",["Documents"])
E(N,"GET","/documents/{id}/download","documents.view","BRANCH","Tải tài liệu nội bộ",["Documents"])
E(N,"POST","/documents","documents.create","BRANCH","Tải tài liệu lên (kiểm tra loại tệp, dung lượng, băm)",["Documents"],True,"upload")
E(N,"PUT","/documents/{id}","documents.update","BRANCH","Sửa thông tin tài liệu",["Documents"],True)
E(N,"DELETE","/documents/{id}","documents.delete","BRANCH","Xóa mềm tài liệu",["Documents"],True)
E(N,"GET","/public/leaders","PUBLIC","NONE","Ban huynh trưởng (không có SĐT, địa chỉ)",["Leaders"],False,"public")
E(N,"GET","/leaders","leaders.view","ALL","Danh sách huynh trưởng quản trị",["Leaders"])
E(N,"POST","/leaders","leaders.create","ALL","Thêm huynh trưởng",["Leaders"],True)
E(N,"PUT","/leaders/{id}","leaders.update","ALL","Sửa huynh trưởng",["Leaders"],True)
E(N,"DELETE","/leaders/{id}","leaders.delete","ALL","Xóa mềm huynh trưởng",["Leaders"],True)
E(N,"GET","/public/news","PUBLIC","NONE","Tin tức công khai",["NewsArticles","NewsSources"],False,"public")
E(N,"GET","/public/news/image","PUBLIC","NONE","Proxy ảnh an toàn: chặn địa chỉ nội bộ, giới hạn dung lượng, danh sách tên miền",[],False,"public")
E(N,"GET","/news/sources","news.view","ALL","Nguồn tin",["NewsSources"])
E(N,"POST","/news/sources","news.create","ALL","Thêm nguồn tin",["NewsSources"],True)
E(N,"PUT","/news/sources/{id}","news.update","ALL","Sửa nguồn tin",["NewsSources"],True)
E(N,"DELETE","/news/sources/{id}","news.delete","ALL","Xóa nguồn tin",["NewsSources","NewsArticles"],True)
E(N,"PUT","/news/articles/{id}","news.update","ALL","Ẩn hoặc hiện bài",["NewsArticles"],True)
E(N,"GET","/public/liturgical/today","PUBLIC","NONE","Phụng vụ hôm nay (giờ Việt Nam)",["LiturgicalEvents"],False,"public")
E(N,"GET","/public/liturgical/date/{date}","PUBLIC","NONE","Phụng vụ theo ngày",["LiturgicalEvents"],False,"public")
E(N,"GET","/public/liturgical/month/{year}/{month}","PUBLIC","NONE","Lịch tháng",["LiturgicalEvents"],False,"public")
E(N,"GET","/liturgical","liturgical.view","ALL","Danh sách mục phụng vụ quản trị",["LiturgicalEvents"])
E(N,"PUT","/liturgical/{date}","liturgical.update","ALL","Ghi đè phụng vụ một ngày",["LiturgicalEvents"],True)
E(N,"GET","/public/stats","PUBLIC","NONE","Số liệu tổng hợp công khai (không theo lớp hay đoàn sinh)",["Students","Enrollments"],False,"public")
R="Báo cáo"
E(R,"GET","/reports/dashboard","reports.view","STUDENT","Tổng quan theo phạm vi",["Students","Enrollments","Grades"])
E(R,"GET","/reports/students-by-branch","reports.view","STUDENT","Số đoàn sinh theo ngành, lớp, trạng thái",["Students","Enrollments"])
E(R,"GET","/reports/missing-data","reports.view","STUDENT","Hồ sơ còn thiếu (SĐT, bí tích theo cấp lớp)",["Students","StudentSacraments","StudentGuardians"])
E(R,"GET","/reports/promotion-summary","reports.view","CLASSROOM","Tổng hợp kết quả xét lên lớp",["PromotionDrafts"])
E(R,"GET","/reports/grades-summary","reports.view","CLASSROOM","Điểm trung bình theo lớp, em dưới ngưỡng",["Grades"])
E(R,"POST","/reports/export","reports.export","STUDENT","Xuất báo cáo",["Students","Enrollments","Grades"],True,"export")
PT="Cổng phụ huynh"
E(PT,"GET","/portal/children","portal.children.view","GUARDIAN","Danh sách con của mình",["GuardianLinks","Students"])
E(PT,"GET","/portal/children/{id}","portal.children.view","GUARDIAN","Hồ sơ rút gọn của con (không lộ ghi chú nội bộ)",["Students","StudentSacraments","Enrollments"])
E(PT,"GET","/portal/children/{id}/grades","portal.children.view","GUARDIAN","Điểm của con",["Grades","Enrollments"])
E(PT,"GET","/portal/children/{id}/certificates","portal.children.view","GUARDIAN","Chứng chỉ của con",["Certificates"])
E(PT,"GET","/portal/children/{id}/certificates/{certificateId}/pdf","portal.children.view","GUARDIAN","Tải PDF chứng chỉ của con",["Certificates"])
E(PT,"GET","/portal/announcements","portal.children.view","GUARDIAN","Thông báo dành cho phụ huynh",["Announcements"])
PL="Nền tảng"
E(PL,"GET","/audit-logs","audit.view","ALL","Nhật ký kiểm toán (lọc theo đối tượng, người, thời gian)",["AuditLogs"])
E(PL,"GET","/system/settings","settings.view","ALL","Cấu hình nghiệp vụ",["SystemSettings"])
E(PL,"PUT","/system/settings/{key}","settings.manage","ALL","Sửa một cấu hình, kiểm tra kiểu và khoảng",["SystemSettings"],True)
E(PL,"GET","/system/jobs","jobs.view","ALL","Lịch sử tác vụ nền",["BackgroundJobRuns"])
E(PL,"POST","/system/jobs/{name}/run","jobs.run","ALL","Chạy một tác vụ (người dùng có quyền hoặc khóa dịch vụ của bộ hẹn giờ ngoài)",["BackgroundJobRuns"],True,note="Xác thực bằng X-Service-Key hoặc người dùng có quyền")
E(PL,"GET","/health","PUBLIC","NONE","Còn sống (không lộ chi tiết)",[],False,"public")
E(PL,"GET","/health/ready","PUBLIC","NONE","Sẵn sàng: kiểm tra kết nối database",[],False,"public")
SETTINGS=[("Promotion.MinGpa","5.0","Điểm trung bình tối thiểu để lên lớp"),("Promotion.MinAttendancePercent","80","Chuyên cần tối thiểu (%)"),
 ("Promotion.RequireAttendance","true","Có xét chuyên cần khi lên lớp"),("Promotion.RequireFinalExam","true","Bắt buộc có điểm thi kết khóa"),
 ("Grades.UnlockHours","72","Thời hạn mặc định của một lần mở khóa sổ điểm (giờ)"),("Bouquet.MaxPointsPerEntry","10","Hoa thiêng tối đa mỗi lần ghi (admin không giới hạn)"),
 ("Security.PasswordMinLength","10","Độ dài mật khẩu tối thiểu"),("Security.LockoutThreshold","5","Số lần đăng nhập sai trước khi khóa tạm"),
 ("Security.LockoutMinutes","15","Thời gian khóa tạm (phút)"),("Security.AccessTokenMinutes","20","Thời hạn access token (phút)"),
 ("Security.RefreshTokenDays","7","Thời hạn refresh token (ngày)"),("Students.DuplicateBlockLevel","Exact","Mức trùng bị chặn: Exact, Probable"),
 ("Import.MaxRows","2000","Số dòng tối đa mỗi lần nhập"),("Upload.MaxDocumentMB","20","Dung lượng tối đa tài liệu (MB)"),("Upload.MaxImageMB","2","Dung lượng tối đa ảnh (MB)")]
ERRORS=[("AUTH_INVALID_CREDENTIALS",401,"Sai tài khoản hoặc mật khẩu (không phân biệt hai trường hợp)"),("AUTH_LOCKED",423,"Tài khoản bị khóa tạm do đăng nhập sai nhiều lần"),
 ("AUTH_TOKEN_REVOKED",401,"Phiên đăng nhập không còn hiệu lực"),("AUTH_MUST_CHANGE_PASSWORD",403,"Phải đổi mật khẩu trước khi dùng chức năng khác"),("AUTH_PASSWORD_WEAK",400,"Mật khẩu không đạt chính sách"),
 ("FORBIDDEN",403,"Thiếu quyền cho thao tác (đối tượng nằm trong phạm vi)"),("NOT_FOUND",404,"Không tìm thấy, gồm cả đối tượng ngoài phạm vi"),("VALIDATION_FAILED",400,"Dữ liệu không hợp lệ, kèm danh sách lỗi từng trường"),
 ("CONFLICT_VERSION",409,"Dữ liệu đã bị người khác sửa, tải lại"),("CONFLICT_DUPLICATE",409,"Trùng dữ liệu (đoàn sinh, mã, biên lai)"),("YEAR_LOCKED",409,"Niên khóa đã khóa sổ điểm"),
 ("YEAR_INVALID_TRANSITION",409,"Chuyển trạng thái niên khóa không hợp lệ"),("ENROLLMENT_EXISTS",409,"Đoàn sinh đã có lớp đang học trong niên khóa"),("PROMOTION_STALE",409,"Điểm đã đổi sau khi tạo đề xuất"),
 ("PROMOTION_NO_TARGET",422,"Niên khóa đích chưa có lớp phù hợp"),("CERT_ALREADY_ISSUED",409,"Đã có chứng chỉ hiệu lực cho loại bí tích này"),("CERT_REVOKED",410,"Chứng chỉ đã bị thu hồi"),
 ("IMPORT_HAS_ERRORS",422,"Lượt nhập còn dòng lỗi"),("PRIVILEGE_ESCALATION",403,"Không được cấp hoặc gán quá quyền của chính mình"),("LAST_ADMIN",409,"Phải còn ít nhất một quản trị viên"),
 ("RATE_LIMITED",429,"Vượt giới hạn tần suất"),("UPLOAD_INVALID",400,"Tệp tải lên không hợp lệ (loại, dung lượng, nội dung)"),("URL_BLOCKED",400,"Địa chỉ không được phép (địa chỉ nội bộ, cổng lạ)")]
JOBS=[("GradebookCloser","Mỗi ngày 01:00 giờ Việt Nam","Chuyển niên khóa Active đã quá EndDate sang Closing (khóa sổ điểm); không tự lưu trữ","jobs.run hoặc khóa dịch vụ"),
 ("NewsCrawler","Mỗi 6 giờ","Cào RSS, chống trùng bằng LinkHash, giới hạn số bài mỗi nguồn","jobs.run hoặc khóa dịch vụ"),
 ("TokenCleanup","Mỗi ngày","Xóa refresh token hết hạn quá 30 ngày","nội bộ"),("GradeUnlockExpiry","Mỗi giờ","Đóng các lần mở khóa sổ điểm đã hết hạn","nội bộ"),
 ("AuditRetention","Mỗi tuần","Lưu trữ nhật ký kiểm toán quá hạn giữ (đề xuất 24 tháng) ra tệp nén","jobs.run")]
