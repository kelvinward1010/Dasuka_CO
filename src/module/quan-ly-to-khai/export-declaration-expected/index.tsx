import { lazyLoad } from "@/utils/loadable";

export const ListExportDeclarationExpectedPage = lazyLoad(
  () => import("./views/ListExportExpected"),
  (module) => module.ListExportDeclarationExpected,
);
