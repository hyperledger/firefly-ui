import { RouteObject } from 'react-router-dom';
import { NAMESPACES_PATH } from '../../interfaces';
import { MessagesActivity } from './views/Activity';
import { MessagesDashboard } from './views/Dashboard';

export const MessagesRoutes: RouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/messages`,
  children: [
    {
      path: '',
      index: true,
      element: <MessagesDashboard />,
    },
    {
      path: 'activity',
      element: <MessagesActivity />,
    },
  ],
};
