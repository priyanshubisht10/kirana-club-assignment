// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <AppProvider i18n={en}>
    <App />
  </AppProvider>
  // </StrictMode>,
)
