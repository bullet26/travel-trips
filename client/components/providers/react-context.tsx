'use client'

import { createContext, ReactNode, useMemo, useState } from 'react'

type Msg = string | null

type ValueType = {
  infoMsg: Msg
  errorMsg: Msg
}

type ActionType = {
  setInfoMsg: (msg: Msg) => void
  setErrorMsg: (msg: Msg) => void
}

export const ContextValue = createContext<ValueType | null>(null)
export const ContextActions = createContext<ActionType | null>(null)

export const ContextProvider = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  const [infoMsg, setStateInfoMsg] = useState<Msg>(null)
  const [errorMsg, setStateErrorMsg] = useState<Msg>(null)

  const value = useMemo(() => ({ infoMsg, errorMsg }), [infoMsg, errorMsg])

  const setInfoMsg = (msg: Msg) => {
    setStateInfoMsg(msg)
    setTimeout(() => {
      setStateInfoMsg(null)
    }, 2000)
  }

  const setErrorMsg = (msg: Msg) => {
    setStateErrorMsg(msg)
    setTimeout(() => {
      setStateErrorMsg(null)
    }, 3000)
  }

  const actions = useMemo(
    () => ({
      setInfoMsg,
      setErrorMsg,
    }),
    [setInfoMsg, setErrorMsg],
  )

  return (
    <ContextValue.Provider value={value}>
      <ContextActions.Provider value={actions}>{children}</ContextActions.Provider>
    </ContextValue.Provider>
  )
}
