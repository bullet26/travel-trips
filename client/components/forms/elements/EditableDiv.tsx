import { FC, RefObject } from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import s from './Input.module.scss'

interface InputProps {
  name: string
  style?: object
  placeholder?: string
  disabled?: boolean
  innerRef?: RefObject<HTMLElement>
  value: string
  setValue: (value: string) => void
}

export const EditableDiv: FC<InputProps> = (props) => {
  const { style, placeholder, innerRef, disabled, value, setValue } = props

  const onChange = (e: ContentEditableEvent) => {
    const { value } = e.target
    setValue(value)
  }

  return (
    <ContentEditable
      tagName="div"
      html={value || ''}
      className={s.inputDiv}
      data-placeholder={placeholder}
      style={style}
      onChange={onChange}
      innerRef={innerRef}
      disabled={disabled}
    />
  )
}
