import { lazyLoad } from "@/utils/loadable";

export const DanhSachHoaDonVatPage = lazyLoad(
  () => import("./danh-sach-hoa-don-vat/views/QuanLyHoaDonVat"),
  (module) => module.QuanLyHoaDonVat,
);

export const ListMappingVatPage = lazyLoad(
  () => import("./danh-sach-mapping-vat/views/ListMappingVAT"),
  (module) => module.ListMappingVAT,
);
