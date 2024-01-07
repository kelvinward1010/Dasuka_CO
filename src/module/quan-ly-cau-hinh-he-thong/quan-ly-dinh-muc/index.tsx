import { lazyLoad } from "@/utils/loadable";

export const DanhSachDinhMucSpPage = lazyLoad(
  () => import("./views/DanhSachDinhMuc"),
  (module) => module.DanhSachDinhMuc,
);
