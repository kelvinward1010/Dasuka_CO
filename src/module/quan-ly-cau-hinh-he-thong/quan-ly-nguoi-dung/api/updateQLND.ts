import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IEmployee } from "../types";

export type UpdateQLNDDTO = Pick<
  IEmployee,
  | "employee_id"
  | "fullname"
  | "phone_number"
  | "email"
  | "department_name"
  | "position_name"
  | "employee_customer"
>;

export const updateQLND = (data: UpdateQLNDDTO): Promise<any> => {
  return apiClient
    .post(`${API_CO}/employees/update`, data)
    .then((res) => res.data);
};

type UseUpdateQLNDOptions = {
  config?: MutationConfig<typeof updateQLND>;
};

export const useUpdateQLND = ({ config }: UseUpdateQLNDOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateQLND,
  });
};
