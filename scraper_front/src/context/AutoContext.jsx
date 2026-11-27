import { createContext, useContext, useState } from 'react'

const AutoContext = createContext()

export function AutoProvider({ children }) {
  const [rezultati, setRezultati] = useState(null)
  const [loading, setLoading] = useState(false)
  const [greska, setGreska] = useState('')

  return (
    <AutoContext.Provider value={{ rezultati, setRezultati, loading, setLoading, greska, setGreska }}>
      {children}
    </AutoContext.Provider>
  )
}

export function useAuto() {
  return useContext(AutoContext)
}
