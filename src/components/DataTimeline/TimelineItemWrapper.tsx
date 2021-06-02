import React from 'react';
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
