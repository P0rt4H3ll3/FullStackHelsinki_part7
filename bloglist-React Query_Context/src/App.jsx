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

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => await blogService.getAll(),
    refetchOnWindowFocus: false
  })
  const blogs = result.data

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

  const updateBlogMutation = useMutation({
    mutationFn: async (blog) => await blogService.update(blog),
    onSuccess: (blogResponse) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueriesData(
        ['blogs'],
        blogs.map((b) => (b.id !== blogResponse.id ? b : blogResponse))
      )

      messageDispatch({
        type: 'SET_NOTIFICATION',
        payload: `blog ${blogResponse.title} by ${blogResponse.author} was updated`
      })
    },
    onError: (exception) => {
      messageDispatch({
        type: 'SET_NOTIFICATION',
        payload: `An Error Occured while updating the blog: ${exception.response.data.error}`
      })
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: async (blog) => await blogService.deleteBlog(blog),
    onSuccess: (_, variables) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueriesData(
        ['blogs'],
        blogs.filter((b) => b.id !== variables.id)
      )

      messageDispatch({
        type: 'SET_NOTIFICATION',
        payload: 'deleted Blog'
      })
    },
    onError: (exception) => {
      messageDispatch({
        type: 'SET_NOTIFICATION',
        payload: `An Error Occured while updating the blog: ${exception.response.data.error}`
      })
    }
  })

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

  const updateBlog = async (updatedBlogObject) => {
    updateBlogMutation.mutate(updatedBlogObject)
  }

  const deleteBlog = async (deleteBlogObject) => {
    deleteBlogMutation.mutate(deleteBlogObject)
  }

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
              <Blog
                key={blog.id}
                blog={blog}
                username={user.username}
                transferIdToParent={updateBlog}
                transferIdToDelete={deleteBlog}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
