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
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import HomeIcon from '@material-ui/icons/Home';
import LanguageIcon from '@material-ui/icons/Language';
import ChatIcon from '@material-ui/icons/Chat';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SettingsIcon from '@material-ui/icons/Settings';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import { NavDrawer } from './NavDrawer';
import { ReactComponent as LogoIconSVG } from '../svg/ff-logo.svg';

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

  const handleOpenClose = () => {
    window.localStorage.setItem(
      NAVOPEN_LOCALSTORAGE_KEY,
      Boolean(!navigationOpen).toString()
    );
    setNavigationOpen(!navigationOpen);
  };

  const icons: { [name: string]: React.ComponentType<SvgIconProps> } = {
    dashboard: HomeIcon,
    network: LanguageIcon,
    messages: ChatIcon,
    data: LibraryBooksIcon,
    transactions: EventAvailableIcon,
    subscriptions: SubtitlesIcon,
    settings: SettingsIcon,
  };

  const navItem = (name: string) => {
    const Icon = icons[name];

    return (
      <ListItem className={classes.menuItem} button>
        <ListItemIcon
          classes={{
            root: classes.closerText,
          }}
        >
          <Icon />
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
        {navItem('dashboard')}
        {navItem('network')}
        {navItem('messages')}
        {navItem('data')}
        {navItem('transactions')}
        {navItem('subscriptions')}
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
}));
