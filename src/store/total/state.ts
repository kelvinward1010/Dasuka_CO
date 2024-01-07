import { selector } from "recoil";

import {
  total1LvcAddState,
  total1LvcState,
  total1RvcAddState,
  total1RvcState,
  total2LvcAddState,
  total2LvcState,
  total2RvcAddState,
  total2RvcState,
  total3LvcAddState,
  total3LvcState,
  total3RvcAddState,
  total3RvcState,
  totalCCState,
  totalCTHState,
  totalCTSHState,
  totalPageState,
  valueCifAddLvcState,
  valueCifAddRvcState,
  valueCifLvcState,
  valueCifRvcState,
} from "./atom";

export const total1Lvc: any = selector({
  key: "total1lvc",
  get: ({ get }) => {
    const total1lvc = get(total1LvcState);
    return total1lvc;
  },
});

export const total2Lvc: any = selector({
  key: "total2lvc",
  get: ({ get }) => {
    const tota21lvc = get(total2LvcState);
    return tota21lvc;
  },
});

export const total3Lvc: any = selector({
  key: "total3lvc",
  get: ({ get }) => {
    const tota31lvc = get(total3LvcState);
    return tota31lvc;
  },
});

export const totalCC: any = selector({
  key: "totalCC",
  get: ({ get }) => {
    const totalCC = get(totalCCState);
    return totalCC;
  },
});

export const totalCTH: any = selector({
  key: "totalCTH",
  get: ({ get }) => {
    const totalCTH = get(totalCTHState);
    return totalCTH;
  },
});

export const totalCTSH: any = selector({
  key: "totalCTSH",
  get: ({ get }) => {
    const totalCTSH = get(totalCTSHState);
    return totalCTSH;
  },
});

export const total1LvcAdd: any = selector({
  key: "total1lvcadd",
  get: ({ get }) => {
    const total1lvcadd = get(total1LvcAddState);
    return total1lvcadd;
  },
});

export const total2LvcAdd: any = selector({
  key: "total2lvcadd",
  get: ({ get }) => {
    const tota21lvcadd = get(total2LvcAddState);
    return tota21lvcadd;
  },
});

export const total3LvcAdd: any = selector({
  key: "total3lvcadd",
  get: ({ get }) => {
    const tota31lvcadd = get(total3LvcAddState);
    return tota31lvcadd;
  },
});

export const valueCifLVC: any = selector({
  key: "valueciflvc",
  get: ({ get }) => {
    const valueciflvc = get(valueCifLvcState);
    return valueciflvc;
  },
});

export const valueAddCifLVC: any = selector({
  key: "valueaddciflvc",
  get: ({ get }) => {
    const valueaddciflvc = get(valueCifAddLvcState);
    return valueaddciflvc;
  },
});

export const total1Rvc: any = selector({
  key: "total1rvc",
  get: ({ get }) => {
    const total1rvc = get(total1RvcState);
    return total1rvc;
  },
});

export const total2Rvc: any = selector({
  key: "total2rvc",
  get: ({ get }) => {
    const tota21rvc = get(total2RvcState);
    return tota21rvc;
  },
});

export const total3Rvc: any = selector({
  key: "total3rvc",
  get: ({ get }) => {
    const tota31rvc = get(total3RvcState);
    return tota31rvc;
  },
});

export const total1RvcAdd: any = selector({
  key: "total1rvcadd",
  get: ({ get }) => {
    const total1rvcadd = get(total1RvcAddState);
    return total1rvcadd;
  },
});

export const total2RvcAdd: any = selector({
  key: "total2rvcadd",
  get: ({ get }) => {
    const tota21rvcadd = get(total2RvcAddState);
    return tota21rvcadd;
  },
});

export const total3RvcAdd: any = selector({
  key: "total3rvcadd",
  get: ({ get }) => {
    const tota31rvcadd = get(total3RvcAddState);
    return tota31rvcadd;
  },
});

export const valueCifRVC: any = selector({
  key: "valuecifrvc",
  get: ({ get }) => {
    const valuecifrvc = get(valueCifRvcState);
    return valuecifrvc;
  },
});

export const valueAddCifRVC: any = selector({
  key: "valueaddcifrvc",
  get: ({ get }) => {
    const valueaddcifrvc = get(valueCifAddRvcState);
    return valueaddcifrvc;
  },
});

export const getTotalPageSelector = selector({
  key: "getTotalPageSelector",
  get: ({ get }) => {
    const total = get(totalPageState);
    return total;
  },
});
