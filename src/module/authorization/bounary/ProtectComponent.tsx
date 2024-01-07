import { useEffect } from "react";
import { useRecoilValue } from "recoil";

import { NotAuthorizationPage } from "@/module/error/403";
import { getUserSelector } from "@/store/auth/state";

import { checkPermissionTree } from "../utils/recursive";

export default function ProtectedComponent({
  Element,
  title = "C/O",
  url,
}: {
  Element: any;
  title?: string;
  url: string;
}) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const permissions = useRecoilValue(getUserSelector);

  return checkPermissionTree(permissions?.functions, url) ? (
    <Element />
  ) : (
    <NotAuthorizationPage />
  );
}
