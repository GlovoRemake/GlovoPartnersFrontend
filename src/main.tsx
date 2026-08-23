import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './store/index.ts'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { NavigationProvider } from './providers/NavigationProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <NavigationProvider />
        <App />
      </StrictMode>
    </BrowserRouter>
  </Provider>,
)
