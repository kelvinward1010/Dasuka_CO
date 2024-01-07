import { FormRule } from "antd";

import { Fee } from "../types";

export const RULES_DECLARATION_DETAIL: Record<keyof Fee, FormRule[]> = {
  active_flag: [],
  created_by_user_id: [],
  created_date_time: [],
  lu_updated: [],
  lu_user_id: [],
  fee_id: [],
  total: [],
  fee_type: [],
  fee_name: [
    {
      required: true,
      message: "Tên phí không được để trống",
    },
  ],
  quantity: [
    {
      required: true,
      message: "Số lượng không được để trống",
    },
  ],
  unit: [],
  unit_price: [
    {
      required: true,
      message: "Đơn giá không được để trống",
    },
  ],
};
