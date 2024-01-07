import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { INorm } from "../types";

type IGetNormLazyDTO = {
  norm_id: string;
};

export const getNormLazy = async ({
  norm_id,
}: IGetNormLazyDTO): Promise<INorm> => {
  const res = await apiClient.get(`${API_CO}/norms/getbyid/${norm_id}`);
  return res.data;
};

type UseNormLazyOptions = {
  config?: MutationConfig<typeof getNormLazy>;
};

export const useNormLazy = ({ config }: UseNormLazyOptions) => {
  return useMutation({
    ...config,
    mutationFn: getNormLazy,
    mutationKey: ["norm-lazy"],
  });
};
