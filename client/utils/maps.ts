import { PlaceNest } from 'types'

export const openGoogleMaps = (place: PlaceNest) => {
  if (!place) return

  const { latitude, longitude } = place
  if (!latitude || !longitude) return

  const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`

  if (typeof window !== 'undefined') {
    window.open(url, '_blank')
  }
}

export const openPlacesGoogleMaps = (
  places: Pick<PlaceNest, 'latitude' | 'longitude' | 'id' | 'name' | 'images'>[] | undefined,
) => {
  if (!places || places.length === 0) return

  const coordinates = places.map(({ latitude, longitude }) => `${latitude},${longitude}`)

  const destination = coordinates.at(-1)
  if (!destination) return

  const waypoints = coordinates.slice(0, -1)?.join('|')

  const url = `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${destination}${
    waypoints ? `&waypoints=${waypoints}` : ''
  }&travelmode=walking`

  if (typeof window !== 'undefined') {
    window.open(url, '_blank')
  }
}
