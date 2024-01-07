import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteQLND = async (
  data: IBaseDeleteItems<{
    employee_id: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/employees/delete`, data);

  return res.data;
};

type UseDeleteQLNDOptions = {
  config?: MutationConfig<typeof deleteQLND>;
};

export const useDeleteQLND = ({ config }: UseDeleteQLNDOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["qlnds"]);
    },
    ...config,
    mutationFn: deleteQLND,
  });
};
