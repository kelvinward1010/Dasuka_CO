import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteFunction = async (
  data: IBaseDeleteItems<{
    function_id: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(`${API_CORE}/function/delete`, data);

  return res.data;
};

type UseDeleteFunctionOptions = {
  config?: MutationConfig<typeof deleteFunction>;
};

export const useDeleteFunction = ({
  config,
}: UseDeleteFunctionOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: deleteFunction,
  });
};
