import { useEffect, useRef, useContext } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification.jsx'
import BlogForm from './components/BlogForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import blogService from './services/blogs'

import Togglable from './components/Togglable.jsx'
import { useQuery } from '@tanstack/react-query'

import { useNotificationDispatch } from './NotificatonContext.jsx'
import { useUserDispatch, useUserValue } from './UserContext.jsx'

const App = () => {
  // --------------------------------HOOKS------------------------------------------
  const messageDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const user = useUserValue()
  const blogFormRef = useRef()
  // --------------------------------HOOKS------------------------------------------

  // --------------------------------QUERY-------------------------------------------
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => await blogService.getAll(),
    refetchOnWindowFocus: false
  })
  const blogs = result.data

  // --------------------------------QUERY-------------------------------------------

  // --------------------------------HANDLERS----------------------------------------
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'USER_LOGOUT' })
    messageDispatch({
      type: 'SET_NOTIFICATION',
      payload: 'logged out'
    })
  }

  const blogForm = () => {
    return (
      <Togglable buttonLable="new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
    )
  }

  // --------------------------------HANDLERS----------------------------------------

  // --------------------------------RETURN COMPONENTS----------------------------------------
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {user === null ? (
        <LoginForm />
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          {blogForm()}
          {(blogs ? [...blogs] : [])
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog key={blog.id} blog={blog} username={user.username} />
            ))}
        </div>
      )}
    </div>
  )
}

// --------------------------------RETURN COMPONENTS----------------------------------------

export default App
