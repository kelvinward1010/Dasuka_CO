import type { ProLayoutProps } from "@ant-design/pro-components";
import { Link } from "react-router-dom";

import {
  CauHinhHeThongIcon,
  DashboardIcon,
  QuanLyDinhMucIcon,
  QuanLyHoSoCOIcon,
  QuanLyHoaDonVatIcon,
  QuanLyToKhaiIcon,
} from "@/assets/svg";
import { trangChuUrl } from "@/urls";

export const appRoute = (permissions: any[]): ProLayoutProps["route"] => {
  const routes = [...generateRoutes(permissions)].sort(
    (a, b) => a.sort - b.sort,
  );
  return {
    path: trangChuUrl,
    routes,
  };
};

const generateRoutes = (tree: any[] = []) => {
  const routes = [];
  const stack = [];

  // Push the root node onto the stack with an empty prefix

  for (let i = 0; i < tree.length; i++) {
    stack.push(tree[i]);
    while (stack.length > 0) {
      const node: any = stack.pop();

      // Create a route by appending the current node's name to the prefix
      const route: any = {
        path: node?.url,
        title: node.title,
        name: <Link to={node?.url}>{node?.title}</Link>,
        // node?.children?.length === 0 ? (
        // ) : (
        //   node?.title
        // ),
        icon: renderIcon(node.url),
        routes: [],
        sort: node.sort_order,
      };

      // Push the child nodes onto the stack in reverse order to maintain correct order during traversal
      for (let i = node?.children?.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
        route.routes.unshift({
          path: node.children[i].url,
          title: node.title,
          name:
            node.children[i]?.children?.length === 0 ? (
              <Link to={node.children[i].url}>{node.children[i].title}</Link>
            ) : (
              node?.children[i].title
            ),
          icon: renderIcon(node.children[i].url),
          sort: node.children[i]?.sort_order,
        });
      }

      if (tree[i]?.children?.length <= 0 || node?.children?.length !== 0)
        routes.push(route);
    }
  }

  return routes;
};

const renderIcon = (url: string) => {
  url = url.split("/")[url.split("/").length - 1].toLowerCase();
  switch (url) {
    case "dashboard":
      return <DashboardIcon />;
    case "quan-ly-ho-so-c-o":
      return <QuanLyHoSoCOIcon />;
    case "quan-ly-hoa-don-vat":
      return <QuanLyHoaDonVatIcon />;
    case "quan-ly-to-khai":
      return <QuanLyToKhaiIcon />;
    case "cau-hinh-he-thong":
      return <CauHinhHeThongIcon />;
    case "danh-sach-dv-mo-tk":
      return <QuanLyDinhMucIcon />;
    case "authorization":
      return <CauHinhHeThongIcon />;
    default:
      break;
  }
};
