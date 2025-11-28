import dayjs from 'dayjs';
import { ITimeFilterObject, TimeFilterEnum } from '../interfaces';

interface ITimeFilterOptions {
  timestampKey?: boolean;
  startTime?: string | null;
  endTime?: string | null;
}

const buildTimeFilterString = (
  fieldName: string,
  start?: number,
  end?: number
): string => {
  if (start !== undefined && end !== undefined) {
    return `&${fieldName}=>=${start}&${fieldName}=<=${end}`;
  }
  if (start !== undefined) {
    return `&${fieldName}=>=${start}`;
  }
  if (end !== undefined) {
    return `&${fieldName}=<=${end}`;
  }
  return '';
};

const getValidUnixTime = (time?: string | null): number | undefined => {
  if (!time) {
    return undefined;
  }
  const parsed = dayjs(time);
  return parsed.isValid() ? parsed.unix() : undefined;
};

const getFallbackStartUnix = (startUnix?: number, endUnix?: number) => {
  if (startUnix !== undefined) {
    return startUnix;
  }
  if (endUnix !== undefined) {
    return dayjs.unix(endUnix).subtract(24, 'hours').unix();
  }
  return dayjs().subtract(24, 'hours').unix();
};

export const getTimeFilterObject = (
  createdFilter: TimeFilterEnum,
  options?: ITimeFilterOptions
): ITimeFilterObject => {
  const fieldName = options?.timestampKey ? 'timestamp' : 'created';

  if (createdFilter === TimeFilterEnum.custom) {
    const startUnix = getValidUnixTime(options?.startTime);
    const endUnix = getValidUnixTime(options?.endTime);
    const startTimeUnix = getFallbackStartUnix(startUnix, endUnix);

    return {
      filterTime: startTimeUnix,
      startTime: startUnix ?? startTimeUnix,
      endTime: endUnix,
      filterShortString: createdFilter,
      filterString: buildTimeFilterString(fieldName, startUnix, endUnix),
    };
  }

  let createdFilterTime: number;

  switch (createdFilter) {
    case TimeFilterEnum['1hour']:
      createdFilterTime = dayjs().subtract(1, 'hour').unix();
      break;
    case TimeFilterEnum['24hours']:
      createdFilterTime = dayjs().subtract(24, 'hours').unix();
      break;
    case TimeFilterEnum['7days']:
      createdFilterTime = dayjs().subtract(7, 'days').unix();
      break;
    case TimeFilterEnum['30days']:
      createdFilterTime = dayjs().subtract(30, 'days').unix();
      break;
    default:
      createdFilterTime = dayjs().subtract(24, 'hours').unix();
      break;
  }

  return {
    filterTime: createdFilterTime,
    startTime: createdFilterTime,
    filterShortString: createdFilter,
    filterString: buildTimeFilterString(fieldName, createdFilterTime),
  };
};
