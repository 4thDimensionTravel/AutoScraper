import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AutoProvider } from './context/AutoContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AutoProvider>
      <App />
    </AutoProvider>
  </StrictMode>,
)
