import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getCertificates = ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<any> => {
  return apiClient
    .get("/certificate", {
      params: filterEmptyString(params),
    })
    .then((res) => ({
      dataSource: res.data,
      total: 0,
    }));
};

type QueryFnType = typeof getCertificates;

type UseCertificatesOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useCertificates = ({ params, config }: UseCertificatesOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["certificates", params],
    queryFn: () => getCertificates({ params }),
  });
};
