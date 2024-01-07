import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IProduct } from "../types";

export type UpdateProductDTO = IProduct;

export const updateProduct = async (data: UpdateProductDTO): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/products/update`, data);

  return res.data;
};

type UseUpdateProductOptions = {
  config?: MutationConfig<typeof updateProduct>;
};

export const useUpdateProduct = ({ config }: UseUpdateProductOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateProduct,
  });
};
