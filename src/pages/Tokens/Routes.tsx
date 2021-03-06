import { RouteObject } from 'react-router-dom';
import { NAMESPACES_PATH } from '../../interfaces';
import { TokensApprovals } from './views/Approvals';
import { TokensBalances } from './views/Balances';
import { TokensDashboard } from './views/Dashboard';
import { PoolDetails } from './views/PoolDetails';
import { TokensPools } from './views/Pools';
import { TokensTransfers } from './views/Transfers';

export const TokensRoutes: RouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/tokens`,
  children: [
    {
      path: '',
      index: true,
      element: <TokensDashboard />,
    },
    {
      path: 'transfers',
      element: <TokensTransfers />,
    },
    {
      path: 'pools',
      element: <TokensPools />,
    },
    {
      path: 'pools/:poolID',
      element: <PoolDetails />,
    },
    {
      path: 'balances',
      element: <TokensBalances />,
    },
    {
      path: 'approvals',
      element: <TokensApprovals />,
    },
  ],
};
