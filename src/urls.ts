export const loginUrl = "/login";

export const dashboardUrl = "/dashboard";
export const materialReportUrl = `${dashboardUrl}/bao-cao-xuat-nhap-ton-nvl`;

export const quanLyToKhaiUrl = "/quan-ly-to-khai";
export const danhSachToKhaiNhapUrl = `${quanLyToKhaiUrl}/danh-sach-to-khai-nhap`;
export const danhSachToKhaiXuatUrl = `${quanLyToKhaiUrl}/danh-sach-to-khai-xuat`;
export const exportDeclarationExpectedUrl = `${quanLyToKhaiUrl}/danh-sach-to-khai-xuat-du-kien`;

export const quanLyHoaDonVATUrl = "/quan-ly-hoa-don-vat";
export const danhSachHoaDonVATUrl = `${quanLyHoaDonVATUrl}/danh-sach-hoa-don-vat`;
export const danhSachMappingVATUrl = `${quanLyHoaDonVATUrl}/danh-sach-mapping-vat`;

export const quanLyDVMoTKUrl = "/quan-ly-dv-mo-tk";
export const danhSachDVMoTKUrl = `${quanLyDVMoTKUrl}/danh-sach-dv-mo-tk`;

export const baoCaoGiaiTrinhUrl = "/bao-cao-giai-trinh";

export const quanLyHoSoCOUrl = "/quan-ly-ho-so-c-o";
export const chiTietHoSoCOUrl = `${quanLyHoSoCOUrl}/chi-tiet-ho-so-CO/:id`;
export const getChiTietHoSoCOUrl = (id: string) =>
  chiTietHoSoCOUrl.replace(":id", id);
export const themMoiHoSoCOUrl = `${quanLyHoSoCOUrl}/them-moi-ho-so-CO`;

export const cauHinhHeThongUrl = "/cau-hinh-he-thong";
export const danhSachDinhMucSanPhamUrl = `${cauHinhHeThongUrl}/danh-sach-dinh-muc-san-pham`;
export const danhSachSpUrl = `${cauHinhHeThongUrl}/danh-muc-san-pham`;
export const danhSachKHUrl = `${cauHinhHeThongUrl}/danh-muc-khach-hang`;
export const danhSachNDUrl = `${cauHinhHeThongUrl}/danh-muc-nhan-vien`;
export const danhSachPhiUrl = `${cauHinhHeThongUrl}/danh-muc-phi`;
export const listUnitUrl = `${cauHinhHeThongUrl}/danh-muc-don-vi`;
export const listPSRUrl = `${cauHinhHeThongUrl}/danh-muc-psr`;
export const trangChuUrl = dashboardUrl;

export const breadcrumbNameMap: Record<string, string> = {
  [dashboardUrl]: "Dashboard",
  [quanLyToKhaiUrl]: "Quản lý tờ khai",
  [quanLyHoaDonVATUrl]: "Quản lý hoá đơn VAT",
  [quanLyDVMoTKUrl]: "Quản lý DV mở TK",
  [baoCaoGiaiTrinhUrl]: "Báo cáo giải trình",
  [quanLyHoSoCOUrl]: "Quản lý hồ sơ C/O",
  [cauHinhHeThongUrl]: "Cấu hình hệ thống",
};
