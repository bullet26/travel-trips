import { CountryNest } from 'types'
import * as yup from 'yup'

export const transformForSelect = (data: CountryNest[] = []) => {
  return data?.map(({ name, id }) => ({ value: id, label: name }))
}

export const countrySchema = yup
  .object({
    name: yup.string().min(4).required(),
    latitude: yup.number().min(-90).max(90).required(),
    longitude: yup.number().min(-180).max(180).required(),
  })
  .required()

export const citySchema = yup
  .object({
    countryId: yup.number().min(1).required(),
    name: yup.string().min(4).required(),
    latitude: yup.number().min(-90).max(90).required(),
    longitude: yup.number().min(-180).max(180).required(),
  })
  .required()
