import { selector } from "recoil";

import {
  chooseFOBState,
  chooseFormCOState,
  chooseKHState,
  chooseNVState,
  chooseNormState,
  chooseTabState,
} from "./atom";

export const chooseNv: any = selector({
  key: "choosenv",
  get: ({ get }) => {
    const choosenv = get(chooseNVState);
    return choosenv;
  },
});

export const chooseKh: any = selector({
  key: "choosekh",
  get: ({ get }) => {
    const choosekh = get(chooseKHState);
    return choosekh;
  },
});

export const chooseTab: any = selector({
  key: "choosetab",
  get: ({ get }) => {
    const choosetab = get(chooseTabState);
    return choosetab;
  },
});

export const chooseNormSelector = selector({
  key: "chooseNormSelector",
  get: ({ get }) => {
    const chooseNorm = get(chooseNormState);
    return chooseNorm;
  },
});

export const chooseFormCOSelector = selector({
  key: "chooseFormCOSelector",
  get: ({ get }) => {
    const chooseFormCO = get(chooseFormCOState);
    return chooseFormCO;
  },
});

export const chooseFOBSelector = selector({
  key: "chooseFOBSelector",
  get: ({ get }) => {
    const chooseFOB = get(chooseFOBState);
    return chooseFOB;
  },
});
