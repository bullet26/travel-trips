'use client'

import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import { Spin } from 'antd'
import { useRouter } from 'next/navigation'
import { useTanstackQuery } from 'hooks'
import { CityNest } from 'types'
import { createGradientIcon } from './utils'

const containerStyle = {
  width: '100%',
  height: '77vh',
}

const center = { lat: 50.4501, lng: 30.5234 }

export const GoogleMaps = () => {
  const router = useRouter()

  const {
    data = [],
    isSuccess,
    isError,
  } = useTanstackQuery<CityNest[]>({
    url: 'cities',
    queryKey: ['cities'],
  })

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  })

  return (
    <>
      {isLoaded && isSuccess ? (
        <>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4} mapTypeId="hybrid">
            {data.map(({ latitude, longitude, country, id }) => (
              <Marker
                key={id}
                position={{ lat: latitude, lng: longitude }}
                icon={{
                  url: createGradientIcon(country?.name || ''),
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                onClick={() => {
                  router.push(`/cities/${id}`)
                }}
              />
            ))}
          </GoogleMap>
        </>
      ) : (
        <Spin size="large" />
      )}
      {(loadError || isError) && (
        <div style={{ color: '#fff', textAlign: 'center' }}>
          Map cannot be loaded right now, sorry.
        </div>
      )}
    </>
  )
}
