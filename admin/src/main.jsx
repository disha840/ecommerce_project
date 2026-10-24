import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './AuthProvider.jsx'
import { Provider } from 'react-redux'
import { Store } from './redux/Store.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
    <AuthProvider>
        <App />
    </AuthProvider>
    </Provider>
  </StrictMode>,
)