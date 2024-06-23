export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

export interface Pageable {
  page: number;
  size: number;
  sort: string;
  order: SortOrder;
}
