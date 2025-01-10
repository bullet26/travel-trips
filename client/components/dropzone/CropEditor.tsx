'use client'

import { useRef } from 'react'
import { Button, Tooltip } from 'antd'
import {
  CheckOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  VerticalAlignMiddleOutlined,
} from '@ant-design/icons'
import { CropperRef, Cropper, Coordinates } from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'
import s from './DropZone.module.scss'

interface CropEditorProps {
  imageSrc: string | null
  onChange: (file: Blob | null) => void
  onAnotherImageClick: () => void
}

type ImgSize = { width: number; height: number }

export const CropEditor = (props: CropEditorProps) => {
  const { imageSrc, onChange, onAnotherImageClick } = props

  const cropperRef = useRef<CropperRef>(null)

  const onEditComplete = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.getCanvas()
      if (croppedCanvas) {
        croppedCanvas.toBlob(async (blob) => {
          onChange(blob)
        })
      }
    }
    onAnotherImageClick()
  }

  const rotate = (angle: number) => {
    if (cropperRef.current) {
      cropperRef.current.rotateImage(angle)
    }
  }

  const flip = ({ horizontal, vertical }: { [key: string]: boolean }) => {
    if (cropperRef.current) {
      cropperRef.current.flipImage(horizontal, vertical)
    }
  }

  const calcDefaultSize = ({
    imageSize,
    visibleArea,
  }: {
    imageSize: ImgSize
    visibleArea: Coordinates | null
  }) => {
    return {
      width: (visibleArea || imageSize).width * 0.95,
      height: (visibleArea || imageSize).height * 0.95,
    }
  }

  return (
    <div>
      <Tooltip title="Rotate 90&deg; to the left" zIndex={999999}>
        <Button type="text" onClick={() => rotate(-90)}>
          <RotateLeftOutlined />
        </Button>
      </Tooltip>
      <Tooltip title="Rotate 90&deg; to the right" zIndex={999999}>
        <Button type="text" onClick={() => rotate(90)}>
          <RotateRightOutlined />
        </Button>
      </Tooltip>
      <Tooltip title="Flip vertical" zIndex={999999}>
        <Button type="text" onClick={() => flip({ vertical: true })}>
          <VerticalAlignMiddleOutlined />
        </Button>
      </Tooltip>
      <Tooltip title="Flip horizontal" zIndex={999999}>
        <Button type="text" onClick={() => flip({ horizontal: true })}>
          <VerticalAlignMiddleOutlined style={{ transform: 'rotate(-90deg)' }} />
        </Button>
      </Tooltip>
      <Button type="dashed" icon={<CheckOutlined />} onClick={onEditComplete}>
        Complete
      </Button>
      <Cropper
        ref={cropperRef}
        src={imageSrc}
        className={s.cropper}
        stencilProps={{
          grid: true,
        }}
        defaultSize={calcDefaultSize}
      />
    </div>
  )
}
