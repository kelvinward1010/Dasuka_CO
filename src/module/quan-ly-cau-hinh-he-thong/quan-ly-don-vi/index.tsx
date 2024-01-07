import { lazyLoad } from "@/utils/loadable";

export const ListUnitsPage = lazyLoad(
  () => import("./views/ManageUnit"),
  (module) => module.ManageUnit,
);
