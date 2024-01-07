import { lazyLoad } from "@/utils/loadable";

export const ChiTietHoSoCO = lazyLoad(
  () => import("./views/chi-tiet-ho-so-co/ChiTietHoSoCo"),
  (module) => module.ChiTietHoSoCO,
);

export const ThemMoiHoSoCO = lazyLoad(
  () => import("./views/them-moi-ho-so-co/ThemMoiHoSoCo"),
  (module) => module.ThemMoiHoSoCO,
);
