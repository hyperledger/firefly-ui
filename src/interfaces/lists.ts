export interface IDataListItem {
  label: string | JSX.Element;
  value: string | JSX.Element | number | undefined | boolean;
  button?: JSX.Element | undefined;
}
