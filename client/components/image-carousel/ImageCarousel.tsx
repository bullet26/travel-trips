'use client'
import { FC } from 'react'
import { Carousel } from 'antd'
import Image from 'next/image'
import { ImageAttributesNest } from 'types'
import s from './ImageCarousel.module.scss'

interface ImageCarouselProps {
  images: ImageAttributesNest[]
}

export const ImageCarousel: FC<ImageCarouselProps> = (props) => {
  const { images } = props

  return (
    <>
      {images?.length && (
        <Carousel
          autoplay
          speed={500}
          infinite
          arrows
          dots={false}
          effect="fade"
          className={s.carousel}>
          {images.map((item) => (
            <div className={s.container} key={`img_${item.id}`}>
              <img className={s.backgroundImage} src={item.url} alt="background" />
              <Image
                width={800}
                height={350}
                src={item.url}
                className={s.image}
                alt="Picture of the city"
              />
            </div>
          ))}
        </Carousel>
      )}
    </>
  )
}
