import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export type CreateDTO = {
  list_detail: any[];
  lu_user_id: string;
};

export const createCoUnit = async (data: CreateDTO): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/co-documents/convert-unit-update`,
    data,
  );

  return res.data;
};

type UseCreateCoUnitOptions = {
  config?: MutationConfig<typeof createCoUnit>;
};

export const useCreateCoUnit = ({ config }: UseCreateCoUnitOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createCoUnit,
  });
};
