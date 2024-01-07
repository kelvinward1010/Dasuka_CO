import { lazyLoad } from "@/utils/loadable";

export const ListFeesPage = lazyLoad(
  () => import("./views/QuanLyPhi"),
  (module) => module.QuanLyPhi,
);
