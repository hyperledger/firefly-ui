import { FFRouteObject, NAMESPACES_PATH } from '../../interfaces';
import { HomeDashboard } from './views/Dashboard';

export const HomeRoutes: FFRouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/home`,
  element: <HomeDashboard />,
  index: true,
};
