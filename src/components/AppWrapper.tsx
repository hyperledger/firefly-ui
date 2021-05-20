import React, { useState } from 'react';
import { Navigation } from './Navigation/Navigation';
import { makeStyles } from '@material-ui/core';
import { HiddenAppBar } from './HiddenAppBar';
import { Header } from './Header/Header';

export const AppWrapper: React.FC = ({ children }) => {
  const classes = useStyles();
  const [navigationOpen, setNavigationOpen] = useState(true);

  return (
    <div className={classes.root}>
      <Navigation
        navigationOpen={navigationOpen}
        setNavigationOpen={setNavigationOpen}
      />
      <main className={classes.content}>
        <HiddenAppBar
          navigationOpen={navigationOpen}
          setNavigationOpen={setNavigationOpen}
        />
        <Header />
        {children}
      </main>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
  },
}));
