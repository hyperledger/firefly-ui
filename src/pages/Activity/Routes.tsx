import { RouteObject } from 'react-router-dom';
import { NAMESPACES_PATH } from '../../interfaces';
import { ActivityDashboard } from './views/Dashboard';
import { ActivityEvents } from './views/Events';
import { ActivityOperations } from './views/Operations';
import { ActivityTransactions } from './views/Transactions';

export const ActivityRoutes: RouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/activity`,
  children: [
    {
      path: '',
      index: true,
      element: <ActivityDashboard />,
    },
    {
      path: 'events',
      element: <ActivityEvents />,
    },
    {
      path: 'transactions',
      element: <ActivityTransactions />,
    },
    {
      path: 'operations',
      element: <ActivityOperations />,
    },
  ],
};
