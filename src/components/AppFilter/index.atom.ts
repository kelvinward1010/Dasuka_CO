import { atom } from "recoil";

export const staffState = atom({
  key: "staff-state",
  default: {
    label: "",
    value: "",
  },
});

export const customerState = atom({
  key: "customer-state",
  default: {
    label: "",
    value: "",
    tax_code: "",
    processing_fee: -1,
  },
});
