import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { FFRouteObject } from '../../navigation/NavigationInterfaces';
import { ActivityDashboard } from './views/Dashboard';
import { ActivityEvents } from './views/Events';
import { ActivityOperations } from './views/Operations';
import { ActivityTransactions } from './views/Transactions';

export const ActivityRoutes: FFRouteObject = {
  path: '/activity',
  icon: <AssessmentOutlinedIcon />,
  name: 'Activity',
  children: [
    {
      path: '/activity',
      name: 'Dashboard',
      index: true,
      element: <ActivityDashboard />,
    },
    {
      path: '/activity/events',
      name: 'Events',
      element: <ActivityEvents />,
    },
    {
      path: '/activity/transactions',
      name: 'Transactions',
      element: <ActivityTransactions />,
    },
    {
      path: '/activity/operations',
      name: 'Operations',
      element: <ActivityOperations />,
    },
  ],
};
