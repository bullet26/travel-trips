'use client'

import { DndProvider as DndProviderLib } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export const DndProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <DndProviderLib backend={HTML5Backend}>{children}</DndProviderLib>
}
