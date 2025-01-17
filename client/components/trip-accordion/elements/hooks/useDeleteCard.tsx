import { useContextActions, useTanstackMutation } from 'hooks'
import { useEffect } from 'react'
import { TripDayNest, UnassignedPlacesNest } from 'types'

export const useDeleteCard = () => {
  const { setErrorMsg } = useContextActions()

  const removePlaceTD = useTanstackMutation<TripDayNest>({
    url: `trips-day/place/remove`,
    method: 'PATCH',
  })

  const removePlaceUP = useTanstackMutation<UnassignedPlacesNest>({
    url: `unassigned-places/place/remove`,
    method: 'PATCH',
  })

  const handleError = (error: Error | null) => {
    if (error?.message) setErrorMsg(error.message)
  }

  useEffect(() => handleError(removePlaceTD.error), [removePlaceTD.error])
  useEffect(() => handleError(removePlaceUP.error), [removePlaceUP.error])

  return ({ id, type, placeId }: { type: 'up' | 'td'; placeId: number; id: number }) => {
    if (!placeId || !type || !id) return null

    const queryKeyMap = {
      removePlaceTD: [['trips-day', `${id}`]],
      removePlaceUP: [['unassigned-places', `${id}`]],
    }

    if (type === 'up') {
      removePlaceUP.mutate({
        id,
        body: { placeId },
        queryKeyWithId: queryKeyMap.removePlaceUP,
      })

      return removePlaceUP
    }

    if (type === 'td') {
      removePlaceTD.mutate({ id, body: { placeId }, queryKeyWithId: queryKeyMap.removePlaceTD })
      return removePlaceTD
    }
  }
}
