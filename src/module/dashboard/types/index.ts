export interface IDashboardCO {
  canceled_co: IDashboardCODetail[];
  complete_co: IDashboardCODetail[];
  processing_co: IDashboardCODetail[];
}

export interface IDashboardCODetail {
  quantity: number;
  created_date: string;
}

export interface IDashboardDeclaration {
  quantity: number;
  declaration_date: string;
}

export interface IDashboardTotal {
  co_document: number;
  customer: number;
  employee: number;
  material: number;
  product: number;
}
