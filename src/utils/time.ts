import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const getFFTime = (ts: string, fullLength?: boolean): string => {
  return fullLength
    ? dayjs(ts).format('MM/DD/YYYY h:mm:ss.SSS A')
    : dayjs(ts).fromNow();
};
