export interface Unit {
  unit_id: string;
  unit_name: string;
  note: string;
  type: string;
  active_flag?: number;
  created_by_user_id?: string;
  created_date_time?: Date;
  lu_updated?: Date;
  lu_user_id?: string;
}
