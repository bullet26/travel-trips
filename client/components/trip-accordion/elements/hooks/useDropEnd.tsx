import { useContextActions, useTanstackMutation } from 'hooks'
import { useEffect } from 'react'
import { TripDayNest, UnassignedPlacesNest } from 'types'

export const useDropEnd = () => {
  const { setErrorMsg } = useContextActions()

  const addPlaceTD = useTanstackMutation<TripDayNest>({
    url: `trips-day/place/add`,
    method: 'PATCH',
    queryKey: ['trips-day'],
  })

  const addPlaceUP = useTanstackMutation<UnassignedPlacesNest>({
    url: `unassigned-places/place/add`,
    method: 'PATCH',
    queryKey: ['unassigned-places'],
  })

  const movePlaceToUP = useTanstackMutation<TripDayNest>({
    url: `trips-day/place/move/up`,
    method: 'PATCH',
    queryKey: ['trips-day', 'unassigned-places'],
  })

  const movePlaceFromTDToTD = useTanstackMutation<TripDayNest>({
    url: `trips-day/place/move/td`,
    method: 'PATCH',
    queryKey: ['trips-day'],
  })

  const movePlaceFromUPToTD = useTanstackMutation<UnassignedPlacesNest>({
    url: `unassigned-places/place/move`,
    method: 'PATCH',
    queryKey: ['trips-day', 'unassigned-places'],
  })

  const handleError = (error: Error | null) => {
    if (error?.message) setErrorMsg(error.message)
  }

  useEffect(() => handleError(addPlaceTD.error), [addPlaceTD.error])
  useEffect(() => handleError(addPlaceUP.error), [addPlaceUP.error])
  useEffect(() => handleError(movePlaceToUP.error), [movePlaceToUP.error])
  useEffect(() => handleError(movePlaceFromTDToTD.error), [movePlaceFromTDToTD.error])
  useEffect(() => handleError(movePlaceFromUPToTD.error), [movePlaceFromUPToTD.error])

  return (
    dragItem: {
      placeId: number
      sourceType: 'up' | 'td' | 'searchResult'
      sourceId: number | null
    },
    dropItem: { dropEffect: string; targetId: number; targetType: 'up' | 'td' } | null,
  ) => {
    if (!dragItem || !dropItem) return null

    const { placeId, sourceType, sourceId } = dragItem
    const { targetId, targetType } = dropItem

    if (sourceType === 'searchResult' && targetType === 'up') {
      addPlaceUP.mutate({
        id: targetId,
        body: { placeId },
        queryKeyWithId: [['unassigned-places', `${targetId}`]],
      })
      return addPlaceUP
    }

    if (sourceType === 'searchResult' && targetType === 'td') {
      addPlaceTD.mutate({
        id: targetId,
        body: { placeId },
        queryKeyWithId: [['trips-day', `${targetId}`]],
      })
      return addPlaceTD
    }

    if (sourceType === 'up' && targetType === 'up') {
      return null
    }

    if (sourceType === 'up' && targetType === 'td') {
      movePlaceFromUPToTD.mutate({
        id: sourceId,
        body: { placeId, tripDayId: targetId },
        queryKeyWithId: [
          [`unassigned-places`, `${sourceId}`],
          [`trips-day`, `${targetId}`],
        ],
      })
      return movePlaceFromUPToTD
    }

    if (sourceType === 'td' && targetType === 'td') {
      movePlaceFromTDToTD.mutate({
        id: sourceId,
        body: { placeId, tripDayId: targetId },
        queryKeyWithId: [
          [`trips-day`, `${sourceId}`],
          [`trips-day`, `${targetId}`],
        ],
      })
      return movePlaceFromTDToTD
    }

    if (sourceType === 'td' && targetType === 'up') {
      movePlaceToUP.mutate({
        id: sourceId,
        body: { placeId, unassignedPlacesId: targetId },
        queryKeyWithId: [
          [`trips-day`, `${sourceId}`],
          [`unassigned-places`, `${targetId}`],
        ],
      })
      return movePlaceToUP
    }

    return null
  }
}
