import { lazyLoad } from "@/utils/loadable";

export const DashboardPage = lazyLoad(
  () => import("./views/Dashboard"),
  (module) => module.Dashboard,
);
