import { RouteObject } from 'react-router-dom';
import { NAMESPACES_PATH } from '../../interfaces';
import { BlockchainApis } from './views/Apis';
import { BlockchainDashboard } from './views/Dashboard';
import { BlockchainEvents } from './views/Events';
import { BlockchainInterfaces } from './views/Interfaces';
import { BlockchainListeners } from './views/Listeners';

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
      path: 'apis',
      element: <BlockchainApis />,
    },
    {
      path: 'interfaces',
      element: <BlockchainInterfaces />,
    },
    {
      path: 'listeners',
      element: <BlockchainListeners />,
    },
  ],
};
