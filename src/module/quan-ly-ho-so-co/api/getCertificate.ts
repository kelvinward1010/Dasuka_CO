import { useQuery } from "react-query";

import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getCertificate = ({
  certificateId,
}: {
  certificateId: string;
}): Promise<any> => {
  return apiClient.get(`/certificate/${certificateId}`).then((res) => res.data);
};

type QueryFnType = typeof getCertificate;

type UseCertificateOptions = {
  certificateId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useCertificate = ({
  certificateId,
  config,
}: UseCertificateOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["certificate", certificateId],
    queryFn: () => getCertificate({ certificateId }),
  });
};
