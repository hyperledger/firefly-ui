import React from 'react';
import { makeStyles } from '@material-ui/core';

import { ITimelineItem } from '../../interfaces';
import { OppositeTimelineItem } from './TimelineItems/OppositeTimelineItem';
import { TimelineItem } from './TimelineItems/TimelineItem';

interface Props {
  item: ITimelineItem;
  opposite?: boolean;
}

export const TimelineItemWrapper: React.FC<Props> = ({ item, opposite }) => {
  return (
    <>
      {opposite ? (
        <OppositeTimelineItem item={item} />
      ) : (
        <TimelineItem item={item} />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.timelineBackground.main,
  },
}));
