import { useState } from 'react'
import { Button, Divider } from 'antd'
import { useTanstackQuery } from 'hooks'
import { DragCard } from 'components'
import { CityNest, CountryNest } from 'types'
import clsx from 'clsx'
import s from './PlacesFromCity.module.scss'

interface PlacesFromCity {
  dragType: string
}

export const PlacesFromCity = (props: PlacesFromCity) => {
  const { dragType } = props

  const [countryId, setICountryId] = useState<null | number>(null)
  const [cityId, setICityId] = useState<null | number>(null)

  const queryCountries = useTanstackQuery<CountryNest[]>({
    url: 'countries',
    queryKey: ['countries'],
  })

  const { data: city } = useTanstackQuery<CityNest>({
    url: `cities/${cityId}`,
    queryKey: ['cities', `${cityId}`],
  })

  const citiesInSelectedCountry = queryCountries.data?.find(({ id }) => id === countryId)?.cities

  return (
    <>
      {queryCountries.data ? (
        <>
          <div className={s.wrapper}>
            {queryCountries.data?.map((item) => (
              <Button
                key={item.id}
                className={clsx({ [s.active]: item.id === countryId })}
                onClick={() => setICountryId(item.id)}>
                <div className={s.card}>
                  <p>{item.name}</p>
                </div>
              </Button>
            ))}
          </div>
          <Divider style={{ margin: '7px 0' }} />
        </>
      ) : (
        <Button type="text">No any country</Button>
      )}

      {citiesInSelectedCountry ? (
        <>
          <div className={s.wrapper}>
            {citiesInSelectedCountry?.map((item) => (
              <Button
                key={item.id}
                className={clsx({ [s.active]: item.id === cityId })}
                onClick={() => setICityId(item.id)}>
                <div className={s.card}>
                  <p>{item.name}</p>
                </div>
              </Button>
            ))}
          </div>
          <Divider style={{ margin: '5px 0' }} />
        </>
      ) : (
        <Button type="text">No any city</Button>
      )}

      {city?.places?.length ? (
        <div className={s.placesWrapper}>
          {city.places.map((item) => (
            <DragCard
              key={`place-searchResult-${item.id}`}
              type="searchResult"
              placeId={item.id}
              dragType={dragType}
              title={item.name}
              {...item}
            />
          ))}
        </div>
      ) : (
        <Button type="text">No any places</Button>
      )}
    </>
  )
}
