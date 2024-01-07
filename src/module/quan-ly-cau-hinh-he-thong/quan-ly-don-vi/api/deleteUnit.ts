import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteUnit = async (
  data: IBaseDeleteItems<{
    unit_id: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/units/delete`, data);

  return res.data;
};

type UseDeleteUnitOptions = {
  config?: MutationConfig<typeof deleteUnit>;
};

export const useDeleteUnit = ({ config }: UseDeleteUnitOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["units"]);
    },
    ...config,
    mutationFn: deleteUnit,
  });
};
