'use client'

import { Button } from 'antd'
import { FC, useState, useRef, DragEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import s from './DropZone.module.scss'

interface DropZoneProps {
  fileURL: string | null
  onChange: (file: Blob | null) => void
  onEditClick: () => void
}

export const DropZone: FC<DropZoneProps> = (props) => {
  const { onChange, fileURL, onEditClick } = props

  const [text, setText] = useState('Drag and Drop here or click')

  const dropzoneRef = useRef<HTMLDivElement>(null)

  const handleClickDropZone = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onChange(event.target.files[0])
    }
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setText('Drop file here')
    if (dropzoneRef.current) {
      dropzoneRef.current.style.backgroundColor = 'lightgray'
      dropzoneRef.current.style.color = '#000'
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.stopPropagation()
    event.preventDefault()
    if (dropzoneRef.current) {
      dropzoneRef.current.style.backgroundColor = ''
      dropzoneRef.current.style.color = ''
    }

    if (event.dataTransfer?.files.length) {
      onChange(event.dataTransfer.files[0])
    }
  }

  const handleCancel = () => {
    setText('Drag and Drop here or click')
    onChange(null)

    if (dropzoneRef.current) {
      dropzoneRef.current.style.border = ''
    }
  }

  return (
    <div>
      <label htmlFor="bookCover" className={s.label}>
        <div
          className={s.dropZoneWrapper}
          ref={dropzoneRef}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e)}>
          {fileURL ? <Image src={fileURL} alt="book cover" width={297} height={297} /> : text}
        </div>
      </label>
      <input
        type="file"
        id="bookCover"
        name="bookCover"
        accept=".jpg, .jpeg, .png, .webp"
        className={s.hide}
        onChange={(e) => handleClickDropZone(e)}
      />
      <div className={s.dzBtnWrapper}>
        <Button onClick={onEditClick}>Edit</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </div>
    </div>
  )
}
