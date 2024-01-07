import { FormRule } from "antd";
import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IEmployee } from "../types";

export type CreateQLNDDTO = Pick<
  IEmployee,
  | "employee_id"
  | "fullname"
  | "phone_number"
  | "email"
  | "department_id"
  | "department_name"
  | "position_id"
  | "role_id"
  | "position_name"
  | "list_json_employee_customer"
  | "password"
  | "branch_id"
  | "branch_name"
  | "customer_id"
  | "customer_name"
  | "tax_code"
>;

export const createQLND = async (data: CreateQLNDDTO): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/employees/create`, data);

  return res.data;
};

type UseCreateQLNDOptions = {
  config?: MutationConfig<typeof createQLND>;
};

export const useCreateQLND = ({ config }: UseCreateQLNDOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createQLND,
  });
};

export const RULES_EMPLOYEE_CREATE: Record<keyof CreateQLNDDTO, FormRule[]> = {
  employee_id: [
    {
      required: true,
      message: "Mã người dùng không được để trống",
    },
    {
      pattern: /^[a-zA-Z0-9]{4,10}$/g,
      message: "Mã người dùng phải là chữ hoặc số, độ dài 4 đến 10 ký tự",
    },
  ],
  fullname: [
    {
      required: true,
      message: "Tên người dùng không được để trống",
    },
  ],
  phone_number: [
    {
      required: true,
      message: "Số điện thoại không được để trống",
    },
  ],
  email: [
    {
      required: true,
      message: "Email không được để trống",
    },
  ],
  password: [
    {
      required: true,
      message: "Password không được để trống",
    },
  ],
  position_id: [
    {
      required: true,
      message: "Chức vụ không được để trống",
    },
  ],
  role_id: [
    {
      required: true,
      message: "Nhóm quyền không được để trống",
    },
  ],
  position_name: [
    {
      required: true,
      message: "Chức vụ không được để trống",
    },
  ],
  department_id: [
    {
      required: true,
      message: "Phòng ban không được để trống",
    },
  ],
  department_name: [
    {
      required: true,
      message: "Phòng ban không được để trống",
    },
  ],
  branch_id: [
    {
      required: true,
      message: "Chi nhánh không được bỏ trống",
    },
  ],
  branch_name: [
    {
      required: true,
      message: "Chi nhánh không được bỏ trống",
    },
  ],
  customer_id: [
    {
      required: true,
      message: "Mã khách hàng không được để trống",
    },
  ],
  customer_name: [
    {
      required: true,
      message: "Tên khách hàng không được để trống",
    },
  ],
  tax_code: [
    {
      required: true,
      message: "Mã số thuế không được để trống",
    },
  ],
  list_json_employee_customer: [],
};
