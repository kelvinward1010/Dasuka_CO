import { atom } from "recoil";

// User
export const DataUserState = atom({
  key: "DataUserState",
  default: {
    user_id: "",
    user_name: "",
    full_name: "",
    functions: [],
    actions: [""],
    avatar: "",
    date_of_birth: "",
  },
});
