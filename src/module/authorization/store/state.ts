import { selector } from "recoil";

import {
  changedActionState,
  functionRoleState,
  functionState,
  roleState,
} from "./atom";

export const getFunctionIdSelector = selector({
  key: "getFunctionId", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const id = get(functionState);

    return id;
  },
});

export const getFunctionIdRoleSelector = selector({
  key: "getFunctionIdRole", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const id = get(functionRoleState);

    return id;
  },
});

export const getRoleIdSelector = selector({
  key: "getRoleId", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const id = get(roleState);

    return id;
  },
});

export const getChangedActionSelector = selector({
  key: "getChangedAction", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const data = get(changedActionState);

    return data;
  },
});
