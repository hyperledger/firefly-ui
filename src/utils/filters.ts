import dayjs from 'dayjs';
import { CreatedFilterOptions, ICreatedFilter } from '../interfaces';

export const getCreatedFilter = (
  createdFilter: CreatedFilterOptions
): ICreatedFilter => {
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
    filterString: `&created=>=${createdFilterTime}`,
  };
};
