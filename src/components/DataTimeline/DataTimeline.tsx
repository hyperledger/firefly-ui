import React from 'react';
import { Paper, makeStyles } from '@material-ui/core';
import { Timeline } from '@material-ui/lab';
import { ITimelineItem } from '../../interfaces';
import { TimelineItemWrapper } from './TimelineItemWrapper';

interface Props {
  items: ITimelineItem[];
}

export const DataTimeline: React.FC<Props> = ({ items }) => {
  const classes = useStyles();

  return (
    <>
      <Paper className={classes.paper}>
        <Timeline>
          {items.map((item) => (
            <TimelineItemWrapper item={item} opposite />
          ))}
        </Timeline>
      </Paper>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    width: '100%',
    maxHeight: 'calc(100vh - 100px)',
    overflow: 'auto',
  },
}));
