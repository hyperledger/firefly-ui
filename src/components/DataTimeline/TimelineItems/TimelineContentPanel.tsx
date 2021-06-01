import React from 'react';
import { makeStyles, Paper, Typography, Grid } from '@material-ui/core';
import clsx from 'clsx';

interface Props {
  title?: string;
  description?: string;
  onClick?: () => void;
}

export const TimelineContentPanel: React.FC<Props> = ({
  title,
  description,
  onClick,
}) => {
  const classes = useStyles();

  return (
    <>
      <Paper
        elevation={3}
        className={clsx(classes.paper, onClick && classes.clickable)}
        onClick={onClick}
      >
        <Grid container className={classes.container} direction="column">
          <Grid item>
            <Typography className={classes.title}>{title}</Typography>
          </Grid>
          <Grid item>
            <Typography>{description}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.timelineBackground.main,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
  title: {
    fontWeight: 'bold',
  },
  container: {
    alignItems: 'flex-start',
  },
  clickable: {
    cursor: 'pointer',
  },
}));
