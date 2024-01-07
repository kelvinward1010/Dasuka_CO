import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseDropdown } from "@/types";

export const getDropdownStatusDetail = async (
  data: any,
): Promise<IBaseDropdown> => {
  const res = await apiClient.post(
    `${API_CO}/statuss/dropdown-co-detail`,
    data,
  );

  let result: any = [];
  if (res.data?.message) return result;
  else return res.data;
};

type QueryFnType = typeof getDropdownStatusDetail;

type UseDropdownStatusOptions = {
  data: any;
  config?: QueryConfig<QueryFnType>;
};

export const useDropdownStatusDetail = ({
  data,
  config,
}: UseDropdownStatusOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["status-dropdown-detail", data],
    queryFn: () => getDropdownStatusDetail(data),
  });
};
