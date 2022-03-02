import { RouteObject } from 'react-router-dom';
import { NAMESPACES_PATH } from '../../interfaces';
import { BlockchainApis } from './views/Apis';
import { BlockchainDashboard } from './views/Dashboard';
import { BlockchainEvents } from './views/Events';
import { BlockchainInterfaces } from './views/Interfaces';
import { BlockchainSubscriptions } from './views/Subscriptions';

export const BlockchainRoutes: RouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/blockchain`,
  children: [
    {
      path: '',
      index: true,
      element: <BlockchainDashboard />,
    },
    {
      path: 'events',
      element: <BlockchainEvents />,
    },
    {
      path: 'interfaces',
      element: <BlockchainInterfaces />,
    },
    {
      path: 'apis',
      element: <BlockchainApis />,
    },
    {
      path: 'subscriptions',
      element: <BlockchainSubscriptions />,
    },
  ],
};
