import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AppWithAuth from './AppWithAuth.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppWithAuth>
        <App />
      </AppWithAuth>
    </AuthProvider>
  </React.StrictMode>,
)
