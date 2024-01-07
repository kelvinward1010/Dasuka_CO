import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

interface IMaterial {
  material_code: string;
  norm_material_name: string;
  lu_user_id: string;
}

export const updateMaterial = async (data: IMaterial): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/materials/update`, data);
  return res.data;
};

type UseUpdateMaterialOptions = {
  config?: MutationConfig<typeof updateMaterial>;
};

export const useUpdateMaterial = ({ config }: UseUpdateMaterialOptions) => {
  return useMutation({
    ...config,
    mutationFn: updateMaterial,
  });
};
