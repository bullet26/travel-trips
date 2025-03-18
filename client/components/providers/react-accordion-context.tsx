'use client'

import { createContext, ReactNode, useMemo, useState } from 'react'

export type CPType = {
  placeId: number
  sourceType: 'up' | 'td' | 'wl' | 'searchResult'
  sourceId: number | null
} | null

type ValueType = {
  cutPlace: CPType
}

type ActionType = {
  setCutPlace: (placeInfo: CPType) => void
}

export const AccordionContextValue = createContext<ValueType | null>(null)
export const AccordionContextActions = createContext<ActionType | null>(null)

export const AccordionContextProvider = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  const [cutPlace, setCutPlace] = useState<CPType>(null)

  const value = useMemo(() => ({ cutPlace }), [cutPlace])

  const actions = useMemo(
    () => ({
      setCutPlace,
    }),
    [setCutPlace],
  )

  return (
    <AccordionContextValue.Provider value={value}>
      <AccordionContextActions.Provider value={actions}>
        {children}
      </AccordionContextActions.Provider>
    </AccordionContextValue.Provider>
  )
}
