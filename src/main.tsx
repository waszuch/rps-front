import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './style.css'
import { SocketProvider } from './contexts/SocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
    <App />
    </SocketProvider>
  </StrictMode>,
)
