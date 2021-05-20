import React from 'react';
import { Chip, makeStyles } from '@material-ui/core';

interface Props {
  status: string;
}

export const StatusChip: React.FC<Props> = ({ status }) => {
  const classes = useStyles();

  return <Chip className={classes.root} label={status} variant="outlined" />;
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    backgroundColor: '#6E7780',
  },
}));
