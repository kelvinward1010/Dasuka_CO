import { useMutation } from "react-query";

import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export type CreateCertificateDTO = any;

export const createCertificate = (data: CreateCertificateDTO): Promise<any> => {
  return apiClient.post("/certificate", data);
};

type UseCreateCertificateOptions = {
  config?: MutationConfig<typeof createCertificate>;
};

export const useCreateCertificate = ({
  config,
}: UseCreateCertificateOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createCertificate,
  });
};
