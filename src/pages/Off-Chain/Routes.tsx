import { RouteObject } from 'react-router-dom';
import { NAMESPACES_PATH } from '../../interfaces';
import { OffChainBatches } from './views/Batches';
import { OffChainDashboard } from './views/Dashboard';
import { OffChainData } from './views/Data';
import { OffChainDataTypes } from './views/DataTypes';
import { OffChainGroups } from './views/Groups';
import { OffChainMessages } from './views/Messages';

export const OffChainRoutes: RouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/offChain`,
  children: [
    {
      path: '',
      index: true,
      element: <OffChainDashboard />,
    },
    {
      path: 'messages',
      element: <OffChainMessages />,
    },
    {
      path: 'data',
      element: <OffChainData />,
    },
    {
      path: 'batches',
      element: <OffChainBatches />,
    },
    {
      path: 'datatypes',
      element: <OffChainDataTypes />,
    },
    {
      path: 'groups',
      element: <OffChainGroups />,
    },
  ],
};
