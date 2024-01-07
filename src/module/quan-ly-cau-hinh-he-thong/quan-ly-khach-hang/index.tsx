import { lazyLoad } from "@/utils/loadable";

export const QuanLyKhachHangPage = lazyLoad(
  () => import("./views/QuanLyKhachHangV2"),
  (module) => module.QuanLyKhanhHangV2,
);
