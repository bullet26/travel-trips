import dayjs from 'dayjs'

export const formatToDateString = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value)

  if (isNaN(date.getTime())) {
    console.error('Invalid date provided')
  }

  return dayjs(date).format('DD MMMM, YYYY')
}
