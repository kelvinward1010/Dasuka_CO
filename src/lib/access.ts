import { LOCAL_USER } from "@/constant/config";
import { storageService } from "@/utils/storage";

export const ACCESSES = {
  ADD_CUSTOMER: "customer_add",
  CO_CANCEL: "co_cancel",
  CO_EDIT: "co_edit",
  CO_EMPLOYEE_DROPDOWN: "co_employee_dropdown",
};

export const checkAccess = (role: string) => {
  const roles = storageService.getStorage(LOCAL_USER)?.actions || [];
  return roles.includes(role);
};
