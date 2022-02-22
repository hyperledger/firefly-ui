import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { NAMESPACES_PATH } from '../../interfaces';
import { FFRouteObject } from '../../interfaces';
import { HomeDashboard } from './views/Dashboard';

export const HomeRoutes: FFRouteObject = {
  path: `${NAMESPACES_PATH}/:namespace/home`,
  element: <HomeDashboard />,
  index: true,
};
