import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Hidden,
  IconButton,
  SvgIconProps,
  fade,
} from '@material-ui/core';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LanguageIcon from '@material-ui/icons/Language';
import ChatIcon from '@material-ui/icons/Chat';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SettingsIcon from '@material-ui/icons/Settings';
import { NavDrawer } from './NavDrawer';
import { ReactComponent as LogoIconSVG } from '../../svg/ff-logo.svg';
import { useLocation, useHistory } from 'react-router-dom';

export const NAVOPEN_LOCALSTORAGE_KEY = 'ff:navopen';
const drawerWidth = 220;

type Props = {
  navigationOpen: boolean;
  setNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Navigation: React.FC<Props> = ({
  navigationOpen,
  setNavigationOpen,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const relpath = pathname.replace(/^\//, '');

  const handleOpenClose = () => {
    window.localStorage.setItem(
      NAVOPEN_LOCALSTORAGE_KEY,
      Boolean(!navigationOpen).toString()
    );
    setNavigationOpen(!navigationOpen);
  };

  const icons: { [name: string]: React.ComponentType<SvgIconProps> } = {
    dashboard: DashboardIcon,
    network: LanguageIcon,
    messages: ChatIcon,
    data: LibraryBooksIcon,
    transactions: EventAvailableIcon,
    settings: SettingsIcon,
  };

  const navItem = (name: string, isDefault?: boolean) => {
    const Icon = icons[name];
    const isActive = relpath.startsWith(name) || (isDefault && !relpath);

    return (
      <ListItem
        className={clsx(classes.menuItem, isActive && classes.highlightedItem)}
        button
        onClick={() => {
          history.push(isDefault ? '' : `/${name}`);
          if (isMobile) setNavigationOpen(false);
        }}
      >
        <ListItemIcon
          classes={{
            root: classes.closerText,
          }}
        >
          <Icon className={isActive ? classes.highlightedIcon : classes.icon} />
        </ListItemIcon>
        {navigationOpen ? (
          <ListItemText
            primaryTypographyProps={{
              noWrap: true,
              className: classes.matchTabs,
            }}
            primary={t(name)}
          />
        ) : undefined}
      </ListItem>
    );
  };

  const drawerContent = (
    <>
      <Box className={classes.logoContainer}>
        <IconButton size="small" onClick={handleOpenClose}>
          <LogoIconSVG className={classes.logo} />
        </IconButton>
      </Box>
      <List>
        {navItem('dashboard', true)}
        {navItem('network')}
        {navItem('messages')}
        {navItem('data')}
        {navItem('transactions')}
        {navItem('settings')}
      </List>
    </>
  );

  return (
    <>
      <Hidden smDown implementation="js">
        <NavDrawer
          open={navigationOpen}
          setOpen={setNavigationOpen}
          setIsMobile={setIsMobile}
        >
          {drawerContent}
        </NavDrawer>
      </Hidden>
      <Hidden mdUp implementation="js">
        <NavDrawer
          open={navigationOpen}
          setOpen={setNavigationOpen}
          setIsMobile={setIsMobile}
          isMobile
        >
          {drawerContent}
        </NavDrawer>
      </Hidden>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  logo: {
    width: 49,
    height: 50,
  },
  fullLogo: {
    width: 140,
  },
  logoContainer: {
    textAlign: 'center',
  },
  menuItem: {
    height: 50,
  },
  closerText: {
    minWidth: 40,
  },
  matchTabs: {
    fontWeight: 'lighter',
    fontSize: 16,
  },
  highlightedIcon: {
    color: theme.palette.action.active,
  },
  icon: {
    color: theme.palette.action.disabled,
  },
  highlightedItem: {
    backgroundColor: fade(
      theme.palette.action.active,
      theme.palette.action.activatedOpacity
    ),
  },
}));
