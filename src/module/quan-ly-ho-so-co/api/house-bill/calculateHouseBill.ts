import { useQuery } from "react-query";

import { API_REPORT } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const calculateHouseBill = ({
  id,
}: {
  id: string | number;
}): Promise<any> => {
  return apiClient
    .get(`${API_REPORT}/co-document/export-codocument-fob/` + id)
    .then((res) => res.data);
};

type QueryFnType = typeof calculateHouseBill;

type UseHouseBillOptions = {
  id: string | number;
  config?: QueryConfig<QueryFnType>;
};

export const useCalculateHouseBill = ({ id, config }: UseHouseBillOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["house_bills", id],
    queryFn: () => calculateHouseBill({ id }),
  });
};
