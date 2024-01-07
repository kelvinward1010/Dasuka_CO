import { selector } from "recoil";

import { DataUserState } from "./atom";

export const getUserSelector = selector({
  key: "getUserSelector",
  get: ({ get }) => {
    const data = get(DataUserState);
    return data;
  },
});
