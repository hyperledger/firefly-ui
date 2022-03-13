import HexagonIcon from '@mui/icons-material/Hexagon';
import LaunchIcon from '@mui/icons-material/Launch';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
import {
  FF_DOCS,
  HOME_PATH,
  MY_NODES_PATH,
  NAMESPACES_PATH,
} from '../../interfaces';
import { MenuLogo } from '../MenuLogo';
import { ActivityNav } from './ActivityNav';
import { BlockchainNav } from './BlockchainNav';
import { NavItem } from './NavItem';
import { NetworkNav } from './NetworkNav';
import { OffChainNav } from './OffChainNav';
import { TokensNav } from './TokensNav';

export const NAV_WIDTH = 225;

export const Navigation: React.FC = () => {
  const { orgName, selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const homePath = `/${NAMESPACES_PATH}/${selectedNamespace}/${HOME_PATH}`;
  const myNodePath = `/${NAMESPACES_PATH}/${selectedNamespace}/${MY_NODES_PATH}`;
  const documentationPath = FF_DOCS;

  const makeDrawerContents = (
    <>
      <NavItem
        name={t('dashboard')}
        icon={<ViewDashboardOutlineIcon />}
        action={() => navigate(homePath)}
        itemIsActive={pathname === homePath}
      />
      <ActivityNav />
      <BlockchainNav />
      <OffChainNav />
      <TokensNav />
      <NetworkNav />
      <NavItem
        name={t('myNode')}
        icon={<HexagonIcon />}
        action={() => navigate(myNodePath)}
        itemIsActive={pathname === myNodePath}
      />
      <NavItem
        name={t('docs')}
        icon={<MenuBookIcon />}
        action={() => window.open(documentationPath, '_blank')}
        itemIsActive={false}
        rightIcon={<LaunchIcon />}
      />
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
