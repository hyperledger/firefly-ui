export interface ITimelineItem {
  key: string;
  title?: string;
  description?: string;
  icon?: JSX.Element;
  time?: string;
  author?: string;
  onClick?: () => void;
}
