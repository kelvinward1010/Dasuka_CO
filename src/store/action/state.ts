import { RecoilValueReadOnly, selector } from "recoil";

import { dataLackedMaterialState } from "./atom";

export const getLackedCOSelector: RecoilValueReadOnly<number> = selector({
  key: "getLackedCOSelector",
  get: ({ get }) => {
    const getLacked = get(dataLackedMaterialState);
    return getLacked;
  },
});
