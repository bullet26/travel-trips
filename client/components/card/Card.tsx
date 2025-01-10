'use client'
import Link from 'next/link'
import { Card as AntdCard, Tooltip } from 'antd'
import Image from 'next/image'
import { cardDefault } from 'assets/images'
import s from './Card.module.scss'

interface CardProps {
  imgUrl?: string
  title: string
  routeHref: string
}

const { Meta } = AntdCard

export const Card = (props: CardProps) => {
  const { imgUrl, title, routeHref } = props

  const BookCover = imgUrl ? (
    <Image width={145} height={215} src={imgUrl} className={s.image} alt="Picture of the city" />
  ) : (
    <Image
      width={145}
      height={215}
      src={cardDefault}
      className={s.image}
      alt="Picture of the city"
    />
  )

  return (
    <Link href={routeHref}>
      <Tooltip title={title} placement="rightTop" color="#800020">
        <AntdCard hoverable className={s.card} cover={BookCover}>
          <Meta title={title} />
        </AntdCard>
      </Tooltip>
    </Link>
  )
}
