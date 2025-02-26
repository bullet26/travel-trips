'use client'

import { GoogleMaps } from 'components'
import s from './Maps.module.scss'

const CitiesOnMap = () => {
  return (
    <>
      <div className={s.wrapper}>GoogleMaps</div>
      <GoogleMaps />
    </>
  )
}

export default CitiesOnMap
