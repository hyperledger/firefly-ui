import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { FFRouteObject } from '../../navigation/NavigationInterfaces';
import { HomeDashboard } from './views/Dashboard';

export const HomeRoutes: FFRouteObject = {
  path: '/home',
  element: <HomeDashboard />,
  icon: <DashboardOutlinedIcon />,
  index: true,
  name: 'Dashboard',
};
