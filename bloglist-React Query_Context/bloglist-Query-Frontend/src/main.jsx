import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './NotificatonContext'
import { UserContextProvider } from './UserContext'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6D4C41' // Coffee Brown
    },
    secondary: {
      main: '#D7CCC8' // Creamy Beige
    },
    background: {
      default: '#FFFFFF' // White background
    },
    text: {
      primary: '#3E2723', // Dark brown for text
      secondary: '#5D4037' // A slightly lighter brown for secondary text
    },
    divider: '#BCAAA4' // A very light brown for dividers
  }
})

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <NotificationContextProvider>
      <UserContextProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <App />
          </Router>
        </QueryClientProvider>
      </UserContextProvider>
    </NotificationContextProvider>
  </ThemeProvider>
)
