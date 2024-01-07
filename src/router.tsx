import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "./module/app";
import {
  URL_AUTHORIZATION,
  URL_FUNCTION,
  URL_ROLE,
  URL_USER,
} from "./module/authorization";
import ProtectedComponent from "./module/authorization/bounary/ProtectComponent";
import { FunctionPage } from "./module/authorization/modules/functions-management";
import { RolePage } from "./module/authorization/modules/roles-management";
import { UserPage } from "./module/authorization/modules/user-management";
import { DashboardPage } from "./module/dashboard/index";
import { ErrorBoundaryPage } from "./module/error/boundary";
import { Login } from "./module/login";
import { ListMaterialReportPage } from "./module/quan-ly-cau-hinh-he-thong/bao-cao-nvl";
import { DanhSachDinhMucSpPage } from "./module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc";
import { ListUnitsPage } from "./module/quan-ly-cau-hinh-he-thong/quan-ly-don-vi";
import { QuanLyKhachHangPage } from "./module/quan-ly-cau-hinh-he-thong/quan-ly-khach-hang";
import { QuanLyNguoiDungPage } from "./module/quan-ly-cau-hinh-he-thong/quan-ly-nguoi-dung";
import { ListFeesPage } from "./module/quan-ly-cau-hinh-he-thong/quan-ly-phi";
import { ListPSRPage } from "./module/quan-ly-cau-hinh-he-thong/quan-ly-psr";
import { DanhSachSanPhamPage } from "./module/quan-ly-cau-hinh-he-thong/quan-ly-san-pham";
import { DanhSachDVVaMoTKPage } from "./module/quan-ly-dv-mo-to-khai";
import { ChiTietHoSoCO, ThemMoiHoSoCO } from "./module/quan-ly-ho-so-co";
import { ListCoDocumentPage } from "./module/quan-ly-ho-so-co-v2";
import {
  DanhSachHoaDonVatPage,
  ListMappingVatPage,
} from "./module/quan-ly-hoa-don-vat";
import { ListExportDeclarationPage } from "./module/quan-ly-to-khai/export-declaration";
import { ListExportDeclarationExpectedPage } from "./module/quan-ly-to-khai/export-declaration-expected";
import { ListImportDeclarationPage } from "./module/quan-ly-to-khai/import-declaration";
import {
  cauHinhHeThongUrl,
  chiTietHoSoCOUrl,
  danhSachDVMoTKUrl,
  danhSachDinhMucSanPhamUrl,
  danhSachHoaDonVATUrl,
  danhSachKHUrl,
  danhSachMappingVATUrl,
  danhSachNDUrl,
  danhSachPhiUrl,
  danhSachSpUrl,
  danhSachToKhaiNhapUrl,
  danhSachToKhaiXuatUrl,
  dashboardUrl,
  exportDeclarationExpectedUrl,
  listPSRUrl,
  listUnitUrl,
  materialReportUrl,
  quanLyDVMoTKUrl,
  quanLyHoSoCOUrl,
  quanLyHoaDonVATUrl,
  quanLyToKhaiUrl,
  themMoiHoSoCOUrl,
} from "./urls";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: (
      <AppLayout>
        <ErrorBoundaryPage />
      </AppLayout>
    ),
    children: [
      {
        path: dashboardUrl,
        // element: <DashboardPage />,
        element: (
          <ProtectedComponent
            Element={DashboardPage}
            url={dashboardUrl}
            title={"Dashboard"}
          />
        ),
      },
      {
        path: materialReportUrl,
        element: (
          <ProtectedComponent
            Element={ListMaterialReportPage}
            url={materialReportUrl}
            title={"Báo cáo xuất nhập tồn NVL"}
          />
        ),
      },
      {
        path: quanLyHoSoCOUrl,
        // element: <ListCoDocumentPage />,
        element: (
          <ProtectedComponent
            Element={ListCoDocumentPage}
            url={quanLyHoSoCOUrl}
            title={"Danh sách hồ sơ C/O"}
          />
        ),
      },
      {
        path: chiTietHoSoCOUrl,
        element: <ChiTietHoSoCO />,
        // element: (
        //   <ProtectedComponent
        //     Element={ChiTietHoSoCO}
        //     url={chiTietHoSoCOUrl}
        //     title={"Chi tiết hồ sơ C/O"}
        //   />
        // ),
      },
      {
        path: themMoiHoSoCOUrl,
        element: <ThemMoiHoSoCO />,
        // element: (
        //   <ProtectedComponent
        //     Element={ThemMoiHoSoCO}
        //     url={themMoiHoSoCOUrl}
        //     title={"Thêm mới hồ sơ C/O"}
        //   />
        // ),
      },
      {
        path: quanLyDVMoTKUrl,
        element: <Navigate to={danhSachDVMoTKUrl} />,
      },
      {
        path: danhSachDVMoTKUrl,
        // element: <DanhSachDVVaMoTKPage />,
        element: (
          <ProtectedComponent
            Element={DanhSachDVVaMoTKPage}
            url={danhSachDVMoTKUrl}
            title={"Danh sách dịch vụ mở tờ khai"}
          />
        ),
      },
      {
        path: quanLyToKhaiUrl,
        element: <Navigate to={danhSachToKhaiNhapUrl} />,
      },
      {
        path: danhSachToKhaiNhapUrl,
        // element: <ListImportDeclarationPage />,
        element: (
          <ProtectedComponent
            Element={ListImportDeclarationPage}
            url={danhSachToKhaiNhapUrl}
            title={"Danh sách tờ khai nhập khẩu"}
          />
        ),
      },
      {
        path: danhSachToKhaiXuatUrl,
        // element: <ListExportDeclarationPage />,
        element: (
          <ProtectedComponent
            Element={ListExportDeclarationPage}
            url={danhSachToKhaiXuatUrl}
            title={"Danh sách tờ khai xuất khẩu"}
          />
        ),
      },
      {
        path: exportDeclarationExpectedUrl,
        // element: <ListExportDeclarationPage />,
        element: (
          <ProtectedComponent
            Element={ListExportDeclarationExpectedPage}
            url={exportDeclarationExpectedUrl}
            title={"Danh sách tờ khai xuất dự kiến"}
          />
        ),
      },
      {
        path: quanLyHoaDonVATUrl,
        element: <Navigate to={danhSachHoaDonVATUrl} />,
      },
      {
        path: danhSachHoaDonVATUrl,
        // element: <DanhSachHoaDonVatPage />,
        element: (
          <ProtectedComponent
            Element={DanhSachHoaDonVatPage}
            url={quanLyHoaDonVATUrl}
            title={"Danh sách hóa đơn VAT"}
          />
        ),
      },
      {
        path: danhSachMappingVATUrl,
        // element: <ListMappingVatPage />,
        element: (
          <ProtectedComponent
            Element={ListMappingVatPage}
            url={danhSachMappingVATUrl}
            title={"Danh sách mapping VAT"}
          />
        ),
      },
      {
        path: cauHinhHeThongUrl,
        element: <Navigate to={danhSachDinhMucSanPhamUrl} />,
      },
      {
        path: danhSachSpUrl,
        // element: <DanhSachSanPhamPage />,
        element: (
          <ProtectedComponent
            Element={DanhSachSanPhamPage}
            url={danhSachSpUrl}
            title={"Danh sách sản phẩm"}
          />
        ),
      },
      {
        path: danhSachDinhMucSanPhamUrl,
        // element: <DanhSachDinhMucSpPage />,
        element: (
          <ProtectedComponent
            Element={DanhSachDinhMucSpPage}
            url={danhSachDinhMucSanPhamUrl}
            title={"Danh sách định mức sản phẩm"}
          />
        ),
      },
      {
        path: danhSachKHUrl,
        // element: <QuanLyKhachHangPage />,
        element: (
          <ProtectedComponent
            Element={QuanLyKhachHangPage}
            url={danhSachKHUrl}
            title={"Danh sách khách hàng"}
          />
        ),
      },
      {
        path: danhSachNDUrl,
        // element: <QuanLyNguoiDungPage />,
        element: (
          <ProtectedComponent
            Element={QuanLyNguoiDungPage}
            url={danhSachNDUrl}
            title={"Danh sách nhân viên"}
          />
        ),
      },
      {
        path: danhSachPhiUrl,
        // element: <ListFeesPage />,
        element: (
          <ProtectedComponent
            Element={ListFeesPage}
            url={danhSachPhiUrl}
            title={"Danh sách phí"}
          />
        ),
      },
      {
        path: listUnitUrl,
        element: (
          <ProtectedComponent
            Element={ListUnitsPage}
            url={listUnitUrl}
            title={"Danh sách đơn vị"}
          />
        ),
      },
      {
        path: listPSRUrl,
        element: (
          <ProtectedComponent
            Element={ListPSRPage}
            url={listPSRUrl}
            title={"Danh mục PSR"}
          />
        ),
      },
      {
        path: URL_AUTHORIZATION,
        element: <Navigate to={URL_USER} />,
      },
      {
        path: URL_FUNCTION,
        // element: <FunctionPage />,
        element: (
          <ProtectedComponent
            Element={FunctionPage}
            title="Quản lý tính năng"
            url={URL_FUNCTION}
          />
        ),
      },
      {
        path: URL_ROLE,
        // element: <RolePage />,
        element: (
          <ProtectedComponent
            Element={RolePage}
            title="Quản lý nhóm quyền"
            url={URL_ROLE}
          />
        ),
      },
      {
        path: URL_USER,
        // element: <UserPage />,
        element: (
          <ProtectedComponent
            Element={UserPage}
            title="Quản lý người dùng"
            url={URL_USER}
          />
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
