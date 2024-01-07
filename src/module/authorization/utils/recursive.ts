import { DataNode } from "antd/es/tree";

export const getNodeFromTree = (tree: DataNode[], function_id: string): any => {
  const stack: DataNode[] = [...tree];

  while (stack.length > 0) {
    const node = stack.pop();

    if (node?.key === function_id) {
      return node;
    }

    if (node?.children) {
      stack.push(...node.children);
    }
  }

  return null;
};

export const checkPermissionTree = (tree: any[] = [], url: string): boolean => {
  const stack: any[] = [...tree];

  while (stack.length > 0) {
    const node = stack.pop();

    if (node?.["url"] === url) {
      return true;
    }

    if (node?.children) {
      stack.push(...node.children);
    }
  }

  return false;
};
