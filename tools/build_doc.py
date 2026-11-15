import sys,os,collections
sys.dont_write_bytecode=True
import fe_model as M, model_api as MA
URL="https://claude.ai/artifact/PgTjvn12uLC5zY57a4hnL2"
def lum(h):
    h=h.lstrip('#');r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c:c/12.92 if c<=.03928 else ((c+.055)/1.055)**2.4
    return .2126*f(r)+.7152*f(g)+.0722*f(b)
def cr(a,b):
    la,lb=lum(a),lum(b);hi,lo=max(la,lb),min(la,lb);return (hi+.05)/(lo+.05)
def mdt(h,rows):
    s="| "+" | ".join(h)+" |\n|"+"|".join("---" for _ in h)+"|\n"
    for r in rows: s+="| "+" | ".join(str(x).replace("|","\\|").replace("\n"," ") for x in r)+" |\n"
    return s
CP=[("Chữ chính trên nền ngà","#1E2434","#F6F2E9"),("Chữ chính trên thẻ","#1E2434","#FFFEFA"),("Chữ phụ trên thẻ","#5F6677","#FFFEFA"),("Chữ phụ trên nền ngà","#5F6677","#F6F2E9"),
("Nút chính (chữ trắng)","#FFFFFF","#1D3A73"),("Nút chính khi rê chuột","#FFFFFF","#2C4F96"),("Nút vàng (chữ nâu đen)","#2A1E06","#D6B25A"),("Nút phụ của khung giao diện (chữ trắng)","#FFFFFF","#876520"),
("Chữ vàng đậm trên thẻ","#7A5C17","#FFFEFA"),("Chữ vàng đậm trên nền vàng nhạt","#7A5C17","#F1E6C2"),("Nhãn thành công","#2F6B4F","#FFFEFA"),("Nhãn cảnh báo","#8A5412","#FFFEFA"),("Nhãn lỗi","#8E2430","#FFFEFA"),("Nhãn chính","#1D3A73","#FFFEFA"),
("Thanh bên: chữ mục","#E7E1D0","#13264E"),("Thanh bên: nhãn nhóm vàng","#D6B25A","#13264E"),("Dải phụng vụ: xanh","#FFFFFF","#2F6B4F"),("Dải phụng vụ: tím","#FFFFFF","#5B3A7A"),("Dải phụng vụ: trắng và vàng","#3A2D0A","#F1E6C2"),("Dải phụng vụ: đỏ","#FFFFFF","#9B2335"),("Dải phụng vụ: hồng","#FFFFFF","#A24F65"),
("Chế độ tối: chữ chính","#EDEBE4","#0F1524"),("Chế độ tối: chữ phụ trên thẻ","#A5ABBB","#172038"),("Chế độ tối: màu chính","#8FB0F0","#172038"),("Chế độ tối: vàng","#D6B25A","#172038"),("Chế độ tối: thành công","#6CC49B","#172038"),("Chế độ tối: cảnh báo","#E0A24E","#172038"),("Chế độ tối: lỗi","#E58C95","#172038")]
bad=[n for n,a,b in CP if cr(a,b)<4.5]
assert not bad,bad
SZ={'S':(0.5,1),'M':(2,4),'L':(5,10),'XL':(10,18)}
PK=[("F0","Nền tảng kỹ thuật","Nuxt layer dùng chung (token, thành phần, client API, phiên đăng nhập, phân quyền, mã lỗi); sinh kiểu từ OpenAPI của backend; thiết lập Vitest, Playwright, kiểm tra trợ năng và CI","—","Hai ứng dụng dựng được từ layer; một trang mẫu qua đủ đăng nhập, quyền, lỗi","L"),
("F1","Khung và thư viện thành phần","AppShell, điều hướng theo quyền, dải phụng vụ, nhãn phạm vi, PageHeader, bảng, biểu mẫu, hộp thoại, trạng thái rỗng và lỗi, trang `/dev/thanh-phan` hiển thị mọi thành phần ở sáng và tối","F0","Mọi thành phần có ví dụ; kiểm tra tương phản tự động đạt","L"),
("F2","Danh tính","Đăng nhập, làm mới phiên, đổi mật khẩu lần đầu, hồ sơ cá nhân, xử lý 401, 423, 429","F0, backend P1","Khóa tạm hiện đúng thời gian; hết phiên về trang đăng nhập và quay lại đúng trang","M"),
("F3","Đoàn sinh","Danh sách, thêm (kiểm tra trùng khi nhập), hồ sơ 7 tab, đổi trạng thái, ghi chú, phụ huynh, bí tích, chứng chỉ, liên kết tài khoản phụ huynh","F1, F2, backend P3, P5, P8","Mọi nút theo quyền; trường nhạy cảm che đúng; ngoài phạm vi báo không tìm thấy","XL"),
("F4","Nhập và xuất Excel","Trình hướng dẫn bốn bước, báo cáo từng dòng, xuất an toàn, tải mẫu","F3, backend P4","Dòng lỗi báo rõ cột và lý do; chỉ áp dụng dòng hợp lệ","M"),
("F5","Tổ chức và lớp","Niên khóa và vòng đời, lớp, giáo lý viên chủ nhiệm và phụ tá, ngành và cấp lớp, gia đình thiếu nhi, nhân bản cơ cấu lớp","F1, backend P2","Nút chuyển trạng thái chỉ hiện bước hợp lệ kế tiếp","L"),
("F6","Sổ điểm và hoa thiêng","Bảng điểm cả lớp, khóa sổ và mở khóa, xung đột phiên bản, hoa thiêng và xếp hạng lớp","F5, backend P6, P9","Ô trống khác 0; khóa sổ chặn sửa đúng; xung đột liệt kê dòng","L"),
("F7","Xét lên lớp","Đợt xét, bảng đề xuất, Stale, chọn lớp đích, duyệt hàng loạt, áp dụng","F6, backend P7","Áp dụng chỉ bật khi hết đề xuất chờ; Stale buộc xem lại","L"),
("F8","Hoạt động","Sự kiện và đăng ký, thu phí và hoàn phí theo sổ cái, trực lớp, giáo án","F5, backend P9","Đã thu và còn thiếu khớp sổ cái; không có điểm danh","L"),
("F9","Truyền thông và trang công khai","Thông báo theo đối tượng, tài liệu, huynh trưởng, banner, tin tức, phụng vụ; trang công khai dựng sẵn phía máy chủ, xác thực chứng chỉ","F1, backend P10","Trang công khai không lộ dữ liệu cá nhân; điểm Lighthouse đạt chỉ tiêu","L"),
("F10","Hệ thống","Người dùng, vai trò và cây quyền, nhật ký kiểm toán, cấu hình, tác vụ nền, báo cáo","F1, backend P1, P11","Ô quyền không có bị khóa kèm lý do; mật khẩu tạm chỉ hiện một lần","L"),
("F11","Cổng phụ huynh","Các con của tôi, hồ sơ rút gọn, điểm, chứng chỉ, thông báo","F2, backend P12","Chỉ thấy con mình; thử đổi mã sang em khác báo không tìm thấy","M"),
("F12","Kiểm thử, trợ năng, hiệu năng, bàn giao","Kiểm thử hiển thị theo vai trò (sinh từ `screens.json`), E2E các luồng chính, axe, ảnh chụp so sánh, tài liệu và hướng dẫn sử dụng cho giáo lý viên","F0 đến F11","Các tiêu chí ở mục 8 đạt","L")]
lo=sum(SZ[p[5]][0] for p in PK);hi=sum(SZ[p[5]][1] for p in PK)
adm=[s for s in M.SCREENS if s['area']=='admin'];pub=[s for s in M.SCREENS if s['area']=='portal'];gd=[s for s in M.SCREENS if s['area']=='guardian']
def map_table(ss):
    return mdt(["Đường dẫn","Màn hình","Quyền xem","Số endpoint","Nút theo quyền"],[(f"`{s['route']}`",s['title'],("công khai" if s['perm']=='PUBLIC' else "đăng nhập" if s['perm']=='AUTHED' else f"`{s['perm']}`"),len(s['eps']),"; ".join(f"{a} (`{p}`)" for a,p in s['actions']) or "–") for s in ss])
