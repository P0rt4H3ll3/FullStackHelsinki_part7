import { useState, useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import Notification from './components/Notification.jsx'
import BlogForm from './components/BlogForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer.js'
import { alreadyLoggedIn, userLogout } from './reducers/userAuthReducer.js'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ userAuth }) => userAuth.user)
  console.log('this is the user', user)
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(alreadyLoggedIn())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(userLogout())
  }
  const loginForm = () => {
    return <LoginForm />
  }

  const blogFormRef = useRef()
  const blogForm = () => {
    return (
      <Togglable buttonLable="new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          {blogForm()}
          <BlogList user={user} />
        </div>
      )}
    </div>
  )
}

export default App
