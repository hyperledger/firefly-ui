import { RouteObject } from 'react-router-dom';
import { NAMESPACES_PATH } from '../../interfaces';
import { MyNodeDashboard } from './views/Dashboard';
import { MyNodeSubscriptions } from './views/Subscriptions';

export const MyNodeRoutes: RouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/myNode`,
  children: [
    {
      path: '',
      index: true,
      element: <MyNodeDashboard />,
    },
    {
      path: 'subscriptions',
      element: <MyNodeSubscriptions />,
    },
  ],
};
