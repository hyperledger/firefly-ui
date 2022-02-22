import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import ViewDashboardOutlineIcon from 'mdi-react/ViewDashboardOutlineIcon';
import { default as React, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { NAMESPACES_PATH } from '../../interfaces';
import { MenuLogo } from '../MenuLogo';
import { ActivityNav } from './ActivityNav';
import { NavItem } from './NavItem';

export const NAV_WIDTH = 225;

export const Navigation: React.FC = () => {
  const { orgName, selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const homePath = `/${NAMESPACES_PATH}/${selectedNamespace}/home`;

  const makeDrawerContents = (
    <>
      <NavItem
        name={t('dashboard')}
        icon={<ViewDashboardOutlineIcon />}
        action={() => navigate(homePath)}
        itemIsActive={pathname === homePath}
      />
      <ActivityNav />
    </>
  );

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
        <List>
          <ListItem>
            <ListItemText>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {orgName}
              </Typography>
            </ListItemText>
          </ListItem>
          {makeDrawerContents}
        </List>
      </Drawer>
    </>
  );
};
