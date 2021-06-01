import React from 'react';
import {
  TimelineItem,
  TimelineSeparator,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
  TimelineConnector,
} from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import { TimelineContentPanel } from './TimelineContentPanel';
import { ITimelineItem } from '../../../interfaces';

interface Props {
  item: ITimelineItem;
}

export const OppositeTimelineItem: React.FC<Props> = ({ item }) => {
  const classes = useStyles();

  return (
    <>
      <TimelineItem>
        <TimelineOppositeContent>
          <TimelineContentPanel
            title={item.title}
            description={item.description}
            onClick={item.onClick}
          />
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot className={classes.dot}>
            {item.icon ? item.icon : undefined}
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>{item.time}</TimelineContent>
      </TimelineItem>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  dot: {
    backgroundColor: theme.palette.timelineBackground.main,
  },
}));
