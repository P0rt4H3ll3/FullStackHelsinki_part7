import { useRef } from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom'

import Blogs from './components/Blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import User from './components/User'
import Users from './components/Users'
import Togglable from './components/Togglable'

import { useNotificationDispatch } from './NotificatonContext'
import { useUserDispatch, useUserValue } from './UserContext'

const App = () => {
  // --------------------------------HOOKS------------------------------------------
  const messageDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const user = useUserValue()
  const blogFormRef = useRef()

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
      <Router>
        <div>
          <Link style={padding} to="/">
            home
          </Link>
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
            <div>
              <p>{user.name} logged in</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
        <Routes>
          {/* <Route path="/blogs/:id" element={<Blog blog={blog} />} /> */}
          <Route path="/blogs" element={<Blogs blogFormRef={blogFormRef} />} />
          <Route
            path="/users"
            element={user ? <Users /> : <Navigate replace to="/login" />}
          />
          <Route path="/users/:id" element={<User />} />
          <Route path="/login" element={<LoginForm />} />
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
      </Router>
    </>
  )
}

// --------------------------------RETURN COMPONENTS----------------------------------------

export default App
