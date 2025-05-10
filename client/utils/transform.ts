import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
const TZ = 'Europe/Kyiv'

export const formatToDateString = (value: string | Date): string => {
  if (!dayjs(value).isValid()) {
    console.error('Invalid date provided', value)
    return 'unknown'
  }

  return dayjs(value).tz(TZ).format('DD MMMM, YYYY')
}
