import { useContext } from 'react'
import { ContextActions } from 'components/providers'

export const useContextActions = () => {
  const actionsContext = useContext(ContextActions)

  if (!actionsContext) {
    throw new Error('useContextActions must be used within a ContextActions!')
  }

  return actionsContext
}
