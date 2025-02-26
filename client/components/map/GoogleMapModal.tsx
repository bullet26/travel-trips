'use client'
import { useState, useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker, Autocomplete, Libraries } from '@react-google-maps/api'
import { Button, Input, Modal, Spin } from 'antd'
import { Coordinates } from 'types'
import s from './MapComponent.module.scss'

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

const libraries: Libraries = ['places']

export const GoogleMapModal = (props: MapComponentProps) => {
  const { setCoordinates, latitude, longitude } = props

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  })

  const [marker, setMarker] = useState(center)
  const [isModalOpen, setModalStatus] = useState(false)
  const [searchResult, setSearchResult] = useState<google.maps.places.Autocomplete>()

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

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => setSearchResult(autocomplete)

  const onPlaceChanged = () => {
    if (!searchResult) return
    const place = searchResult.getPlace()

    if (!place?.geometry?.location) return

    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()

    if (!lat || !lng) return

    setMarker({ lat, lng })
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
        destroyOnClose
        onOk={onConfirm}
        onCancel={hideMap}
        zIndex={1010}
        width={1000}>
        {isLoaded ? (
          <>
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
              className={s.autocomplete}>
              <Input type="text" placeholder="Search google maps" />
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
