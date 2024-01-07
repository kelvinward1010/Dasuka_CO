import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteQLKH = async (
  data: IBaseDeleteItems<{
    customer_id: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/customers/delete`, data);

  return res.data;
};

type UseDeleteQLKHOptions = {
  config?: MutationConfig<typeof deleteQLKH>;
};

export const useDeleteQLKH = ({ config }: UseDeleteQLKHOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["qlkhs"]);
    },
    ...config,
    mutationFn: deleteQLKH,
  });
};
