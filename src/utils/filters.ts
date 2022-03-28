import dayjs from 'dayjs';
import { ITimeFilterObject, TimeFilterEnum } from '../interfaces';

export const getTimeFilterObject = (
  createdFilter: TimeFilterEnum,
  timestampKey?: boolean
): ITimeFilterObject => {
  let createdFilterTime: number;

  switch (createdFilter) {
    case '1hour':
      createdFilterTime = dayjs().subtract(1, 'hour').unix();
      break;
    case '24hours':
      createdFilterTime = dayjs().subtract(24, 'hours').unix();
      break;
    case '7days':
      createdFilterTime = dayjs().subtract(7, 'days').unix();
      break;
    case '30days':
      createdFilterTime = dayjs().subtract(30, 'days').unix();
      break;
    default:
      createdFilterTime = dayjs().subtract(24, 'hours').unix();
      break;
  }
  return {
    filterTime: createdFilterTime,
    filterShortString: createdFilter,
    filterString: timestampKey
      ? `&timestamp=>=${createdFilterTime}`
      : `&created=>=${createdFilterTime}`,
  };
};
