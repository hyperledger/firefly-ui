import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { default as React, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuLogo } from '../_core/components/MenuLogo';
import { ApplicationContext } from '../_core/contexts/ApplicationContext';
import { FFRouteObject } from './NavigationInterfaces';
import { getAllRoutes } from './RouterWrapper';

export const NAV_WIDTH = 225;

export const Navigation: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { orgName } = useContext(ApplicationContext);
  const { pathname } = useLocation();
  const [navItems, setNavItems] = useState<FFRouteObject[]>([]);
  const [accordionMap, setAccordionMap] = useState<{ [key: string]: boolean }>(
    {}
  );
  useEffect(() => {
    const routes = getAllRoutes();
    setNavItems(routes);
    makeAccordionMap(routes);
  }, []);

  const isActive = (path: string) => path === pathname;
  const isCategory = (path: string) => pathname.startsWith(path);

  const makeAccordionMap = (routes: FFRouteObject[]) => {
    const accordionMap: { [key: string]: boolean } = {};
    routes.map((route) => {
      accordionMap[route.path] = pathname.startsWith(route.path);
    });
    setAccordionMap(accordionMap);
  };

  const updateAccordionMap = (key: string) => {
    setAccordionMap({
      ...accordionMap,
      [key]: !accordionMap[key],
    });
  };

  const makeNavItem = (navItem: FFRouteObject) => {
    return (
      <>
        {/* Parent Nav */}
        <ListItemButton
          key={navItem.path}
          onClick={() =>
            navItem.children?.length
              ? updateAccordionMap(navItem.path)
              : navigate(navItem.path)
          }
          className={
            isCategory(navItem.path)
              ? classes.activeCategory
              : classes.inactiveNav
          }
        >
          <ListItemIcon>{navItem.icon}</ListItemIcon>
          <ListItemText>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: 14, fontWeight: '500' }}
            >
              {navItem.name}
            </Typography>
          </ListItemText>
          {navItem.children?.length &&
            (accordionMap[navItem.path] ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        {/* Child Nav */}
        <Collapse in={accordionMap[navItem.path]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {navItem.children?.map((route: FFRouteObject) => {
              return (
                <ListItemButton
                  onClick={() => navigate(route.path)}
                  key={route.path}
                  sx={{
                    pl: 4,
                  }}
                  className={
                    isActive(route.path)
                      ? classes.activeNav
                      : classes.inactiveNav
                  }
                >
                  <ListItemText>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: 14, fontWeight: '500', pl: 5 }}
                    >
                      {route.name}
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  };

  return (
    <>
      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: NAV_WIDTH,
            backgroundColor: 'background.default',
          },
        }}
        color="primary"
        variant="permanent"
        anchor="left"
      >
        <MenuLogo />
        <List
          sx={{
            pl: 2,
          }}
        >
          <ListItem>
            <ListItemText>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {orgName}
              </Typography>
            </ListItemText>
          </ListItem>
          {navItems.map((ni) => makeNavItem(ni))}
        </List>
      </Drawer>
    </>
  );
};

const useStyles = makeStyles(() => ({
  activeCategory: {
    color: 'white',
  },
  activeNav: {
    color: 'white',
  },
  inactiveNav: {
    color: 'gray',
  },
}));
