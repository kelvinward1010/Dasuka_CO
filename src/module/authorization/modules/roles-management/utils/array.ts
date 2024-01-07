import _ from "lodash";

export const filterNot = (
  origin: any[] = [],
  filter: any[] = [],
  keyFilter: string | number,
) => {
  let result = [];
  result = origin.filter((element) => !filter.includes(element[keyFilter]));
  return result;
};

export const flattenTree = (tree: any = []) => {
  const stack = [...tree];
  const result = [];

  while (stack.length > 0) {
    const node = stack.pop();
    // Add the current node's value to the result
    const { children, ...values } = node;
    result.push({ ...values });

    // Add children to the stack in reverse order
    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.push(node.children[i]);
    }
  }

  return result;
};

export const checkIfNotEnoughLeafs = (
  tree: any[] = [],
  functions: string[] = [],
) => {
  const cloneFunctions = _.clone(functions);

  if (!tree || tree.length === 0) {
    return false; // Return 1 to indicate one leaf node.
  }

  const parentToRemove: string[] = [];

  for (let i = 0; i < tree.length; i++) {
    const children = tree[i].children;
    if (children) {
      const c = children.find(
        (child: any) => !cloneFunctions.includes(child.value),
      );
      checkIfNotEnoughLeafs(children, cloneFunctions);

      if (c) {
        parentToRemove.push(tree[i].value);
      }
    }
  }

  return parentToRemove;
};

export const getFilterArray = (
  origin: any[],
  newArray: any[],
  uniqueKey: string,
) => {
  let result: any[] = [];
  newArray.forEach((n) => {
    if (
      origin.find(
        (o) => o[uniqueKey] === n[uniqueKey] && o.active_flag !== n.active_flag,
      )
    ) {
      result.push(n);
    } else {
      if (n.active_flag) result.push(n);
    }
  });

  return result;
};
