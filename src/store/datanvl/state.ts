import { selector } from "recoil";

import {
  DataNvlDetailState,
  DataNvlPEandWoAkState,
  DataNvlWoNonVatState,
  DataNvlWoVatState,
  DataNvltate,
  DataSelectedState,
  DataTb1LvcCTState,
  DataTb1LvcState,
  DataTb1RvcCTState,
  DataTb1RvcState,
  DataTb2LvcAddState,
  DataTb2LvcCTState,
  DataTb2RvcAddState,
  DataTb2RvcCTState,
  DataTb3LvcAddState,
  DataTb3LvcCTState,
  DataTb3RvcAddState,
  DataTb3RvcCTState,
  DataTbCcCTState,
  DataTbCcState,
  DataTbCthCTState,
  DataTbCthState,
  DataTbCtshCTState,
  DataTbCtshState,
  DataTbPECTState,
  DataTbWoAKCTState,
  DataTbWoCTState,
  DataTbWoNonVatCTState,
} from "./atom";

export const dataNVL: any = selector({
  key: "dataNvl",
  get: ({ get }) => {
    const dataNvl = get(DataNvltate);
    return dataNvl;
  },
});

export const dataNVLWoVat: any = selector({
  key: "dataNVLWoVat",
  get: ({ get }) => {
    const dataNVLWoVat = get(DataNvlWoVatState);
    return dataNVLWoVat;
  },
});

export const dataNVLWoNonVat: any = selector({
  key: "dataNVLWoNonVat",
  get: ({ get }) => {
    const dataNVLWoNonVat = get(DataNvlWoNonVatState);
    return dataNVLWoNonVat;
  },
});

export const dataNVLPeandWoakVat: any = selector({
  key: "dataNVLPeandWoakVat",
  get: ({ get }) => {
    const dataNVLPeandWoakVat = get(DataNvlPEandWoAkState);
    return dataNVLPeandWoakVat;
  },
});

export const dataNVLDetail: any = selector({
  key: "dataNvlDetail",
  get: ({ get }) => {
    const dataNvldetail = get(DataNvlDetailState);
    return dataNvldetail;
  },
});

// ADD DATA
// LVC

export const dataTb1Lvc: any = selector({
  key: "dataTb1Lvc",
  get: ({ get }) => {
    const dataTb1Lvc = get(DataTb1LvcState);
    return dataTb1Lvc;
  },
});

export const dataTb2LvcAdd: any = selector({
  key: "dataTb2Lvcadd",
  get: ({ get }) => {
    const dataTb2Lvcadd = get(DataTb2LvcAddState);
    return dataTb2Lvcadd;
  },
});

export const dataTb3LvcAdd: any = selector({
  key: "dataTb3Lvcadd",
  get: ({ get }) => {
    const dataTb3Lvcadd = get(DataTb3LvcAddState);
    return dataTb3Lvcadd;
  },
});

// RVC

export const dataTb1Rvc: any = selector({
  key: "dataTb1Rvc",
  get: ({ get }) => {
    const dataTb1Rvc = get(DataTb1RvcState);
    return dataTb1Rvc;
  },
});

export const dataTb2RvcAdd: any = selector({
  key: "dataTb2RvcAdd",
  get: ({ get }) => {
    const dataTb2Rvcadd = get(DataTb2RvcAddState);
    return dataTb2Rvcadd;
  },
});

export const dataTb3RvcAdd: any = selector({
  key: "dataTb3RvcAdd",
  get: ({ get }) => {
    const dataTb3RvcAdd = get(DataTb3RvcAddState);
    return dataTb3RvcAdd;
  },
});

// CTC

export const dataTbCc: any = selector({
  key: "dataTbCc",
  get: ({ get }) => {
    const dataTbCc = get(DataTbCcState);
    return dataTbCc;
  },
});

export const dataTbCth: any = selector({
  key: "dataTbCth",
  get: ({ get }) => {
    const dataTbCth = get(DataTbCthState);
    return dataTbCth;
  },
});

export const dataTbCtsh: any = selector({
  key: "dataTbCtsh",
  get: ({ get }) => {
    const dataTbCtsh = get(DataTbCtshState);
    return dataTbCtsh;
  },
});

//Chi Tiet Data
// LVC

export const dataTb1LvcCT: any = selector({
  key: "dataTb1LvcCT",
  get: ({ get }) => {
    const dataTb1LvcCT = get(DataTb1LvcCTState);
    return dataTb1LvcCT;
  },
});

export const dataTb2LvcCT: any = selector({
  key: "dataTb2LvcCT",
  get: ({ get }) => {
    const dataTb2LvcCT = get(DataTb2LvcCTState);
    return dataTb2LvcCT;
  },
});

export const dataTb3LvcCT: any = selector({
  key: "dataTb3LvcCT",
  get: ({ get }) => {
    const dataTb3LvcCT = get(DataTb3LvcCTState);
    return dataTb3LvcCT;
  },
});

// RVC

export const dataTb1RvcCT: any = selector({
  key: "dataTb1RvcCT",
  get: ({ get }) => {
    const dataTb1RvcCT = get(DataTb1RvcCTState);
    return dataTb1RvcCT;
  },
});

export const dataTb2RvcCT: any = selector({
  key: "dataTb2RvcCT",
  get: ({ get }) => {
    const dataTb2RvcCT = get(DataTb2RvcCTState);
    return dataTb2RvcCT;
  },
});

export const dataTb3RvcCT: any = selector({
  key: "dataTb3RvcCT",
  get: ({ get }) => {
    const dataTb3RvcCT = get(DataTb3RvcCTState);
    return dataTb3RvcCT;
  },
});

// CTC

export const dataTbCcCT: any = selector({
  key: "dataTbCcCT",
  get: ({ get }) => {
    const dataTbCcCT = get(DataTbCcCTState);
    return dataTbCcCT;
  },
});

export const dataTbCthCT: any = selector({
  key: "dataTbCthCT",
  get: ({ get }) => {
    const dataTbCthCT = get(DataTbCthCTState);
    return dataTbCthCT;
  },
});

export const dataTbCtshCT: any = selector({
  key: "dataTbCtshCT",
  get: ({ get }) => {
    const dataTbCtshCT = get(DataTbCtshCTState);
    return dataTbCtshCT;
  },
});

export const dataTbWoCT: any = selector({
  key: "dataTbWoCT",
  get: ({ get }) => {
    const dataTbWoCT = get(DataTbWoCTState);
    return dataTbWoCT;
  },
});

export const dataTbWoNonVatCT: any = selector({
  key: "dataTbWoNonVatCT",
  get: ({ get }) => {
    const dataTbWoNonVatCT = get(DataTbWoNonVatCTState);
    return dataTbWoNonVatCT;
  },
});

export const dataTbWoAKCT: any = selector({
  key: "dataTbWoAKCT",
  get: ({ get }) => {
    const dataTbWoAKCT = get(DataTbWoAKCTState);
    return dataTbWoAKCT;
  },
});

export const dataTbPECT: any = selector({
  key: "dataTbPECT",
  get: ({ get }) => {
    const dataTbPECT = get(DataTbPECTState);
    return dataTbPECT;
  },
});

export const dataSelected: any = selector({
  key: "dataSelected",
  get: ({ get }) => {
    const dataSelected = get(DataSelectedState);
    return dataSelected;
  },
});
