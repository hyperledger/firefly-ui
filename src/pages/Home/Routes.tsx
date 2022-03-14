import { RouteObject } from 'react-router-dom';
import { NAMESPACES_PATH } from '../../interfaces';
import { HomeDashboard } from './views/Dashboard';

export const HomeRoutes: RouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/home`,
  element: <HomeDashboard />,
  index: true,
};
