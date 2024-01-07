import { selector } from "recoil";

import { dataNoticeState } from "./atom";

export const getNoticeSelector = selector({
  key: "getNoticeSelector",
  get: ({ get }) => {
    const data = get(dataNoticeState);
    return data;
  },
});
