import { RouteObject } from 'react-router-dom';
import { NAMESPACES_PATH } from '../../interfaces';
import { MyNodeDashboard } from './views/Dashboard';

export const MyNodeRoutes: RouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/myNode`,
  children: [
    {
      path: '',
      index: true,
      element: <MyNodeDashboard />,
    },
  ],
};
