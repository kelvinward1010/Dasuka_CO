import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";

export const getPermissionsByFunction = async (params: any): Promise<any> => {
  const res = await apiClient.get(
    `${API_CORE}/permission/get/${params.role_id}/${params.function_id}`,
  );
  return res.data;
};
