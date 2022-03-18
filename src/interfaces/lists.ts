export interface IDataListItem {
  label: string;
  value: string | JSX.Element | number | undefined;
  button?: JSX.Element | undefined;
}
