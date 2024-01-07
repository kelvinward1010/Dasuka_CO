import { lazyLoad } from "@/utils/loadable";

export const ListMaterialReportPage = lazyLoad(
  () => import("./views/ListMaterialReport"),
  (module) => module.ListMaterialReport,
);
