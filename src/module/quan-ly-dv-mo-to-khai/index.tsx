import { lazyLoad } from "@/utils/loadable";

export const DanhSachDVVaMoTKPage = lazyLoad(
  () => import("./views/QuanLyDVMoToKhai"),
  (module) => module.QuanLyDVMoToKhai,
);
