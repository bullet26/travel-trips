import { useContext } from 'react'
import { AccordionContextValue } from 'components/providers'

export const useAccordionContextValues = () => {
  const valuesContext = useContext(AccordionContextValue)

  if (!valuesContext) {
    throw new Error('useAccordionContextValues must be used within a AccordionContextValue!')
  }

  return valuesContext
}
