import { atom } from "recoil";

export const dataNoticeState = atom({
  key: "dataNoticeState",
  default: {
    target: "",
    type: 0, // type 1: edit, type 2: delete
    sender: "",
    sender_id: "",
  },
});
