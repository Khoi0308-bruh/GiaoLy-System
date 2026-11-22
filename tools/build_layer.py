import os,re,csv,json,sys
sys.dont_write_bytecode=True
import fe_model as M, model_api as MA
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','layer')
def W(path,txt):
    p=os.path.join(R,path);os.makedirs(os.path.dirname(p),exist_ok=True);open(p,'w',encoding='utf-8').write(txt)
# ---------- generated: permissions.ts ----------
def camel(s): return "".join(w.capitalize() for w in re.split(r'[-.]',s))
mods={}
for c,n,m,old in MA.PERMS:
    mod,act=c.split('.',1);mods.setdefault(mod,[]).append((camel(act),c,n))
out="// Sinh tự động từ permission-matrix.csv. Không sửa tay: chạy tools/build_layer.py\nexport const PERMISSIONS = {\n"
for mod,items in mods.items():
    out+=f"  {camel(mod)}: {{\n"+"".join(f"    {a}: '{c}', // {n}\n" for a,c,n in items)+"  },\n"
out+="} as const\n\n// Conditional phân phối trên union của các nhóm, rồi lấy hợp các giá trị chuỗi.\n// (Index thẳng bằng `keyof union` sẽ ra never vì các nhóm có bộ khoá khác nhau.)\ntype PermissionGroup = typeof PERMISSIONS[keyof typeof PERMISSIONS]\nexport type PermissionCode = PermissionGroup extends Record<string, infer V> ? V : never\n"
W('app/shared/permissions.ts',out)
# ---------- generated: errors.ts ----------
FR={"AUTH_INVALID_CREDENTIALS":"Tên đăng nhập hoặc mật khẩu chưa đúng.","AUTH_LOCKED":"Tài khoản tạm khóa do nhập sai nhiều lần. Vui lòng thử lại sau ít phút.","AUTH_TOKEN_REVOKED":"Phiên đăng nhập đã hết hiệu lực. Vui lòng đăng nhập lại.","AUTH_MUST_CHANGE_PASSWORD":"Bạn cần đổi mật khẩu trước khi tiếp tục.","AUTH_PASSWORD_WEAK":"Mật khẩu chưa đạt yêu cầu: tối thiểu 10 ký tự, không chứa tên đăng nhập, không quá phổ biến.",
"FORBIDDEN":"Bạn chưa có quyền thực hiện thao tác này.","NOT_FOUND":"Không tìm thấy nội dung này, hoặc nằm ngoài phạm vi của bạn.","VALIDATION_FAILED":"Thông tin chưa hợp lệ. Vui lòng kiểm tra các ô được đánh dấu.","CONFLICT_VERSION":"Dữ liệu vừa được người khác thay đổi. Vui lòng tải lại trước khi sửa.","CONFLICT_DUPLICATE":"Thông tin này đã tồn tại.",
"YEAR_LOCKED":"Niên khóa đã khóa sổ điểm. Liên hệ Ban điều hành nếu cần mở khóa.","YEAR_INVALID_TRANSITION":"Chưa thể chuyển niên khóa sang trạng thái này.","ENROLLMENT_EXISTS":"Đoàn sinh đã có lớp đang học trong niên khóa này.","PROMOTION_STALE":"Điểm đã thay đổi sau khi tạo đề xuất. Cần tính lại.","PROMOTION_NO_TARGET":"Niên khóa mới chưa có lớp phù hợp. Hãy nhân bản cơ cấu lớp trước.",
"CERT_ALREADY_ISSUED":"Đoàn sinh đã có chứng chỉ còn hiệu lực cho bí tích này.","CERT_REVOKED":"Chứng chỉ này đã bị thu hồi.","IMPORT_HAS_ERRORS":"Tệp nhập còn dòng lỗi. Hãy xem báo cáo từng dòng.","PRIVILEGE_ESCALATION":"Không thể cấp hoặc gán quyền vượt quá quyền của chính bạn.","LAST_ADMIN":"Phải còn ít nhất một quản trị viên đang hoạt động.","RATE_LIMITED":"Bạn thao tác quá nhanh. Vui lòng chờ giây lát rồi thử lại.","UPLOAD_INVALID":"Tệp tải lên không hợp lệ (loại tệp, dung lượng hoặc nội dung).","URL_BLOCKED":"Địa chỉ này không được phép."}
assert set(FR)=={e[0] for e in MA.ERRORS},"thiếu thông điệp cho mã lỗi"
out="// Sinh tự động từ bảng mã lỗi của backend. Thông điệp viết cho người dùng, không dùng thuật ngữ kỹ thuật.\nexport const ERROR_MESSAGES: Record<string, string> = {\n"+"".join(f"  {k}: {json.dumps(v,ensure_ascii=False)},\n" for k,v in FR.items())+"}\n\nexport const DEFAULT_ERROR = 'Đã có lỗi xảy ra. Vui lòng thử lại.'\n"
W('app/shared/errors.ts',out)
# ---------- generated: nav.ts ----------
GROUP_ORDER=["Tổng quan","Đoàn sinh","Lớp học","Lên lớp","Hoạt động","Truyền thông","Báo cáo","Hệ thống"]
nav={g:[] for g in GROUP_ORDER}
for s in M.SCREENS:
    if s['area']!='admin' or '{' in s['route'] or s['group']=='Tài khoản': continue
    perm=None if s['perm'] in('PUBLIC','AUTHED') else s['perm']
    nav.setdefault(s['group'],[]).append((s['title'],s['route'],perm))
out="// Sinh tự động từ tools/fe_model.py. Mục chỉ hiện khi người dùng có quyền xem tương ứng.\nimport type { PermissionCode } from './permissions'\n\nexport interface NavItem { label: string, to: string, permission?: PermissionCode }\nexport interface NavGroup { label: string, items: NavItem[] }\n\nexport const ADMIN_NAV: NavGroup[] = [\n"
for g in GROUP_ORDER:
    if not nav.get(g): continue
    out+=f"  {{ label: {json.dumps(g,ensure_ascii=False)}, items: [\n"+"".join(f"    {{ label: {json.dumps(t,ensure_ascii=False)}, to: {json.dumps(r)}" + (f", permission: '{p}'" if p else "")+" },\n" for t,r,p in nav[g])+"  ] },\n"
out+="]\n"
W('app/shared/nav.ts',out)
json.dump([dict(route=s['route'],area=s['area'],title=s['title'],perm=s['perm'],endpoints=[f"{m} {p}" for m,p in s['eps']],actions=[{'label':a,'permission':p} for a,p in s['actions']]) for s in M.SCREENS],open(os.path.join(R,'screens.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print("generated",len(mods),"permission modules;",sum(len(v) for v in nav.values()),"nav items")
