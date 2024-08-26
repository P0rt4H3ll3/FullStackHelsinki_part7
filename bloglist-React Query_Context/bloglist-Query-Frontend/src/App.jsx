import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Box
} from '@mui/material'

import BlogsOverview from './components/BlogsOverview'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import User from './components/User'
import Users from './components/Users'
import Blog from './components/Blog'

import { useNotificationDispatch } from './NotificatonContext'
import { useUserDispatch, useUserValue } from './UserContext'

const App = () => {
  // --------------------------------HOOKS------------------------------------------
  const messageDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const user = useUserValue()
  const navigate = useNavigate()

  // --------------------------------HOOKS------------------------------------------

  // --------------------------------HANDLERS----------------------------------------
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'USER_LOGOUT' })
    messageDispatch({
      type: 'SET_NOTIFICATION',
      payload: 'logged out'
    })
    navigate('/login')
  }

  // --------------------------------HANDLERS----------------------------------------

  const padding = {
    padding: 5
  }

  //---------------------------------ENSURE USER IS NOT NULL---------------------------------
  if (user === null) {
    // Return a loading indicator or an empty div while the user is being initialized
    setTimeout(() => {
      return <div>Loading...</div>
    }, 5000)
  }
  // --------------------------------RETURN COMPONENTS----------------------------------------
  return (
    <Container sx={{ height: '100vh' }}>
      <div>
        <Typography
          sx={{ my: 4, textAlign: 'center', color: 'primary.main' }}
          variant="h2"
        >
          Blog App
        </Typography>
        <Notification />
      </div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          ></IconButton>
          <Button color="inherit" component={Link} to="/blogs">
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            users
          </Button>

          {/* This Box will push its contents to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {user === null ? (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <em>{user.name} logged in</em>
              <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/blogs" element={<BlogsOverview />} />
        <Route
          path="/users"
          element={user ? <Users /> : <Navigate replace to="/login" />}
        />
        <Route path="/users/:id" element={<User />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<BlogsOverview />} />
      </Routes>
    </Container>
  )
}

// --------------------------------RETURN COMPONENTS----------------------------------------

export default App
