'use client'

import { useEffect, useState } from 'react'
import { DropZone } from './DropZone'
import { CropEditor } from './CropEditor'

interface DropZoneProps {
  file: Blob | null
  onChange: (file: Blob | null) => void
}

export const ImageUploadBlock = (props: DropZoneProps) => {
  const { onChange, file } = props

  const [mode, setMode] = useState<'upload' | 'edit'>('upload')
  const [fileURL, setFileURL] = useState<null | string>(null)

  useEffect(() => {
    if (!file) {
      setFileURL(null)
    }
  }, [file])

  const onChangeFile = (file: Blob | null) => {
    onChange(file)

    if (file) {
      setFileURL(URL.createObjectURL(file))
    } else {
      setFileURL(null)
    }
  }

  const onEditModeChose = () => setMode('edit')
  const onUploadModeChose = () => setMode('upload')

  return (
    <>
      {mode === 'upload' && (
        <DropZone fileURL={fileURL} onChange={onChangeFile} onEditClick={onEditModeChose} />
      )}
      {mode === 'edit' && (
        <CropEditor
          imageSrc={fileURL}
          onChange={onChangeFile}
          onAnotherImageClick={onUploadModeChose}
        />
      )}
    </>
  )
}
