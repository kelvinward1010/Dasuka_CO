import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";

export const getFunctionByRole = async ({
  id,
}: {
  id: string;
}): Promise<any> => {
  const res = await apiClient.get(`${API_CORE}/function/getbyrole/` + id);
  return res.data;
};
