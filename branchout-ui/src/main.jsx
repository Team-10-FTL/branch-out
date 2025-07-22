import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './components/App/App'
import { CustomThemeProvider } from './components/UISwitch/ThemeContext.jsx';
import './index.css'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <CustomThemeProvider>
        <App />
      </CustomThemeProvider>
    </ClerkProvider>
  //* </StrictMode>, */}
)
