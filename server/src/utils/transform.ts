import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const transformArrayInFormData = (value: string | string[]) => {
  if (typeof value === 'string') {
    return value.split(',').map((v) => Number(v));
  }

  if (Array.isArray(value)) {
    return value.map((v) => Number(v));
  }
};

export const normalizeDate = (dateString: string | Date): Date => {
  return dateString instanceof Date
    ? dateString
    : dayjs(dateString).utc().toDate();
};
