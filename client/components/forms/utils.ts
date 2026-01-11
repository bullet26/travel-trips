import { CountryNest, ICreateTrip, ITransformWLToTrip } from 'types'
import type { DatePicker, GetProps } from 'antd'
import * as yup from 'yup'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { UseFormGetValues, UseFormSetValue } from 'react-hook-form'

export const transformForSelect = (data: CountryNest[] = []) => {
  return data?.map(({ name, id }) => ({ value: id, label: name }))
}

export const transformForTreeSelect = (data: CountryNest[] = []) => {
  return data?.map(({ name, id, cities }) => {
    if (cities.length) {
      const children = cities.map(({ id, name }) => ({ value: id, title: name }))

      return { value: `country-${id}`, title: name, children, selectable: false }
    }
    return { value: `country-${id}`, title: name, selectable: false }
  })
}

dayjs.extend(utc)
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

export const getDate = (
  getValues: UseFormGetValues<ICreateTrip | ITransformWLToTrip>,
): [dayjs.Dayjs | null, dayjs.Dayjs | null] => {
  const start = getValues('startDate') ? dayjs(getValues('startDate')).local() : null
  const end = getValues('finishDate') ? dayjs(getValues('finishDate')).local() : null
  return [start, end]
}

export const setDate = (
  dates: RangePickerProps['value'],
  setValue: UseFormSetValue<ICreateTrip | ITransformWLToTrip>,
) => {
  if (dates?.length === 2) {
    const [startDate, finishDate] = dates
    if (startDate) setValue('startDate', startDate.utc().toDate())
    if (finishDate) setValue('finishDate', finishDate.utc().toDate())
  }
}

export const countrySchema = yup
  .object({
    name: yup.string().min(4).required(),
    latitude: yup.number().min(-90).max(90).required(),
    longitude: yup.number().min(-180).max(180).required(),
    translations: yup.array().of(yup.string().min(4).required()).min(1).required(),
  })
  .required()

export const citySchema = yup
  .object({
    countryId: yup.number().min(1).required(),
    name: yup.string().min(4).required(),
    latitude: yup.number().min(-90).max(90).required(),
    longitude: yup.number().min(-180).max(180).required(),
    translations: yup.array().of(yup.string().min(4).required()).min(1).required(),
  })
  .required()

export const placeSchema = yup
  .object({
    cityId: yup.number().min(1).required(),
    name: yup.string().min(4).required(),
    description: yup.string().min(25).required(),
    address: yup.string().min(10).required(),
    latitude: yup.number().min(-90).max(90).required(),
    longitude: yup.number().min(-180).max(180).required(),
    tagIds: yup.array().optional().of(yup.number().integer().positive().required()),
    translations: yup.array().of(yup.string().min(4).required()).min(1).required(),
  })
  .required()

export const tagSchema = yup
  .object({
    name: yup.string().min(4).required(),
  })
  .required()

export const tripSchema = yup
  .object({
    userId: yup.number().min(1),
    title: yup.string().min(4).required(),
    startDate: yup.date().required(),
    finishDate: yup.date().required(),
    comment: yup.string().optional().nullable(),
  })
  .required()

export const wishlistSchema = yup
  .object({
    userId: yup.number().min(1),
    title: yup.string().min(4).required(),
    comment: yup.string().optional().nullable(),
  })
  .required()

export const wishlistTransformSchema = yup
  .object({
    title: yup.string().min(4).required(),
    startDate: yup.date().required(),
    finishDate: yup.date().required(),
  })
  .required()
