import { useMutation } from "react-query";

import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export type UpdateCertificateDTO = {
  data: any;
  certificateId: string;
};

export const updateCertificate = ({
  data,
  certificateId,
}: UpdateCertificateDTO): Promise<any> => {
  return apiClient.patch(`certificate/${certificateId}`, data);
};

type UseUpdateCertificateOptions = {
  config?: MutationConfig<typeof updateCertificate>;
};

export const useUpdateCertificate = ({
  config,
}: UseUpdateCertificateOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateCertificate,
  });
};
