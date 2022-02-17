export interface IDataTableColumn {
  value: string | number | JSX.Element | undefined;
}

export interface IDataTableRecord {
  columns: IDataTableColumn[];
  key: string;
  onClick?: () => void;
}
