import { lazyLoad } from "@/utils/loadable";

export const ListCoDocumentPage = lazyLoad(
  () => import("./views/ListCoDocument"),
  (module) => module.ListCoDocument,
);
