import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificatonContext.jsx'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// --------------------------------COMPONENT START-------------------------------------------

const Blog = ({ blog, username }) => {
  const [visible, setVisible] = useState(false)

  const queryClient = useQueryClient()
  const messageDispatch = useNotificationDispatch()

  // --------------------------------COMPONENT START-------------------------------------------

  // --------------------------------TOGGLE VISIBILITY-----------------------------------------
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // --------------------------------TOGGLE VISIBILITY-----------------------------------------

  // --------------------------------UPDATE BLOGS----------------------------------------------

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

  const updateLikeHandler = () => {
    updateBlogMutation.mutate({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id
    })
  }

  // --------------------------------UPDATE BLOGS----------------------------------------------

  // --------------------------------DELETE BLOGS----------------------------------------------

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

  const deleteHandler = () => {
    if (window.confirm(`Remove Blog: ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate(blog)
    }
  }
  // --------------------------------DELETE BLOGS----------------------------------------------

  // --------------------------------RETURN COMPONENTS-----------------------------------------
  return (
    <div style={blogStyle} className="blog">
      <div className="BlogSmallView" style={{ display: 'flex', gap: '8px' }}>
        <span>{blog.title}</span>
        <span>{blog.author}</span>
        <button onClick={toggleVisibility} className="blogToggleButton">
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible ? (
        <div className="BlogBigView">
          <div>{blog.url}</div>
          <div>
            <span>likes: {blog.likes}</span>
            <button onClick={updateLikeHandler} className="blogLikeButton">
              likes
            </button>
          </div>
          <div>
            <span>{blog.user.name}</span>
          </div>
          {blog.user.username === username ? (
            <div>
              <button
                onClick={deleteHandler}
                className="deleteButton"
                style={{
                  backgroundColor: 'dodgerblue',
                  color: 'black',
                  border: 'none',
                  margin: '2px',
                  padding: '2px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                remove
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
// --------------------------------RETURN COMPONENTS-----------------------------------------

// --------------------------------PROP VALIDATION --------------------------------------------

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired
}

// --------------------------------PROP VALIDATION --------------------------------------------
export default Blog
