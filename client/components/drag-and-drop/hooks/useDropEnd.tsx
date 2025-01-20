import { useContextActions, useTanstackMutation } from 'hooks'
import { useEffect } from 'react'
import { TripDayNest, UnassignedPlacesNest, WishlistNest } from 'types'

export const useDropEnd = () => {
  const { setErrorMsg } = useContextActions()

  const addPlaceTD = useTanstackMutation<TripDayNest>({
    url: `trips-day/place/add`,
    method: 'PATCH',
  })

  const addPlaceUP = useTanstackMutation<UnassignedPlacesNest>({
    url: `unassigned-places/place/add`,
    method: 'PATCH',
  })

  const addPlaceWL = useTanstackMutation<WishlistNest>({
    url: `wishlists/place/add`,
    method: 'PATCH',
  })

  const movePlaceToUP = useTanstackMutation<TripDayNest>({
    url: `trips-day/place/move/up`,
    method: 'PATCH',
  })

  const movePlaceFromTDToTD = useTanstackMutation<TripDayNest>({
    url: `trips-day/place/move/td`,
    method: 'PATCH',
  })

  const movePlaceFromUPToTD = useTanstackMutation<UnassignedPlacesNest>({
    url: `unassigned-places/place/move`,
    method: 'PATCH',
  })

  const handleError = (error: Error | null) => {
    if (error?.message) setErrorMsg(error.message)
  }

  useEffect(() => handleError(addPlaceTD.error), [addPlaceTD.error])
  useEffect(() => handleError(addPlaceUP.error), [addPlaceUP.error])
  useEffect(() => handleError(addPlaceWL.error), [addPlaceWL.error])
  useEffect(() => handleError(movePlaceToUP.error), [movePlaceToUP.error])
  useEffect(() => handleError(movePlaceFromTDToTD.error), [movePlaceFromTDToTD.error])
  useEffect(() => handleError(movePlaceFromUPToTD.error), [movePlaceFromUPToTD.error])

  return (
    dragItem: {
      placeId: number
      sourceType: 'up' | 'td' | 'wl' | 'searchResult'
      sourceId: number | null
    },
    dropItem: { dropEffect: string; targetId: number; targetType: 'up' | 'td' | 'wl' } | null,
  ) => {
    if (!dragItem || !dropItem) return null

    const { placeId, sourceType, sourceId } = dragItem
    const { targetId, targetType } = dropItem

    const queryKeyMap = {
      addPlaceTD: [['trips-day', `${targetId}`]],
      addPlaceUP: [['unassigned-places', `${targetId}`]],
      addPlaceWL: [['wishlists', `${targetId}`]],
      movePlaceToUP: [
        [`trips-day`, `${sourceId}`],
        [`unassigned-places`, `${targetId}`],
      ],
      movePlaceFromTDToTD: [
        ['trips-day', `${sourceId}`],
        ['trips-day', `${targetId}`],
      ],
      movePlaceFromUPToTD: [
        ['unassigned-places', `${sourceId}`],
        ['trips-day', `${targetId}`],
      ],
    }

    if (sourceType === 'searchResult' && targetType === 'up') {
      addPlaceUP.mutate({
        id: targetId,
        body: { placeId },
        queryKeyWithId: queryKeyMap.addPlaceUP,
      })
      return addPlaceUP
    }

    if (sourceType === 'searchResult' && targetType === 'td') {
      addPlaceTD.mutate({
        id: targetId,
        body: { placeId },
        queryKeyWithId: queryKeyMap.addPlaceTD,
      })
      return addPlaceTD
    }

    if (sourceType === 'searchResult' && targetType === 'wl') {
      addPlaceWL.mutate({
        id: targetId,
        body: { placeId },
        queryKeyWithId: queryKeyMap.addPlaceWL,
      })
      return addPlaceWL
    }

    if (sourceType === 'up' && targetType === 'up') {
      return null
    }

    if (sourceType === 'up' && targetType === 'td') {
      movePlaceFromUPToTD.mutate({
        id: sourceId,
        body: { placeId, tripDayId: targetId },
        queryKeyWithId: queryKeyMap.movePlaceFromUPToTD,
      })
      return movePlaceFromUPToTD
    }

    if (sourceType === 'td' && targetType === 'td') {
      movePlaceFromTDToTD.mutate({
        id: sourceId,
        body: { placeId, tripDayId: targetId },
        queryKeyWithId: queryKeyMap.movePlaceFromTDToTD,
      })
      return movePlaceFromTDToTD
    }

    if (sourceType === 'td' && targetType === 'up') {
      movePlaceToUP.mutate({
        id: sourceId,
        body: { placeId, unassignedPlacesId: targetId },
        queryKeyWithId: queryKeyMap.movePlaceToUP,
      })
      return movePlaceToUP
    }

    return null
  }
}
