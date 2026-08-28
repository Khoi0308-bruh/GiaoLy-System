/**
 * Script tạo file Excel mock data cho hệ thống GiaoLy
 * Chạy: node create-mock-excel.mjs
 */

import { writeFileSync } from 'fs';

// Dữ liệu mock đoàn sinh (50 học sinh)
const mockStudents = [
  // Ấu Nhi (Branch=1)
  { holyName: 'Maria', fullName: 'Nguyễn Thị Lan', birthDate: '2017-03-15', className: 'Ấu 1', branch: 1, baptismDate: '2017-04-20', communionDate: '', confirmationDate: '' },
  { holyName: 'Giuse', fullName: 'Trần Văn Minh', birthDate: '2016-07-22', className: 'Ấu 2', branch: 1, baptismDate: '2016-08-10', communionDate: '', confirmationDate: '' },
  { holyName: 'Anna', fullName: 'Lê Thị Hoa', birthDate: '2017-01-05', className: 'Ấu 1', branch: 1, baptismDate: '2017-02-12', communionDate: '', confirmationDate: '' },
  { holyName: 'Phaolô', fullName: 'Phạm Văn Dũng', birthDate: '2016-11-30', className: 'Ấu 2', branch: 1, baptismDate: '2016-12-25', communionDate: '', confirmationDate: '' },
  { holyName: 'Teresa', fullName: 'Võ Thị Mai', birthDate: '2017-06-18', className: 'Ấu 1', branch: 1, baptismDate: '2017-07-01', communionDate: '', confirmationDate: '' },
  { holyName: 'Gioan', fullName: 'Đặng Văn Khoa', birthDate: '2016-09-14', className: 'Ấu 2', branch: 1, baptismDate: '2016-10-05', communionDate: '', confirmationDate: '' },
  { holyName: 'Catarina', fullName: 'Bùi Thị Linh', birthDate: '2017-04-20', className: 'Ấu 1', branch: 1, baptismDate: '2017-05-14', communionDate: '', confirmationDate: '' },
  { holyName: 'Phêrô', fullName: 'Ngô Văn Tùng', birthDate: '2016-12-08', className: 'Ấu 2', branch: 1, baptismDate: '2017-01-06', communionDate: '', confirmationDate: '' },
  { holyName: 'Lucia', fullName: 'Đinh Thị Ngọc', birthDate: '2017-08-25', className: 'Ấu 1', branch: 1, baptismDate: '2017-09-08', communionDate: '', confirmationDate: '' },
  { holyName: 'Tôma', fullName: 'Hoàng Văn Bảo', birthDate: '2016-05-12', className: 'Ấu 2', branch: 1, baptismDate: '2016-06-19', communionDate: '', confirmationDate: '' },
  { holyName: 'Maria', fullName: 'Lý Thị Thanh', birthDate: '2017-02-28', className: 'Ấu 1', branch: 1, baptismDate: '2017-03-25', communionDate: '', confirmationDate: '' },
  { holyName: 'Matthêu', fullName: 'Trương Văn Phong', birthDate: '2016-10-17', className: 'Ấu 2', branch: 1, baptismDate: '2016-11-01', communionDate: '', confirmationDate: '' },

  // Thiếu Nhi (Branch=2)
  { holyName: 'Dominic', fullName: 'Nguyễn Văn Hùng', birthDate: '2013-05-10', className: 'Thiếu 1', branch: 2, baptismDate: '2013-06-15', communionDate: '2020-05-20', confirmationDate: '' },
  { holyName: 'Rosa', fullName: 'Phan Thị Tuyết', birthDate: '2012-08-23', className: 'Thiếu 2', branch: 2, baptismDate: '2012-09-08', communionDate: '2019-05-15', confirmationDate: '' },
  { holyName: 'Giuse', fullName: 'Vũ Văn Thành', birthDate: '2013-03-17', className: 'Thiếu 1', branch: 2, baptismDate: '2013-04-07', communionDate: '2020-05-17', confirmationDate: '' },
  { holyName: 'Maria', fullName: 'Đỗ Thị Hằng', birthDate: '2012-12-01', className: 'Thiếu 2', branch: 2, baptismDate: '2013-01-06', communionDate: '2019-05-19', confirmationDate: '' },
  { holyName: 'Anrê', fullName: 'Lê Văn Quang', birthDate: '2013-07-30', className: 'Thiếu 1', branch: 2, baptismDate: '2013-08-15', communionDate: '2020-05-24', confirmationDate: '' },
  { holyName: 'Cecilia', fullName: 'Trần Thị Phương', birthDate: '2012-04-14', className: 'Thiếu 2', branch: 2, baptismDate: '2012-05-13', communionDate: '2019-05-26', confirmationDate: '' },
  { holyName: 'Bartôlômêô', fullName: 'Huỳnh Văn Bình', birthDate: '2013-11-22', className: 'Thiếu 1', branch: 2, baptismDate: '2013-12-25', communionDate: '2020-06-07', confirmationDate: '' },
  { holyName: 'Maria', fullName: 'Ngô Thị Diễm', birthDate: '2012-06-09', className: 'Thiếu 2', branch: 2, baptismDate: '2012-06-24', communionDate: '2019-05-12', confirmationDate: '' },
  { holyName: 'Stêphanô', fullName: 'Bùi Văn Đức', birthDate: '2013-01-28', className: 'Thiếu 1', branch: 2, baptismDate: '2013-02-10', communionDate: '2020-05-31', confirmationDate: '' },
  { holyName: 'Anna', fullName: 'Cao Thị Kiều', birthDate: '2012-10-05', className: 'Thiếu 2', branch: 2, baptismDate: '2012-10-28', communionDate: '2019-05-09', confirmationDate: '' },
  { holyName: 'Gioan', fullName: 'Phạm Văn Hiệu', birthDate: '2013-09-19', className: 'Thiếu 1', branch: 2, baptismDate: '2013-09-29', communionDate: '2020-05-10', confirmationDate: '' },
  { holyName: 'Têrêsa', fullName: 'Đinh Thị Yến', birthDate: '2012-02-25', className: 'Thiếu 2', branch: 2, baptismDate: '2012-03-25', communionDate: '2019-05-05', confirmationDate: '' },

  // Nghĩa Sĩ (Branch=3)
  { holyName: 'Giuse', fullName: 'Lê Văn Khánh', birthDate: '2009-04-12', className: 'Nghĩa 1', branch: 3, baptismDate: '2009-05-17', communionDate: '2016-05-08', confirmationDate: '' },
  { holyName: 'Maria', fullName: 'Nguyễn Thị Thùy', birthDate: '2008-09-30', className: 'Nghĩa 2', branch: 3, baptismDate: '2008-10-12', communionDate: '2015-05-10', confirmationDate: '' },
  { holyName: 'Phêrô', fullName: 'Trần Văn Long', birthDate: '2009-07-05', className: 'Nghĩa 1', branch: 3, baptismDate: '2009-07-26', communionDate: '2016-05-15', confirmationDate: '' },
  { holyName: 'Agnes', fullName: 'Phan Thị Cẩm', birthDate: '2008-01-21', className: 'Nghĩa 2', branch: 3, baptismDate: '2008-01-28', communionDate: '2015-05-17', confirmationDate: '2022-05-14' },
  { holyName: 'Luca', fullName: 'Vũ Văn Tiến', birthDate: '2009-12-03', className: 'Nghĩa 1', branch: 3, baptismDate: '2009-12-25', communionDate: '2016-05-22', confirmationDate: '' },
  { holyName: 'Veronica', fullName: 'Đặng Thị Liên', birthDate: '2008-05-15', className: 'Nghĩa 2', branch: 3, baptismDate: '2008-06-01', communionDate: '2015-05-24', confirmationDate: '2022-05-14' },
  { holyName: 'Giacôbê', fullName: 'Hoàng Văn Thắng', birthDate: '2009-02-18', className: 'Nghĩa 1', branch: 3, baptismDate: '2009-03-08', communionDate: '2016-05-01', confirmationDate: '' },
  { holyName: 'Monica', fullName: 'Lý Thị Trúc', birthDate: '2008-11-27', className: 'Nghĩa 2', branch: 3, baptismDate: '2008-12-08', communionDate: '2015-05-03', confirmationDate: '2022-05-14' },
  { holyName: 'Tôma', fullName: 'Bùi Văn Sơn', birthDate: '2009-08-22', className: 'Nghĩa 1', branch: 3, baptismDate: '2009-09-07', communionDate: '2016-05-29', confirmationDate: '' },
  { holyName: 'Têrêsa', fullName: 'Trương Thị Nhung', birthDate: '2008-03-08', className: 'Nghĩa 2', branch: 3, baptismDate: '2008-03-25', communionDate: '2015-04-26', confirmationDate: '2022-05-14' },
  { holyName: 'Phaolô', fullName: 'Ngô Văn Kiên', birthDate: '2009-06-14', className: 'Nghĩa 1', branch: 3, baptismDate: '2009-06-29', communionDate: '2016-05-08', confirmationDate: '' },
  { holyName: 'Gioan', fullName: 'Đỗ Thị Hà', birthDate: '2008-07-20', className: 'Nghĩa 2', branch: 3, baptismDate: '2008-08-15', communionDate: '2015-05-31', confirmationDate: '2022-05-14' },

  // Hiệp Sĩ (Branch=4)
  { holyName: 'Giuse', fullName: 'Nguyễn Văn Dũng', birthDate: '2005-04-19', className: 'Hiệp 1', branch: 4, baptismDate: '2005-05-01', communionDate: '2012-05-06', confirmationDate: '2019-05-04' },
  { holyName: 'Maria', fullName: 'Lê Thị Ánh', birthDate: '2004-10-13', className: 'Hiệp 2', branch: 4, baptismDate: '2004-11-01', communionDate: '2011-05-08', confirmationDate: '2018-05-05' },
  { holyName: 'Phêrô', fullName: 'Trần Văn Nam', birthDate: '2005-01-07', className: 'Hiệp 1', branch: 4, baptismDate: '2005-01-06', communionDate: '2012-05-27', confirmationDate: '2019-05-18' },
  { holyName: 'Catarina', fullName: 'Vũ Thị Hạnh', birthDate: '2004-07-26', className: 'Hiệp 2', branch: 4, baptismDate: '2004-07-26', communionDate: '2011-05-22', confirmationDate: '2018-05-05' },
  { holyName: 'Phaolô', fullName: 'Phạm Quang Vinh', birthDate: '2005-06-29', className: 'Hiệp 1', branch: 4, baptismDate: '2005-06-29', communionDate: '2012-05-13', confirmationDate: '2019-05-04' },
  { holyName: 'Anna', fullName: 'Ngô Thị Thu', birthDate: '2004-12-26', className: 'Hiệp 2', branch: 4, baptismDate: '2005-01-02', communionDate: '2011-05-15', confirmationDate: '2018-05-19' },
  { holyName: 'Gioan', fullName: 'Đinh Hoàng Phúc', birthDate: '2005-12-27', className: 'Hiệp 1', branch: 4, baptismDate: '2005-12-27', communionDate: '2012-05-06', confirmationDate: '2019-05-11' },
  { holyName: 'Têrêsa', fullName: 'Bùi Thị Hương', birthDate: '2004-03-28', className: 'Hiệp 2', branch: 4, baptismDate: '2004-04-10', communionDate: '2011-05-29', confirmationDate: '2018-05-05' },
  { holyName: 'Tôma', fullName: 'Lý Văn Trọng', birthDate: '2005-07-03', className: 'Hiệp 1', branch: 4, baptismDate: '2005-07-03', communionDate: '2012-05-20', confirmationDate: '2019-05-18' },
  { holyName: 'Monica', fullName: 'Đặng Thị Phúc', birthDate: '2004-08-27', className: 'Hiệp 2', branch: 4, baptismDate: '2004-08-27', communionDate: '2011-05-01', confirmationDate: '2018-05-12' },
  { holyName: 'Matthêu', fullName: 'Cao Văn Hải', birthDate: '2005-09-21', className: 'Hiệp 1', branch: 4, baptismDate: '2005-09-21', communionDate: '2012-05-13', confirmationDate: '2019-05-25' },
  { holyName: 'Cêcilia', fullName: 'Hoàng Thị Bích', birthDate: '2004-11-22', className: 'Hiệp 2', branch: 4, baptismDate: '2004-11-22', communionDate: '2011-05-08', confirmationDate: '2018-05-26' },
];

import * as XLSX from 'xlsx';

const header = ['Tên Thánh', 'Họ Tên', 'Ngày Sinh', 'Lớp', 'Ngành (1-4)', 'Ngày Rửa Tội', 'Ngày Rước Lễ', 'Ngày Thêm Sức'];
const data = [header, ...mockStudents.map(s => [
  s.holyName,
  s.fullName,
  s.birthDate,
  s.className,
  s.branch,
  s.baptismDate || '',
  s.communionDate || '',
  s.confirmationDate || ''
])];

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'DanhSachDoanSinh');

XLSX.writeFile(wb, 'mock-students.xlsx');

console.log('✅ Đã tạo file mock-students.xlsx thành công (Định dạng chuẩn OpenXML)!');
console.log(`📊 Tổng số học sinh: ${mockStudents.length}`);
console.log('\n📁 File được lưu tại: c:\\GiaoLy\\mock-students.xlsx');