n_eps=len({(m,p) for s in M.SCREENS for m,p in s['eps']})
doc=f"""# Thiết kế lại giao diện GiaoLy V3: trang nghiêm, gọn gàng, hợp với đời sống Công giáo

**Bản xem trước tương tác (dữ liệu minh họa):** {URL}

Tài liệu này mô tả giao diện mới cho cả hai ứng dụng (quản trị và cổng thông tin kèm cổng phụ huynh) sao cho **đáp ứng đúng những gì backend V3 đã có**: mỗi endpoint của backend đều có màn hình dùng nó, mỗi quyền đều có nút hoặc màn hình tương ứng. Mọi con số về độ phủ bên dưới được sinh từ mô hình và kiểm tra tự động, không ghi tay.

## 0. Tóm tắt

- **Giữ nền tảng hiện có** (Nuxt 4, Nuxt UI 4, Tailwind 4, Pinia) và **giữ bản sắc Marian Blue và Vatican Gold** mà bạn đã chọn, nhưng làm sâu hơn: nền ngà ấm, chữ tiêu đề kiểu chữ có chân (Cormorant Garamond), đường kẻ vàng với dấu thánh giá nhỏ, khung vòm gothic cho ảnh đại diện, **dải màu phụng vụ thay đổi theo ngày** lấy từ lịch phụng vụ của hệ thống.
- **Một bộ thành phần dùng chung** (Nuxt layer) cho hai ứng dụng, thay cho các trang dài hàng nghìn dòng hiện nay.
- **Giao diện biết quyền và biết phạm vi:** menu và nút chỉ hiện khi có quyền; ô nhạy cảm được che kèm lý do; luôn có nhãn "Phạm vi dữ liệu" cho trưởng ngành và giáo lý viên.
- **Phủ backend:** {len(M.SCREENS)} màn hình dùng {n_eps} trong 188 endpoint; 2 endpoint còn lại là kiểm tra sức khỏe dành cho giám sát, không có giao diện.
- **Trợ năng:** toàn bộ {len(CP)} cặp màu chính được kiểm tra đạt tỷ lệ tương phản AA (từ 4.5:1) ở cả chế độ sáng và tối.
- **Kèm theo:** bản xem trước tương tác, bộ mã nền (`layer/`: token, khung, 10 thành phần, kho phiên, client API, 4 trang mẫu), danh mục màn hình (`screens.json`) và bộ kiểm tra độ phủ.

## 1. Hiện trạng frontend (đọc từ mã bạn gửi)

| Quan sát | Hệ quả |
|---|---|
| Hai ứng dụng Nuxt 4, Nuxt UI 4, Tailwind 4, Pinia, VueUse, zod; bảng màu Marian Blue và Vatican Gold trên nền ngà; chữ Inter và Merriweather | Nền tảng tốt, nên giữ và nâng cấp |
| Một số trang rất dài (có trang hơn 1.000 dòng, ví dụ trang lớp học) | Khó bảo trì và kiểm thử; cần tách thành thành phần |
| Các trang giáo lý viên (trại, trực lớp, giáo án, bí tích, hoa thiêng) mới là khung "đang được tích hợp" | Backend V3 đã có đủ; cần dựng thật |
| Quyền kiểm tra theo vai trò dạng số (`isAdmin`...) và mã token lưu ở cookie JavaScript đọc được | Phải chuyển sang quyền chi tiết từ `/auth/me`, token chỉ giữ trong bộ nhớ, làm mới bằng cookie `httpOnly` |
| Gọi các đường dẫn cũ (`/api/Student...`, `/api/students/verify`, `/api/news/catholic`...) | Phải chuyển sang `/api/v1/...` theo danh mục V3; tra cứu đoàn sinh công khai bị bỏ |
| Trang công khai có ở cả hai ứng dụng | Gộp về một nơi (cổng thông tin), quản trị chỉ giữ chức năng quản trị |
| Không thấy Vitest, Playwright hay kiểm tra trợ năng trong hai ứng dụng này | Cần bộ kiểm thử giao diện |
| Chưa có màn hình cho: đợt xét lên lớp, mở khóa sổ điểm, nhập Excel hai bước, nhật ký kiểm toán, cấu hình, tác vụ nền, cổng phụ huynh theo V3 | Là phần mới cần dựng |

## 2. Nguyên tắc thiết kế

1. **Trang nghiêm mà gần gũi.** Nhiều khoảng trắng, màu trầm, chữ rõ; không dùng màu rực, hoạt ảnh phô trương hay biểu tượng cảm xúc.
2. **Gọn gàng.** Mỗi trang một mục đích; thông tin ít dùng nằm trong tab hoặc ngăn kéo; bảng dày vừa phải, tiêu đề cố định; tối đa một hành động chính nổi bật mỗi trang.
3. **Bản sắc Công giáo tinh tế, không sáo rỗng.** Dùng màu phụng vụ, khung vòm, đường kẻ vàng với dấu thánh giá nhỏ, chữ có chân cho tiêu đề. Không dùng hình thánh làm họa tiết lặp, không đặt biểu tượng thánh giá lên nút xóa hoặc thông báo lỗi.
4. **Biết quyền và biết phạm vi.** Không có quyền thì không hiện nút; có quyền nhưng bị trạng thái chặn (sổ điểm đã khóa) thì hiện nút kèm lý do; dữ liệu nhạy cảm bị che có chữ giải thích.
5. **Thận trọng với dữ liệu trẻ em.** Không hiện thông tin cá nhân ở trang công khai; chứng chỉ chỉ hiện tên đã che; mã nhạy cảm và ghi chú nội bộ không bao giờ xuất hiện ở cổng phụ huynh.
6. **Dễ dùng cho mọi lứa tuổi tình nguyện viên:** chữ cơ bản 15 px, có thể phóng to; vùng bấm tối thiểu 40 px; tương phản AA; dùng được bằng bàn phím; chạy tốt trên điện thoại.
7. **Lỗi nói bằng lời dễ hiểu.** Mọi mã lỗi của backend có một câu tiếng Việt thân thiện (Phụ lục B), không lộ thuật ngữ kỹ thuật.
8. **Một nguồn sự thật cho giao diện:** điều hướng, quyền, thông điệp lỗi được sinh từ mô hình backend, nên không lệch nhau.

### Gợi ý ứng xử phù hợp với Công giáo (cần Ban giáo lý và linh mục hướng dẫn xác nhận)

| Nên | Tránh |
|---|---|
| Dùng thuật ngữ quen thuộc: Đoàn sinh, Giáo lý viên, Huynh trưởng, Ban điều hành, Giáo xứ, Tên thánh, Bí tích | Dịch máy hoặc từ quá hiện đại ("người dùng", "khách hàng") ở nội dung hướng tới giáo dân |
| Hiển thị tên thánh trước họ tên, đúng chính tả (Phêrô, Phaolô, Giuse...) | Cắt tên thánh hoặc viết sai dấu |
| Dùng màu phụng vụ ở dải đầu trang và chi tiết nhỏ | Thay đổi màu của nút thành công, lỗi theo mùa phụng vụ (làm lẫn ý nghĩa trạng thái) |
| Dùng thánh giá, vòm, đường kẻ vàng như điểm nhấn thưa | Dùng hình thánh, Chúa, Đức Mẹ làm nền lặp hoặc họa tiết trang trí; dùng câu Kinh Thánh làm trang trí mà không ghi nguồn |
| Ngôn ngữ trang trọng, lịch sự với phụ huynh | Giọng đùa cợt, tiếng lóng, biểu tượng cảm xúc |
| Chứng chỉ bí tích in nghiêm trang, đúng ngày lãnh bí tích | Trình bày chứng chỉ như phiếu mua hàng hay có quảng cáo |
| Hình ảnh thật của giáo xứ (có sự đồng ý của phụ huynh nếu có trẻ em) | Ảnh trẻ em không có đồng ý (backend có `HasPhotoConsent`) |

## 3. Hệ thống thiết kế

### 3.1 Màu sắc

| Vai trò | Màu | Ghi chú |
|---|---|---|
| Marian Blue (chính) | `#1D3A73`, hover `#2C4F96`, tối `#13264E` | Nút chính, thanh bên, liên kết; thang đầy đủ 50 đến 950 trong `main.css` |
| Vatican Gold (điểm nhấn) | trang trí `#A8812A`, chữ `#7A5C17`, nút `#D6B25A` | **Vàng nhạt chỉ dùng cho viền, đường kẻ, biểu tượng**; chữ vàng dùng bản đậm để đạt tương phản |
| Nền ngà và thẻ | `#F6F2E9`, `#FFFEFA` | Cảm giác giấy, dịu mắt hơn trắng thuần |
| Chữ | chính `#1E2434`, phụ `#5F6677` | |
| Thành công, cảnh báo, lỗi | `#2F6B4F`, `#8A5412`, `#8E2430` | Không đổi theo mùa phụng vụ |
| Màu phụng vụ (dải đầu trang) | xanh `#2F6B4F`, tím `#5B3A7A`, trắng và vàng `#F1E6C2`, đỏ `#9B2335`, hồng `#A24F65`, đen `#2B2B2B` | Lấy từ trường màu của lịch phụng vụ; mùa Thường niên xanh, Vọng và Chay tím, Giáng Sinh và Phục Sinh trắng vàng, Hiện Xuống và lễ Các thánh tử đạo đỏ, Chúa nhật Vui mừng hồng |
| Chế độ tối | nền `#0F1524`, thẻ `#172038`, chữ `#EDEBE4`, vàng `#D6B25A` | Có sẵn, theo hệ điều hành hoặc người dùng chọn |

**Tỷ lệ tương phản đã kiểm tra** (WCAG, ngưỡng 4.5:1 cho chữ thường):

{mdt(["Cặp màu","Chữ","Nền","Tỷ lệ"],[(n,a,b,f"{cr(a,b):.2f}:1") for n,a,b in CP])}
Trong quá trình kiểm tra phát hiện ba cặp ban đầu không đạt (chữ vàng `#A8812A` trên nền ngà chỉ 3.2:1, chữ trắng trên nút vàng 3.6:1, chữ trắng trên màu hồng phụng vụ `#B5677A` 4.05:1) và đã được đổi như trong bảng.

### 3.2 Chữ, khoảng cách, bo góc

- **Tiêu đề:** Cormorant Garamond (có chân, trang nghiêm), đậm 700, cỡ 30 (trang), 22 (mục), 18 (thẻ). Nếu cần, dự phòng Merriweather như hiện nay.
- **Nội dung và giao diện:** Inter 15 px, dòng 1.55; bảng 14 px.
- **Khoảng cách:** thang 4, 8, 12, 16, 24, 32; lề trang 24; thẻ đệm 16 đến 18.
- **Bo góc:** nhẹ (9 đến 14 px); riêng ảnh đại diện dùng khung vòm (nửa trên tròn, nửa dưới vuông bo nhẹ).
- **Chuyển động:** rất tiết chế, chỉ mờ dần và trượt ngắn; tôn trọng `prefers-reduced-motion`.
- **Biểu tượng:** nét mảnh (Lucide); dấu ✠ dùng duy nhất ở đường kẻ vàng dưới tiêu đề trang.

### 3.3 Họa tiết nhận diện

- **Đường kẻ vàng với ✠ ở giữa** dưới tiêu đề mỗi trang (`gold-rule`).
- **Khung vòm** cho ảnh đại diện đoàn sinh và ô biểu trưng (`arch-frame`).
- **Dải phụng vụ** trên cùng mỗi trang: tên ngày lễ và mùa, nền theo màu phụng vụ.
- **Thanh bên xanh đậm** với mục đang chọn có vạch vàng ở bên trái.

### 3.4 Thành phần (đã có mã trong `layer/`)

| Thành phần | Vai trò |
|---|---|
| `AppShell`, `layouts/admin` | Khung quản trị: thanh bên theo quyền, dải phụng vụ, thanh trên, nhãn phạm vi |
| `LiturgicalStrip` | Dải phụng vụ lấy từ `/public/liturgical/today`; đặt `data-liturgical` cho cả trang |
| `ScopeBanner` | "Phạm vi dữ liệu: Toàn xứ / Ngành ... / Lớp ..." theo `scopeType` của vai trò |
| `PageHeader` | Tiêu đề có chân, phụ đề, vùng nút, đường kẻ vàng |
| `StatCard` | Thẻ số liệu viền vàng phía trên |
| `StatusChip` | Một nơi duy nhất ánh xạ trạng thái (đoàn sinh, ghi danh, điểm, đề xuất, niên khóa, chứng chỉ) sang nhãn và màu |
| `LockBanner` | Báo trạng thái khóa sổ điểm, nút mở khóa khi đủ quyền |
| `MaskedField` | Hiện giá trị hoặc "ẩn do không đủ quyền" |
| `ErrorState`, `EmptyState` | Lỗi từ backend bằng lời thân thiện; trạng thái rỗng có hướng dẫn |
| `v-can` (chỉ thị), `usePermissions` | Ẩn phần tử theo quyền |
| Kho `session` | Token trong bộ nhớ, `/auth/me`, quyền, làm mới phiên một lần cho nhiều yêu cầu cùng lúc |
| `useApi` | Gọi `/api/v1`, tự làm mới khi 401, chuyển ProblemDetails thành `ApiError` có mã lỗi |
| `useLiturgical` | Ánh xạ màu phụng vụ (tiếng Việt hoặc tiếng Anh) sang màu giao diện |

### 3.5 Mẫu giao diện

- **Bảng:** tiêu đề cố định, dòng bấm được mở hồ sơ, phân trang bên phải dưới; cột nhạy cảm che theo quyền; ô trống hiện hướng dẫn.
- **Biểu mẫu:** nhãn phía trên, lỗi từng trường lấy từ `errors` của ProblemDetails, nút chính ở bên phải dưới, xác nhận khi thoát nếu chưa lưu.
- **Hành động nguy hiểm** (xóa, thu hồi chứng chỉ, áp dụng lên lớp): hộp xác nhận nêu hậu quả bằng lời; riêng thu hồi và mở khóa sổ điểm bắt buộc nhập lý do.
- **Quyền:** ẩn nút khi không có quyền; khóa nút kèm lý do khi trạng thái chặn (ví dụ "chỉ áp dụng được khi hết đề xuất chờ").
- **Xung đột đồng thời** (409): liệt kê dòng bị người khác sửa và nút tải lại; không ghi đè âm thầm.
- **Giới hạn tần suất** (429): thông báo thân thiện kèm thời gian chờ, nút bị vô hiệu tới lúc đó.
- **Chờ tải:** khung xương (skeleton), không dùng vòng quay toàn trang.

## 4. Kiến trúc thông tin và phủ backend

### 4.1 Điều hướng quản trị (nhóm theo nghiệp vụ)

Tổng quan; Đoàn sinh; Lớp học (niên khóa, lớp, ngành và cấp lớp); Lên lớp; Hoạt động; Truyền thông; Báo cáo và Hệ thống. Mục chỉ hiện khi người dùng có quyền xem tương ứng (`layer/app/shared/nav.ts`, sinh tự động).

### 4.2 Độ phủ

- {len(adm)} màn hình quản trị, {len(pub)} trang công khai, {len(gd)} màn hình cổng phụ huynh.
- {n_eps} trên 188 endpoint có màn hình dùng; 2 endpoint kiểm tra sức khỏe không cần giao diện.
- Mọi quyền trong danh mục đều có nút hoặc màn hình tương ứng (bộ kiểm tra `fe_lint.py` bảo đảm điều này).
- Mỗi màn hình khai báo quyền xem và các nút theo quyền; mỗi endpoint ghi mà màn hình dùng đều có nút tương ứng với quyền của endpoint đó.

### 4.3 Hai khoảng trống phát hiện ở backend khi lập bản đồ giao diện

| Khoảng trống | Hậu quả | Đề xuất |
|---|---|---|
| Có `GET /public/banners` (chỉ banner đang bật), không có `GET /banners` cho quản trị | Quản trị không thấy banner đã tắt để bật lại | Thêm `GET /banners` (`banners.manage`) |
| Có `GET /public/news` (chỉ bài đang hiện), không có danh sách bài cho quản trị | Không thấy bài đã ẩn để hiện lại | Thêm `GET /news/articles` (`news.view`) |

### 4.4 Hợp đồng frontend cần từ backend (ghi rõ để hai bên khớp)

| Hạng mục | Nội dung cần có |
|---|---|
| `POST /auth/login`, `POST /auth/refresh` | Trả `accessToken` trong nội dung; đặt refresh token ở cookie `httpOnly`, `secure`, `sameSite`; CORS cho phép gửi cookie (credentials) từ các nguồn của hai ứng dụng |
| `GET /auth/me` | `id`, `userName`, `fullName`, `mustChangePassword`, `role {{ code, name, scopeType }}`, **danh sách mã quyền**, `branch`, `classRooms` (để hiện nhãn phạm vi) |
| Danh sách | Dạng `{{ items, page, pageSize, totalCount }}`; tham số `page`, `pageSize`, `search`, `status` |
| Lỗi | ProblemDetails có `code` (bảng ở Phụ lục B) và `errors` theo từng trường; 429 kèm `Retry-After` |
| `GET /classrooms/{{id}}/grades` | Tên lớp và niên khóa, **trạng thái niên khóa**, `unlockedUntil` (nếu đang mở khóa), từng dòng có `enrollmentId`, bốn điểm, `totalSessions`, `absences`, `computedGpa`, `computedStatus`, `rowVersion` |
| `PUT /classrooms/{{id}}/grades` | Nhận `rows`; xung đột trả `CONFLICT_VERSION` kèm danh sách dòng lỗi |
| `GET /promotion-batches/{{id}}/drafts` | Mỗi đề xuất có kết quả đề xuất, lớp hiện tại, lớp đích, lý do, trạng thái (kể cả `Stale`) |
| `GET /public/certificates/verify` | `maskedName`, `certificateType`, `sacramentDate`, `place`, `status`, `issuedAt` |
| `GET /public/liturgical/today` | `title`, `color`, `level`; ngày tính theo giờ Việt Nam |

## 5. Các màn hình chính

Chi tiết từng màn hình nằm trong bản xem trước. Dưới đây là mục đích, bố cục và hành vi quan trọng.

**Đăng nhập.** Hai cột: bên trái khung vòm và lời chào, bên phải biểu mẫu. Hiện cảnh báo khóa tạm; sau khi sai nhiều lần hiện thời gian còn lại; không nói tài khoản có tồn tại hay không. Tài khoản bắt buộc đổi mật khẩu bị chuyển sang trang đổi mật khẩu và không vào được trang khác.

**Tổng quan.** Bốn thẻ số liệu theo phạm vi; khung "Việc cần làm" theo quyền (đề xuất lên lớp chờ, em chưa đủ điểm, hồ sơ thiếu SĐT, em chưa cấp chứng chỉ); thông báo mới; thẻ phụng vụ hôm nay.

**Danh sách đoàn sinh.** Tìm không dấu, lọc ngành và trạng thái, tab "Chưa xếp lớp" (chỉ vai trò có `enrollments.manage`), nhãn phạm vi. Cột phụ huynh che số điện thoại khi thiếu `students.view-contact`. Nút Thêm, Nhập, Xuất hiện theo quyền.

**Hồ sơ đoàn sinh (7 tab).** Thông tin, Phụ huynh, Bí tích và chứng chỉ, Học tập, Lịch sử, Ghi chú, Liên kết tài khoản. Đầu trang có khung vòm, tên thánh và họ tên, mã, lớp, trạng thái. Tab Bí tích hiển thị dòng thời gian ba bí tích và nút **Cấp chứng chỉ** (cần `certificates.issue`); thu hồi bắt buộc lý do. Thông tin sức khỏe che khi thiếu `students.view-health`.

**Thêm đoàn sinh.** Kiểm tra trùng ngay khi nhập tên và ngày sinh (ba mức: trùng khớp, có thể trùng, gợi ý); cảnh báo ngành theo tuổi; chọn lớp trong phạm vi; ghi nhận đồng ý của phụ huynh.

**Nhập từ Excel.** Bốn bước: tải mẫu, tải tệp, xem báo cáo từng dòng (hợp lệ, cảnh báo, lỗi kèm cột và lý do), áp dụng dòng hợp lệ. Cùng một tệp không áp dụng hai lần.

**Niên khóa.** Thanh trạng thái bốn bước (Dự kiến, Đang hoạt động, Đang chốt, Đã lưu trữ); nút chỉ hiện đúng bước kế tiếp hợp lệ; mở lại cần lý do; nhân bản cơ cấu lớp.

**Sổ điểm.** Biểu ngữ trạng thái khóa; ô điểm bốn cột, số buổi vắng; điểm trung bình và kết quả tính lại khi lưu; ô trống là chưa nhập (khác 0); điểm ngoài 0 đến 10 báo ngay; xung đột liệt kê dòng; mở khóa có lý do và hạn.

**Đợt xét lên lớp.** Bảng đề xuất với cột kết quả điểm, lý do, lớp đích, trạng thái (kể cả "Cần xem lại" khi điểm đã đổi); duyệt hoặc từ chối từng em, duyệt hàng loạt các em đủ điều kiện; nút **Áp dụng đợt** chỉ bật khi hết đề xuất chờ và đủ quyền `promotion.apply`.

**Sự kiện và thu phí.** Đăng ký đoàn sinh (không phải điểm danh); cột đã thu và còn thiếu tính từ sổ cái; ghi thu, hoàn phí bằng dòng âm; tổng thu chỉ người có `camps.collect` thấy.

**Người dùng, vai trò và quyền.** Danh sách người dùng, gán vai trò; mật khẩu tạm hiện **đúng một lần**; cây quyền theo module, ô quyền mình không có bị khóa kèm lý do (chống tự nâng quyền); vai trò hệ thống không sửa mã.

**Trang công khai.** Dải phụng vụ, thông báo, tin Giáo hội, thư viện, ban huynh trưởng (không SĐT), lịch phụng vụ, số liệu tổng hợp; **không có dữ liệu cá nhân của đoàn sinh**.

**Xác thực chứng chỉ.** Nhập mã 12 ký tự; hiện tên đã che, loại bí tích, ngày và nơi lãnh, trạng thái (kể cả "đã thu hồi"); thông báo thân thiện khi vượt giới hạn tra cứu.

**Cổng phụ huynh.** Danh sách con của mình; hồ sơ rút gọn: điểm, chứng chỉ (tải PDF), thông báo; không có ghi chú nội bộ; đổi mã sang em khác báo không tìm thấy.

## 6. Kiến trúc kỹ thuật

- **Nuxt layer dùng chung** (`layer/`) mở rộng bởi hai ứng dụng: `web-admin` (SPA, cần đăng nhập) và `web-portal` (trang công khai dựng sẵn phía máy chủ để tốt cho tìm kiếm, kèm cổng phụ huynh).
- **Dữ liệu máy chủ:** khuyến nghị thêm `@tanstack/vue-query` (đã dùng ở kho AnhEmMotor-Store của bạn) để đệm, làm mới và vô hiệu hóa sau thao tác ghi; `useApi` làm lớp thấp.
- **Kiểu dữ liệu từ backend:** sinh từ OpenAPI (ví dụ `openapi-typescript`) để hai bên không lệch; `permissions.ts`, `errors.ts`, `nav.ts` đã sinh từ mô hình.
- **Biểu mẫu:** zod (đã có) để kiểm tra phía trình duyệt, nhưng **backend vẫn là nguồn kiểm tra cuối cùng**.
- **Phiên đăng nhập:** access token chỉ giữ trong bộ nhớ; làm mới bằng cookie `httpOnly`; khi tải lại trang thì gọi `refresh` rồi `me`; một lần làm mới dùng chung cho nhiều yêu cầu đồng thời.
- **Phân quyền ở giao diện** chỉ để trải nghiệm tốt hơn; **không phải ranh giới an ninh** (backend kiểm tra lại mọi yêu cầu).
- **HTML từ backend** (thông báo, giáo án) hiển thị qua DOMPurify (giữ thành phần `SafeHtml` hiện có); không dùng `v-html` với dữ liệu chưa lọc.
- **Tải lên:** kiểm tra loại và dung lượng ở trình duyệt theo cùng giới hạn backend, chỉ để báo sớm.
- **Dữ liệu cá nhân:** không lưu thông tin đoàn sinh trong `localStorage`; không đưa vào đường dẫn; nhật ký phía trình duyệt không ghi dữ liệu cá nhân.
- **Ngôn ngữ:** tiếng Việt mặc định, chuỗi tách khỏi mã để thêm tiếng Anh sau.
- **Hiệu năng:** tách mã theo trang, bảng ảo hóa khi trên 200 dòng, ảnh có kích thước cố định, phông chữ tải trước; chỉ tiêu Lighthouse trang công khai từ 90 trở lên.
- **Cấu trúc thư mục** của layer và gợi ý chuyển hai ứng dụng hiện có sang dùng layer nằm trong `layer/` (Nuxt 4 dùng thư mục `app/`).

## 7. Lộ trình triển khai

{mdt(["Gói","Tên","Nội dung","Phụ thuộc","Tiêu chí hoàn thành","Cỡ"],PK)}
Cỡ: S dưới 1 ngày, M 2 đến 4 ngày, L 5 đến 10 ngày, XL 10 đến 18 ngày (người-ngày). **Tổng ước lượng {lo:.0f} đến {hi:.0f} người-ngày** cho một lập trình viên frontend quen Nuxt; là ước lượng thô, chưa gồm thời gian chờ quyết định, chờ nội dung và hình ảnh từ giáo xứ. Có thể làm song song với backend: F0 đến F2 ngay khi có hợp đồng ở mục 4.4; các gói sau theo thứ tự backend hoàn thiện.

## 8. Kiểm thử và tiêu chí hoàn thành

| Loại | Nội dung | Công cụ |
|---|---|---|
| Hiển thị theo vai trò | Với mỗi vai trò, kiểm tra menu và nút hiện đúng (sinh từ `screens.json` và `permission-matrix.csv`) | Vitest, Playwright |
| Thành phần | Mỗi thành phần ở sáng và tối, có trạng thái rỗng, lỗi, tải | Vitest, ảnh chụp so sánh |
| Luồng chính (E2E) | Đăng nhập và khóa tạm; thêm đoàn sinh và cảnh báo trùng; nhập Excel; nhập điểm, khóa sổ, mở khóa; xét lên lớp; cấp và xác thực chứng chỉ; cổng phụ huynh | Playwright |
| Trợ năng | Không lỗi nghiêm trọng; điều hướng bằng bàn phím; tương phản AA | axe, kiểm tra thủ công với trình đọc màn hình |
| Hiệu năng | Chỉ tiêu mục 6 | Lighthouse trong CI |
| Bảo mật giao diện | Không có token trong `localStorage`; HTML luôn qua bộ lọc; không dữ liệu cá nhân ở trang công khai | Quét mã, kiểm thử |

Tiêu chí hoàn thành: mọi màn hình ở mục 4.2 chạy được với backend thật; ma trận hiển thị theo vai trò đạt; không lỗi trợ năng nghiêm trọng; trang công khai đạt chỉ tiêu hiệu năng; Ban giáo lý và linh mục xem và đồng ý về hình thức, ngôn ngữ và hình ảnh.

## 9. Rủi ro và quyết định cần xác nhận

| Vấn đề | Cách xử lý hoặc câu hỏi |
|---|---|
| Hợp đồng API chưa chốt | Mục 4.4; sinh kiểu từ OpenAPI để phát hiện lệch sớm |
| Hình thức và biểu tượng có phù hợp với giáo xứ | Cho Ban giáo lý và linh mục xem bản xem trước trước khi dựng; có thể đổi họa tiết bằng token |
| Phông chữ | Cormorant Garamond và Inter đều miễn phí; nếu cần chạy ngoại tuyến thì tự lưu phông chữ |
| Ảnh và nội dung riêng của giáo xứ (logo, ảnh nhà thờ, tên giáo xứ) | Cấu hình được; cần giáo xứ cung cấp và đồng ý |
| Một bảng mã ngành và cấp lớp (11 hay 12 cấp, có "Chiên Con" không) | Phải chốt trước khi dựng màn hình tổ chức và nhập Excel |
| Dùng điện thoại | Bảng cuộn ngang, thanh bên thành ngăn kéo; cần thử với giáo lý viên thực tế |
| Thứ tự ưu tiên | Đề xuất làm trước F0 đến F3 (đăng nhập, đoàn sinh) rồi sổ điểm và lên lớp, vì là phần giáo lý viên dùng nhiều nhất |

## 10. Giới hạn của tài liệu và mã kèm theo

- **Bản xem trước** là mô phỏng với dữ liệu minh họa, không gọi backend thật.
- **Mã trong `layer/` mới được kiểm tra cú pháp** (11 tệp TypeScript và 15 thành phần Vue qua bộ biên dịch, 0 lỗi). **Chưa build bằng Nuxt, chưa chạy, chưa kiểm tra kiểu với Nuxt UI hay với backend thật.** Thuộc tính và tên thành phần của Nuxt UI 4 cần đối chiếu khi build.
- Hợp đồng ở mục 4.4 là **đề xuất của mình** dựa trên bản thiết kế backend; backend thực tế có thể khác, cần đối chiếu.
- Tỷ lệ tương phản được tính theo công thức WCAG cho các cặp màu chính; chưa kiểm tra bằng công cụ trên giao diện chạy thật.
- Chưa đọc hết mọi trang của frontend hiện tại; các nhận xét ở mục 1 dựa trên các tệp đã đọc (cấu hình, bố cục, kho đăng nhập, danh sách trang và kích thước tệp).
- Các gợi ý về ứng xử Công giáo là hiểu biết chung của mình, **cần Ban giáo lý và linh mục xem xét**.

## Phụ lục A: Bản đồ màn hình và endpoint

### Quản trị

{map_table(adm)}
### Trang công khai

{map_table(pub)}
### Cổng phụ huynh

{map_table(gd)}
## Phụ lục B: Thông điệp lỗi thân thiện theo mã của backend

{mdt(["Mã","HTTP","Thông điệp hiển thị"],[(c,h,__import__('json').loads(__import__('json').dumps(m))) for c,h,m in [(e[0],e[1],None) for e in MA.ERRORS]])}
"""
# replace placeholder messages for appendix B from layer/errors.ts
import re
errs=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','layer/app/shared/errors.ts'),encoding='utf-8').read()
msgs=dict(re.findall(r'^\s*([A-Z_]+): "((?:[^"\\]|\\.)*)"',errs,re.M))
rows=[(c,h,msgs[c]) for c,h,_ in MA.ERRORS]
doc=doc[:doc.index("## Phụ lục B")]+"## Phụ lục B: Thông điệp lỗi thân thiện theo mã của backend\n\n"+mdt(["Mã","HTTP","Thông điệp hiển thị"],rows)
open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','THIET-KE-FRONTEND-GIAOLY-V3.md'),'w',encoding='utf-8').write(doc)
print("ok",len(doc.split("\n")),"dòng; tổng ước lượng",lo,hi)
