import csv,re,sys,collections
import fe_model as M
def norm(p): return re.sub(r'\{[^}]+\}','{}',p).rstrip('/').lower()
cat=list(csv.DictReader(open('api-catalog.csv',encoding='utf-8-sig')))
C={(r['Phương thức'].upper(),norm(r['Đường dẫn'].replace('/api/v1',''))):r for r in cat}
perms={r['Quyền'] for r in csv.DictReader(open('permission-matrix.csv',encoding='utf-8-sig'))}
errs=[];warns=[]
covered=collections.defaultdict(list)
for s in M.SCREENS:
    for m,p in s['eps']:
        k=(m.upper(),norm(p))
        if k not in C: errs.append(f"{s['route']}: endpoint không có trong danh mục backend: {m} {p}")
        else: covered[k].append(s['route'])
    if s['perm'] not in perms and s['perm'] not in('PUBLIC','AUTHED'): errs.append(f"{s['route']}: quyền xem màn hình không có: {s['perm']}")
    for lab,pm in s['actions']:
        if pm not in perms: errs.append(f"{s['route']}: nút '{lab}' dùng quyền không có: {pm}")
    # quyền xem màn hình phải khớp quyền của endpoint chính (endpoint GET đầu tiên)
    if s['perm'] not in('PUBLIC','AUTHED') and s['eps']:
        first=C.get((s['eps'][0][0].upper(),norm(s['eps'][0][1])))
        if first and first['Quyền'] not in(s['perm'],) and first['Quyền'] not in('AUTHED',): warns.append(f"{s['route']}: quyền xem ({s['perm']}) khác quyền endpoint chính ({first['Quyền']})")
# endpoint nào chưa có màn hình
internal={(m,norm(p)) for m,p in M.INTERNAL}
missing=[k for k in C if k not in covered and k not in internal]
for k in sorted(missing): errs.append(f"Endpoint chưa có màn hình nào dùng: {k[0]} {C[k]['Đường dẫn']} ({C[k]['Quyền']})")
# quyền chưa có nút hay màn hình nào dùng
used=set()
for s in M.SCREENS:
    if s['perm'] not in('PUBLIC','AUTHED'): used.add(s['perm'])
    for _,pm in s['actions']: used.add(pm)
unused=sorted(perms-used)
for u in unused: warns.append(f"Quyền chưa có nút hay màn hình nào dùng: {u}")
# quyền của từng endpoint ghi phải có nút tương ứng trên màn hình dùng nó
for s in M.SCREENS:
    have={pm for _,pm in s['actions']}|{s['perm']}
    for m,p in s['eps']:
        r=C.get((m.upper(),norm(p)))
        if r and r['Quyền'] not in('PUBLIC','AUTHED') and r['Quyền'] not in have: errs.append(f"{s['route']}: endpoint {m} {p} cần quyền {r['Quyền']} nhưng màn hình không có nút hoặc quyền xem tương ứng")
if __name__=="__main__":
    print(f"Màn hình: {len(M.SCREENS)} | Endpoint backend: {len(C)} | Có màn hình: {len(covered)} | Giao diện không dùng (giám sát): {len(internal)}")
    print(f"LỖI ({len(errs)}):");[print(" -",e) for e in errs]
    print(f"CẢNH BÁO ({len(warns)}):");[print(" -",w) for w in warns]
    sys.exit(1 if errs else 0)
