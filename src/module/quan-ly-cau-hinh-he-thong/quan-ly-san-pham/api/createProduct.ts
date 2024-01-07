import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IProduct } from "../types";

export type CreateProductDTO = IProduct;

export const createProduct = (data: CreateProductDTO): Promise<any> => {
  return apiClient
    ?.post(`${API_CO}/products/create`, data)
    .then((res) => res.data);
};

type UseCreateProductOptions = {
  config?: MutationConfig<typeof createProduct>;
};

export const useCreateProduct = ({ config }: UseCreateProductOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createProduct,
  });
};

// export const RULES_EMPLOYEE_CREATE: Record<keyof CreateProductDTO, FormRule[]> = {
//   employee_id: [
//     {
//       required: true,
//       message: "Mã người dùng không được để trống",
//     },
//   ],
//   fullname: [
//     {
//       required: true,
//       message: "Tên người dùng không được để trống",
//     },
//   ],
//   phone_number: [
//     {
//       required: true,
//       message: "Số điện thoại không được để trống",
//     },
//   ],
//   email: [
//     {
//       required: true,
//       message: "Email không được để trống",
//     },
//   ],
//   password: [
//     {
//       required: true,
//       message: "Password không được để trống",
//     },
//   ],
//   position_id: [
//     {
//       required: true,
//       message: "Chức vụ không được để trống",
//     },
//   ],
//   position_name: [
//     {
//       required: true,
//       message: "Chức vụ không được để trống",
//     },
//   ],
//   department_id: [
//     {
//       required: true,
//       message: "Phòng ban không được để trống",
//     },
//   ],
//   department_name: [
//     {
//       required: true,
//       message: "Phòng ban không được để trống",
//     },
//   ],
//   branch_id: [
//     {
//       required: true,
//       message: "Chi nhánh không được bỏ trống",
//     },
//   ],
//   branch_name: [
//     {
//       required: true,
//       message: "Chi nhánh không được bỏ trống",
//     },
//   ],
//   list_json_employee_customer: [],
// };
