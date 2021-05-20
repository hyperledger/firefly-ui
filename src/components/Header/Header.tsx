import React from 'react';
import { Grid, Hidden, makeStyles } from '@material-ui/core';
import { NamespaceMenu } from './NamespaceMenu';

export const Header: React.FC = () => {
  const classes = useStyles();

  return (
    <Hidden implementation="js" smDown>
      <header className={classes.headerGrid}>
        <Grid container alignItems="center" justify="flex-end">
          <Grid item>
            <NamespaceMenu />
          </Grid>
        </Grid>
      </header>
    </Hidden>
  );
};

const useStyles = makeStyles((theme) => ({
  headerGrid: {
    margin: theme.spacing(3),
  },
}));
