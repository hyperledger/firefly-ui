import { Drawer, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { NAVOPEN_LOCALSTORAGE_KEY } from './Navigation';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile?: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  children: JSX.Element;
};

const drawerWidth = 220;

export const NavDrawer: React.FC<Props> = ({
  open,
  setOpen,
  isMobile = false,
  children,
  setIsMobile,
}: Props) => {
  const classes = useStyles();

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
      setIsMobile(true);
    } else {
      const storageItem = window.localStorage.getItem(NAVOPEN_LOCALSTORAGE_KEY);
      const isLocalStorageNavOpen =
        storageItem === undefined /* default if unset is true */ ||
        storageItem === 'true';
      setOpen(isLocalStorageNavOpen);
      setIsMobile(false);
    }
  }, [isMobile, setOpen, setIsMobile]);

  return (
    <Drawer
      variant={isMobile ? undefined : 'permanent'}
      {...{ open }}
      onClose={() => setOpen(false)}
      anchor="left"
      className={isMobile || open ? classes.drawerOpen : classes.drawerClose}
      classes={{
        paper: isMobile || open ? classes.drawerOpen : classes.drawerClose,
      }}
    >
      {children}
    </Drawer>
  );
};

const useStyles = makeStyles((theme) => ({
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    [theme.breakpoints.down('md')]: {
      width: 0,
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(9) + 1,
    },
  },
}));
