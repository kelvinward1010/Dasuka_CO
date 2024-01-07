import { lazyLoad } from "@/utils/loadable";

export const UserPage = lazyLoad(
  () => import("./views/ListUser"),
  (module) => module.ListUser,
);
