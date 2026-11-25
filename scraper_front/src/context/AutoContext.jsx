import { createContext, useContext, useState } from 'react'

const AutoContext = createContext()

export function AutoProvider({ children }) {
  const [podaci, setPodaci] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <AutoContext.Provider value={{ podaci, setPodaci, loading, setLoading }}>
      {children}
    </AutoContext.Provider>
  )
}

export function useAuto() {
  return useContext(AutoContext)
}
