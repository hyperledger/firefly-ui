import { FF_EVENTS } from '../interfaces';

export const isOppositeTimelineEvent = (eventType: string) => {
  switch (eventType) {
    case FF_EVENTS.TX_SUBMITTED:
      return true;
    default:
      return false;
  }
};
