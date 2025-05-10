import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
const TZ = 'Europe/Kyiv'

export const formatToDateString = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value)
  console.log(date, value instanceof Date, value)

  if (isNaN(date.getTime())) {
    console.error('Invalid date provided')
  }

  return dayjs(date).tz(TZ).format('DD MMMM, YYYY')
}
