import { atom } from "recoil";

export const handleSaveCoState = atom<() => void>({
  key: "handleSaveCoState",
  default: () => {},
});

export const dataLackedMaterialState = atom<number>({
  key: "dataLackedMaterialState",
  default: 0,
});
