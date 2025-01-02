import { Button, Input } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import s from '../Form.module.scss'
import { ControllerRenderProps, FieldErrors, FieldValues, Path } from 'react-hook-form'

interface FTSInputsProps<T extends FieldValues> {
  type: 'translations' | 'synonyms'
  index: number
  field: ControllerRenderProps<T, Path<T>>
  errors: FieldErrors<T>
}

export const FTSInputs = <T extends FieldValues>(props: FTSInputsProps<T>) => {
  const { type, index, field, errors } = props

  return (
    <div>
      <div className={s.inputREmoveWrapper}>
        <Button
          type="dashed"
          onClick={() => {
            if (field.value.length === 1) return
            const updatedArray = field.value.toSpliced(index, 1)
            field.onChange(updatedArray)
          }}
          icon={<DeleteOutlined />}
        />
        <Input
          {...field}
          value={field.value?.at(index)}
          onChange={(e) => {
            const updatedArray = [...field.value]
            updatedArray[index] = e.target.value
            field.onChange(updatedArray)
          }}
          placeholder={`Enter ${type} ${index + 1}`}
        />
        {field?.value.length - 1 === index && (
          <Button
            type="dashed"
            onClick={() => field.onChange([...field.value, ''])}
            icon={<PlusOutlined />}
          />
        )}
      </div>
      <div className={s.error}>
        {Array.isArray(errors[type]) && (
          <div className={s.error}>{errors[type][index]?.message}</div>
        )}
      </div>
    </div>
  )
}
