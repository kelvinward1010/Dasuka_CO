import { atom } from "recoil";

export const functionState = atom({
  key: "functionState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});

export const functionRoleState = atom({
  key: "functionRoleState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});

export const roleState = atom({
  key: "roleState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});

export const changedActionState = atom({
  key: "changedActionState", // unique ID (with respect to other atoms/
  default: {
    isChanged: false,
    fn: function () {},
  }, // default value (aka)
});
