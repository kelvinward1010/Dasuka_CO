import { lazyLoad } from "@/utils/loadable";

export const QuanLyNguoiDungPage = lazyLoad(
  () => import("./views/QuanLyNguoiDungV2"),
  (module) => module.QuanLyNguoiDungV2,
);
