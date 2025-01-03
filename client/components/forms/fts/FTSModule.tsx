import { Collapse, CollapseProps } from 'antd'
import { Control, Controller, FieldError, FieldErrors, FieldValues, Path } from 'react-hook-form'
import { FTSInputs } from './FTSInputs'
import s from '../Form.module.scss'

interface FTSModuleProps<T extends FieldValues> {
  control: Control<T>
  errors: FieldErrors<T>
}

export const FTSModule = <T extends FieldValues>(props: FTSModuleProps<T>) => {
  const { control, errors } = props

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: <div className={s.label}>Translations</div>,
      children: (
        <div>
          <Controller
            name={'translations' as Path<T>}
            control={control}
            render={({ field }) => (
              <>
                {field?.value?.map((_item: string, index: number) => (
                  <FTSInputs key={index} index={index} field={field} errors={errors} />
                ))}
              </>
            )}
          />
          <div className={s.error}>{(errors.translations as FieldError)?.message}</div>
        </div>
      ),
    },
  ]

  return <Collapse ghost items={items} size="small" />
}
