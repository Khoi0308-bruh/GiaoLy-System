// Sinh tự động từ bảng mã lỗi của backend. Thông điệp viết cho người dùng, không dùng thuật ngữ kỹ thuật.
export const ERROR_MESSAGES: Record<string, string> = {
  AUTH_INVALID_CREDENTIALS: "Tên đăng nhập hoặc mật khẩu chưa đúng.",
  AUTH_LOCKED: "Tài khoản tạm khóa do nhập sai nhiều lần. Vui lòng thử lại sau ít phút.",
  AUTH_TOKEN_REVOKED: "Phiên đăng nhập đã hết hiệu lực. Vui lòng đăng nhập lại.",
  AUTH_MUST_CHANGE_PASSWORD: "Bạn cần đổi mật khẩu trước khi tiếp tục.",
  AUTH_PASSWORD_WEAK: "Mật khẩu chưa đạt yêu cầu: tối thiểu 10 ký tự, không chứa tên đăng nhập, không quá phổ biến.",
  FORBIDDEN: "Bạn chưa có quyền thực hiện thao tác này.",
  NOT_FOUND: "Không tìm thấy nội dung này, hoặc nằm ngoài phạm vi của bạn.",
  VALIDATION_FAILED: "Thông tin chưa hợp lệ. Vui lòng kiểm tra các ô được đánh dấu.",
  CONFLICT_VERSION: "Dữ liệu vừa được người khác thay đổi. Vui lòng tải lại trước khi sửa.",
  CONFLICT_DUPLICATE: "Thông tin này đã tồn tại.",
  YEAR_LOCKED: "Niên khóa đã khóa sổ điểm. Liên hệ Ban điều hành nếu cần mở khóa.",
  YEAR_INVALID_TRANSITION: "Chưa thể chuyển niên khóa sang trạng thái này.",
  ENROLLMENT_EXISTS: "Đoàn sinh đã có lớp đang học trong niên khóa này.",
  PROMOTION_STALE: "Điểm đã thay đổi sau khi tạo đề xuất. Cần tính lại.",
  PROMOTION_NO_TARGET: "Niên khóa mới chưa có lớp phù hợp. Hãy nhân bản cơ cấu lớp trước.",
  CERT_ALREADY_ISSUED: "Đoàn sinh đã có chứng chỉ còn hiệu lực cho bí tích này.",
  CERT_REVOKED: "Chứng chỉ này đã bị thu hồi.",
  IMPORT_HAS_ERRORS: "Tệp nhập còn dòng lỗi. Hãy xem báo cáo từng dòng.",
  PRIVILEGE_ESCALATION: "Không thể cấp hoặc gán quyền vượt quá quyền của chính bạn.",
  LAST_ADMIN: "Phải còn ít nhất một quản trị viên đang hoạt động.",
  RATE_LIMITED: "Bạn thao tác quá nhanh. Vui lòng chờ giây lát rồi thử lại.",
  UPLOAD_INVALID: "Tệp tải lên không hợp lệ (loại tệp, dung lượng hoặc nội dung).",
  URL_BLOCKED: "Địa chỉ này không được phép.",
}

export const DEFAULT_ERROR = 'Đã có lỗi xảy ra. Vui lòng thử lại.'
