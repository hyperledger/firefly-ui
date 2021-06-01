import React from 'react';
import { makeStyles } from '@material-ui/core';
import {
  TimelineSeparator,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
  TimelineConnector,
  TimelineItem as TItem,
} from '@material-ui/lab';
import { ITimelineItem } from '../../../interfaces';
import { TimelineContentPanel } from './TimelineContentPanel';

interface Props {
  item: ITimelineItem;
}

export const TimelineItem: React.FC<Props> = ({ item }) => {
  const classes = useStyles();

  return (
    <>
      <TItem>
        <TimelineOppositeContent>{item.time}</TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot className={classes.dot}>
            {item.icon ? item.icon : undefined}
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <TimelineContentPanel
            title={item.title}
            description={item.description}
            onClick={item.onClick}
          />
        </TimelineContent>
      </TItem>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  dot: {
    backgroundColor: theme.palette.timelineBackground.main,
  },
}));
