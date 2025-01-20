import { Card, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import s from './Card.module.scss'

interface CardWithDeleteProps {
  id: number
  title: string
  entity?: string
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  withoutCard?: boolean
}

export const CardWithDelete = (props: CardWithDeleteProps) => {
  const { id, onEdit, title, onDelete, entity = '', withoutCard = false } = props

  const cardBody = (
    <div className={s.cardEditable}>
      <p onClick={() => onEdit(id)}>{title}</p>
      <Popconfirm
        title={`Delete ${entity} ${title}`}
        description={`Are you sure to delete ${entity} ${title} from DB?`}
        onConfirm={() => onDelete(id)}>
        <DeleteOutlined />
      </Popconfirm>
    </div>
  )

  return withoutCard ? cardBody : <Card>{cardBody}</Card>
}
