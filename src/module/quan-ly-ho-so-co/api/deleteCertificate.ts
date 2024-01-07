import { useMutation } from "react-query";

import { apiClient } from "@/lib/api";
import { MutationConfig, queryClient } from "@/lib/react-query";

import { ICertificate } from "../types";

export const deleteCertificate = ({
  certificateId,
}: {
  certificateId: string;
}): Promise<ICertificate> => {
  return apiClient.delete(`/certificates/${certificateId}`);
};

type UseDeleteCertificateOptions = {
  config?: MutationConfig<typeof deleteCertificate>;
};

export const useDeleteCertificate = ({
  config,
}: UseDeleteCertificateOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["certificates"]);
    },
    ...config,
    mutationFn: deleteCertificate,
  });
};
