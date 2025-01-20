import { SearchType } from 'types'

export const crateLink = (id: number, type: SearchType) => {
  if (type === 'city') return `/cities/${id}`
  if (type === 'country') return `/countries/${id}`
  if (type === 'place') return `/places/${id}`

  return `/${type}/${id}`
}
