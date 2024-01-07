import { lazyLoad } from "@/utils/loadable";

export const FunctionPage = lazyLoad(
  () => import("./views/ListFunction"),
  (module) => module.ListFunction,
);
