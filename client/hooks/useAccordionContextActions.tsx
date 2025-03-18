import { useContext } from 'react'
import { AccordionContextActions } from 'components/providers'

export const useAccordionContextActions = () => {
  const actionsContext = useContext(AccordionContextActions)

  if (!actionsContext) {
    throw new Error('useAccordionContextActions must be used within a ContextActions!')
  }

  return actionsContext
}
