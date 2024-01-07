import { lazyLoad } from "@/utils/loadable";

export const ListPSRPage = lazyLoad(
  () => import("./views/ManagePSR"),
  (module) => module.ManagePSR,
);
