import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteFee = async (
  data: IBaseDeleteItems<{
    fee_id: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/fees/delete`, data);

  return res.data;
};

type UseDeleteFeeOptions = {
  config?: MutationConfig<typeof deleteFee>;
};

export const useDeleteFee = ({ config }: UseDeleteFeeOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["fees"]);
    },
    ...config,
    mutationFn: deleteFee,
  });
};
