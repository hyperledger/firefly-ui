import { RouteObject } from 'react-router-dom';
import { NAMESPACES_PATH } from '../../interfaces';
import { NetworkMapDashboard } from './views/Dashboard';
import { NetworkIdentities } from './views/Identities';
import { NetworkNodes } from './views/Nodes';
import { NetworkOrganizations } from './views/Organizations';

export const NetworkRoutes: RouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/network`,
  children: [
    {
      path: '',
      index: true,
      element: <NetworkMapDashboard />,
    },
    {
      path: 'organizations',
      element: <NetworkOrganizations />,
    },
    {
      path: 'nodes',
      element: <NetworkNodes />,
    },
    {
      path: 'identities',
      element: <NetworkIdentities />,
    },
  ],
};
