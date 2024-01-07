import { atom, selector } from "recoil";

export const sanPhamByMaHHState = atom<any>({
  key: "san-pham-chi-tiet-by-ma-hh",
  default: {},
});

export const sanPhamState = atom<any[]>({
  key: "san-pham-chi-tiet-state",
  default: [],
});

export const isDoneCoState = atom({
  key: "is-done-co-state",
  default: false,
});

export const sanPhamSelector = selector({
  key: "san-pham-chi-tiet-selector",
  get: ({ get }) => {
    const sanPhamByMaHH = get(sanPhamByMaHHState);
    const sanPham = get(sanPhamState);

    const spIndex = sanPham?.findIndex(
      (i: { ma_hh: string; stk: string; key?: number }) => {
        return sanPhamByMaHH.key
          ? i.ma_hh === sanPhamByMaHH.ma_hh &&
              i.stk === sanPhamByMaHH.stk &&
              i.key === sanPhamByMaHH.key
          : sanPhamByMaHH.ma_hh && i.stk === sanPhamByMaHH.stk;
      },
    );

    if (spIndex === -1)
      return {
        sanPham: {},
        spIndex: -1,
      };

    return {
      sanPham: sanPham?.[spIndex],
      spIndex,
    };
  },
});

export const dataDropdownExportState = atom({
  key: "dataDropdownExportState",
  default: [
    {
      label: "",
      value: "",
      shipping_terms: "",
      export_licence_number: "",
    },
  ],
});
