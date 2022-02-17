import { RouteObject } from 'react-router-dom';

export interface FFRouteObject extends RouteObject {
  icon?: JSX.Element;
  name?: string;
  path: string;
  children?: FFRouteObject[];
}

export enum RouterParams {
  NAMESPACE = 'namespace',
}
