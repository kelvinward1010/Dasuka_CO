import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteProduct = async (
  data: IBaseDeleteItems<{
    product_id: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/products/delete`, data);

  return res.data;
};

type UseDeleteProductOptions = {
  config?: MutationConfig<typeof deleteProduct>;
};

export const useDeleteProduct = ({ config }: UseDeleteProductOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    ...config,
    mutationFn: deleteProduct,
  });
};
