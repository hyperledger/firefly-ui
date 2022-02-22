import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { FFRouteObject, NAMESPACES_PATH } from '../../interfaces';
import { ActivityDashboard } from './views/Dashboard';
import { ActivityEvents } from './views/Events';
import { ActivityOperations } from './views/Operations';
import { ActivityTransactions } from './views/Transactions';

export const ActivityRoutes: FFRouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/activity`,
  icon: <AssessmentOutlinedIcon />,
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
