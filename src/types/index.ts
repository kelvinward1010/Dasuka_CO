export type IBaseEntity = {
  id: string;
};

export type IBaseListItem<T> = {
  data: (T & {
    RecordCount: string;
    RowNumber: number;
  })[];
  totalItems: number;
  page: number;
  pageSize: number;
};

export type IBaseDeleteItems<T> = {
  list_json: T[];
  updated_by_id: string;
};

export type IBasePaginate<T> = {
  pageIndex?: number;
  pageSize?: number; // if pageSize is 0, return all items
} & T;

export type IBaseUpload = {
  result: boolean;
  path: string;
  message: string;
};

export type IBaseDropdown = {
  label: string;
  value: string;
}[];
