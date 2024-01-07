import { lazyLoad } from "@/utils/loadable";

export const RolePage = lazyLoad(
  () => import("./views/ListRole"),
  (module) => module.ListRole,
);
