import { lazyLoad } from "@/utils/loadable";

export const ListImportDeclarationPage = lazyLoad(
  () => import("./views/ListImportDeclaration"),
  (module) => module.ListImportDeclaration,
);
