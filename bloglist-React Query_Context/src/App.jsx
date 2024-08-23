import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification.jsx'
import BlogForm from './components/BlogForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable.jsx'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useNotificationDispatch } from './NotificatonContext.jsx'

const App = () => {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(null)
  const messageDispatch = useNotificationDispatch()

  const newBlogMutation = useMutation({
    mutationFn: async (newBlogObject) =>
      await blogService.create(newBlogObject),
    onSuccess: (blogResponse) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      messageDispatch({
        type: 'SET_NOTIFICATION',
        payload: `new blog ${blogResponse.title} by ${blogResponse.author} added`
      })
    },
    onError: (exception) => {
      messageDispatch({
        type: 'SET_NOTIFICATION',
        payload: `An Error Occured while creating a new blog:${exception.response.data.error}`
      })
    }
  })

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => await blogService.getAll()
  })

  const blogs = result.data

  useEffect(() => {
    //user already logged in,
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createNewBlog = async (newBlogObject) => {
    blogFormRef.current.toggleVisibility() // creating a new blog, this toggles visibility
    newBlogMutation.mutate(newBlogObject)
  }

  // const updateBlog = async (updatedBlogObject) => {
  //   const { id } = updatedBlogObject
  //   try {
  //     const updateBlogRes = await blogService.update(id, updatedBlogObject)
  //     setBlogs(blogs.map((blog) => (blog.id !== id ? blog : updateBlogRes)))
  //     messageDispatch({
  //       type: 'SET_NOTIFICATION',
  //       payload: `blog ${updateBlogRes.title} by ${updateBlogRes.author} was updated`
  //     })
  //   } catch (exception) {
  //     if (
  //       exception.response &&
  //       exception.response.data &&
  //       exception.response.data.error
  //     ) {
  //       messageDispatch({
  //         type: 'SET_NOTIFICATION',
  //         payload: `An Error Occured while updating the blog: ${exception.response.data.error}`
  //       })
  //     } else {
  //       messageDispatch({
  //         type: 'SET_NOTIFICATION',
  //         payload: `An Error Occured: ${exception.message}`
  //       })
  //     }
  //   }
  // }

  // const deleteBlog = async (id) => {
  //   try {
  //     await blogService.deleteBlog(id)
  //     setBlogs(blogs.filter((blog) => blog.id !== id))
  //     messageDispatch({
  //       type: 'SET_NOTIFICATION',
  //       payload: 'deleted blog'
  //     })
  //   } catch (exception) {
  //     if (
  //       exception.response &&
  //       exception.response.data &&
  //       exception.response.data.error
  //     ) {
  //       messageDispatch({
  //         type: 'SET_NOTIFICATION',
  //         payload: `An Error Occured while deleting the blog: ${exception.response.data.error}`
  //       })
  //     } else {
  //       messageDispatch({
  //         type: 'SET_NOTIFICATION',
  //         payload: `An Error Occured: ${exception.message}`
  //       })
  //     }
  //   }
  // }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      messageDispatch({
        type: 'SET_NOTIFICATION',
        payload: `logged in as ${user.name}`
      })
    } catch (exception) {
      messageDispatch({
        type: 'SET_NOTIFICATION',
        payload: `Error : ${exception.response.data.error}`
      })
    }
    //user Username Phillip1 use password Password
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    messageDispatch({
      type: 'SET_NOTIFICATION',
      payload: 'logged out'
    })
  }
  const loginForm = () => {
    return <LoginForm transferLoginToParent={handleLogin} />
  }

  const blogFormRef = useRef()
  const blogForm = () => {
    return (
      <Togglable buttonLable="new blog" ref={blogFormRef}>
        <BlogForm createNewBlog={createNewBlog} />
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
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog key={blog.id} blog={blog} username={user.username} />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
