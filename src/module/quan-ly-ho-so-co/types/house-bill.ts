export interface ICreateHouseBillDTO {
  house_bill_id: string | null;
  house_bill_number: string;
  transportation_expense: number;
  insurance_expense: number;
  co_document_id: number;
  list_json_export_declaration_ids: {
    export_declaration_id: string;
  }[];
  created_by_user_id: string;
}

export type IFormCreateHouseBill = Pick<
  ICreateHouseBillDTO,
  "house_bill_number" | "transportation_expense" | "insurance_expense"
> & {
  list_json_export_declaration_ids: string[];
};
