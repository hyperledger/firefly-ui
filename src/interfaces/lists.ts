export interface IDataListItem {
  label: string | JSX.Element;
  value: string | JSX.Element | number | undefined;
  button?: JSX.Element | undefined;
}
