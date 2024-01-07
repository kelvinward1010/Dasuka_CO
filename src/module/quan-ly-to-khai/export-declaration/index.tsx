import { lazyLoad } from "@/utils/loadable";

export const ListExportDeclarationPage = lazyLoad(
  () => import("./views/ListExportDeclaration"),
  (module) => module.ListExportDeclaration,
);
