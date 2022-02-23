export interface ICreatedFilter {
  filterString: string;
  filterTime: number;
}

export type CreatedFilterOptions = '1hour' | '24hours' | '7days' | '30days';
