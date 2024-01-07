import { atom } from "recoil";

export const chooseNVState = atom({
  key: "chooseNVState",
  default: "all",
});

export const chooseKHState = atom({
  key: "chooseKHState",
  default: "all",
});

export const chooseTabState = atom({
  key: "chooseTab",
  default: "",
});

export const chooseNormState = atom({
  key: "chooseNormState",
  default: "",
});

export const chooseFormCOState = atom({
  key: "chooseFormCOState",
  default: "",
});

export const chooseFOBState = atom({
  key: "chooseFOBState",
  default: "",
});

export const dataListCriteriaState = atom({
  key: "dataListCriteriaState",
  default: [],
});
