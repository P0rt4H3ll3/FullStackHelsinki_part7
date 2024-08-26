import { Routes, Route, Link, Navigate } from 'react-router-dom'

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

  // --------------------------------HOOKS------------------------------------------

  // --------------------------------HANDLERS----------------------------------------
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'USER_LOGOUT' })
    messageDispatch({
      type: 'SET_NOTIFICATION',
      payload: 'logged out'
    })
  }

  // --------------------------------HANDLERS----------------------------------------

  const padding = {
    padding: 5
  }
  // --------------------------------RETURN COMPONENTS----------------------------------------
  return (
    <>
      <div>
        <h2>blogs</h2>
        <Notification />
      </div>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        <Link style={padding} to="/blogs">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        {user === null ? (
          <Link style={padding} to="/login">
            login
          </Link>
        ) : (
          <>
            <p>{user.name} logged in </p>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
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
    </>
  )
}

// --------------------------------RETURN COMPONENTS----------------------------------------

export default App
