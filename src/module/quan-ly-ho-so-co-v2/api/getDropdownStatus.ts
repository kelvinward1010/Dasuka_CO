import { BaseType } from "antd/es/typography/Base";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseDropdown } from "@/types";

export const getDropdownStatus = async (): Promise<IBaseDropdown> => {
  const res = await apiClient.get(`${API_CO}/statuss/dropdown`);
  return res.data;
};

type QueryFnType = typeof getDropdownStatus;

type UseDropdownStatusOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useDropdownStatus = ({ config }: UseDropdownStatusOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: "status-dropdown",
    queryFn: () => getDropdownStatus(),
  });
};

export const STATUS_DROPDOWN_TEXT_TYPE: Record<string, BaseType | undefined> = {
  "1": "success",
  "2": undefined,
  "3": "warning",
  "4": "warning",
  "5": "danger",
  "6": "danger",
};

export const getTextType = (
  status_id: number,
  isWarning?: boolean,
  isDanger?: boolean,
) => {
  let result;
  if (isDanger) result = STATUS_DROPDOWN_TEXT_TYPE["5"];
  if (isWarning) result = undefined;
  if (result) return result;
  switch (status_id + "") {
    case "6":
      return STATUS_DROPDOWN_TEXT_TYPE["2"];
    case "3":
      return STATUS_DROPDOWN_TEXT_TYPE["3"];
    case "4":
      return STATUS_DROPDOWN_TEXT_TYPE["4"];
    default:
      return STATUS_DROPDOWN_TEXT_TYPE["1"];
  }
};
