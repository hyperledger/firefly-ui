import { RouteObject } from 'react-router-dom';

export interface FFRouteObject extends RouteObject {
  icon?: JSX.Element;
  name?: string;
  path: string;
  children?: FFRouteObject[];
}

export interface INavItem {
  name: string;
  action: () => void;
  icon?: JSX.Element;
  itemIsActive: boolean;
}

export const NAMESPACES_PATH = 'namespaces';
export const ACTIVITY_PATH = 'activity';
export const EVENTS_PATH = 'events';
export const TRANSACTIONS_PATH = 'transactions';
export const OPERATIONS_PATH = 'operations';
