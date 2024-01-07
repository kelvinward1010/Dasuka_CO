import { lazyLoad } from "@/utils/loadable";

export const DanhSachSanPhamPage = lazyLoad(
  () => import("./views/QuanLySanPham"),
  (module) => module.QuanLySanPham,
);
