'use client'
import { useState, useEffect, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api'
import { Button, Modal, Spin } from 'antd'
import { Coordinates } from 'types'

interface MapComponentProps {
  latitude?: number
  longitude?: number
  setCoordinates: ({ latitude, longitude }: Coordinates) => void
}

const containerStyle = {
  width: '100%',
  height: '77vh',
}

const center = { lat: 50.4501, lng: 30.5234 }

export const MapComponent = (props: MapComponentProps) => {
  const { setCoordinates, latitude, longitude } = props

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  })

  const [marker, setMarker] = useState(center)
  const [isModalOpen, setModalStatus] = useState(false)

  const autocompleteRef = useRef<google.maps.places.Autocomplete>(null)

  useEffect(() => {
    if (!latitude || !longitude) return

    setMarker({ lat: latitude, lng: longitude })
  }, [latitude, longitude])

  const showMap = () => setModalStatus(true)
  const hideMap = () => setModalStatus(false)

  const onConfirm = () => {
    setCoordinates({ latitude: marker.lat, longitude: marker.lng })
    hideMap()
  }

  const onMapClick = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat()
    const lng = event.latLng?.lng()

    if (!lat || !lng) return

    setMarker({ lat, lng })
  }

  const onPlaceChanged = () => {
    if (!autocompleteRef?.current) return
    const place = autocompleteRef.current.getPlace()

    if (!place?.geometry?.location) return

    const newMarker = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    }
    setMarker(newMarker)
  }

  return (
    <>
      <Button shape="round" onClick={showMap}>
        Choose on map
      </Button>

      <Modal
        title="Choose coordinates"
        open={isModalOpen}
        centered
        onOk={onConfirm}
        onCancel={hideMap}
        width={1000}>
        {isLoaded ? (
          <>
            <Autocomplete
              onLoad={(ref) => (autocompleteRef.current = ref)}
              onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                placeholder="Search google maps"
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              />
            </Autocomplete>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={marker}
              zoom={10}
              mapTypeId="hybrid"
              onClick={onMapClick}>
              <Marker position={marker} />
            </GoogleMap>
          </>
        ) : (
          <Spin size="large" />
        )}
        {loadError && (
          <div style={{ color: '#fff', textAlign: 'center' }}>
            Map cannot be loaded right now, sorry.
          </div>
        )}
      </Modal>
    </>
  )
}
