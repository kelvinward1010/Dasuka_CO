import BaseType from "@/module/authorization/types";

export interface IFunction extends BaseType {
  function_id: string;
  parent_id?: string;
  function_name: string;
  url: string;
  description?: string;
  level: number;
  sort_order?: number;
}
