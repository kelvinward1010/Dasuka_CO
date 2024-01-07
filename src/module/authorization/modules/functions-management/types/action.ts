import BaseType from "@/module/authorization/types";

export interface IAction extends BaseType {
  action_code: string;
  function_id: string;
  action_name: string;
  description: string;
}
