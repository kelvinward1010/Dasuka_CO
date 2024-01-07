import { atom } from "recoil";

export const resultCCState = atom({
  key: "resultCCState",
  default: "0",
});

export const resultCTHState = atom({
  key: "resultCTHState",
  default: "0",
});

export const resultCTSHState = atom({
  key: "resultCTSHState",
  default: "0",
});

export const chonSanPham = atom<string | undefined>({
  key: "chonSanPham",
  default: "",
});

export const isCheckedLackedState = atom<boolean>({
  key: "isCheckedLacked",
  default: false,
});
