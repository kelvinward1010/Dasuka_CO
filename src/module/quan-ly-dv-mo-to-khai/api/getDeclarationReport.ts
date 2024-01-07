import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { OpenDeclarationReport } from "../types";

export const getDeclarationReport = async ({
  id,
}: {
  id: string;
}): Promise<OpenDeclarationReport> => {
  const res = await apiClient.get(
    `${API_CO}/open-declaration-reports/getbyid/${id}`,
  );
  return res.data;
};

type QueryFnType = typeof getDeclarationReport;

type UseDeclarationReportOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useDeclarationReport = ({
  config,
  id,
}: UseDeclarationReportOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["open-declaration-reports", id],
    queryFn: () => getDeclarationReport({ id }),
  });
};
