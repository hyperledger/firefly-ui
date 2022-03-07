import { RouteObject } from 'react-router-dom';
import { NAMESPACES_PATH } from '../../interfaces';
import { OffChainDashboard } from './views/Dashboard';
import { OffChainData } from './views/Data';
import { OffChainDataTypes } from './views/DataTypes';
import { OffChainFileExplorer } from './views/FileExplorer';

export const OffChainRoutes: RouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/offChain`,
  children: [
    {
      path: '',
      index: true,
      element: <OffChainDashboard />,
    },
    {
      path: 'data',
      element: <OffChainData />,
    },
    {
      path: 'fileExplorer',
      element: <OffChainFileExplorer />,
    },
    {
      path: 'dataTypes',
      element: <OffChainDataTypes />,
    },
  ],
};
