import blogService from '../services/blogs.js'
import { useNotificationDispatch } from '../NotificatonContext.jsx'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useUserValue } from '../UserContext.jsx'
import { useMatch, useNavigate } from 'react-router-dom'
import { useState } from 'react'

// --------------------------------COMPONENT START-------------------------------------------

const Blog = () => {
  const user = useUserValue()
  const queryClient = useQueryClient()
  const messageDispatch = useNotificationDispatch()
  const [comment, setComment] = useState('')

  const match = useMatch('/blogs/:id')
  const navigate = useNavigate()

  // --------------------------------COMPONENT START-------------------------------------------
  const {
    data: blogs,
    isLoading,
    error
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => await blogService.getAll(),
    refetchOnWindowFocus: false
  })

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
      ...blog,
      likes: blog.likes + 1
    })
  }

  // --------------------------------UPDATE BLOGS----------------------------------------------

  // --------------------------------DELETE BLOGS----------------------------------------------

  const deleteBlogMutation = useMutation({
    mutationFn: async (blog) => await blogService.deleteBlog(blog),
    onSuccess: (_, variables) => {
      navigate('/blogs')
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
  //---------------------------------ADD COMMENT-----------------------------------------------

  const addCommentMutation = useMutation({
    mutationFn: async ({ id, comment }) =>
      await blogService.addComment(id, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })

      messageDispatch({
        type: 'SET_NOTIFICATION',
        payload: `commented on blog: ${variables.title}`
      })
    },
    onError: (exception) => {
      messageDispatch({
        type: 'SET_NOTIFICATION',
        payload: `An Error Occured while updating the blog: ${exception.response.data.error}`
      })
    }
  })

  const addCommentHandler = (event) => {
    event.preventDefault()
    addCommentMutation.mutate({
      id: blog.id,
      comment: comment
    })
    setComment('')
  }
  // --------------------------------DELETE BLOGS----------------------------------------------

  if (isLoading) {
    return <div>Loading blog...</div>
  }

  if (error) {
    return <div>Error loading blog</div>
  }
  if (!blogs) null
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  // --------------------------------RETURN COMPONENTS-----------------------------------------
  return (
    <>
      <div className="BlogBigView">
        <h1>{blog.title}</h1>
        <a
          href={blog.url}
          onClick={(e) => {
            e.preventDefault()
            if (window.confirm('this URL goes nowhere')) {
              return null
            }
          }}
        >
          {blog.url}
        </a>
        <div>
          <span>{blog.likes} likes </span>
          <button onClick={updateLikeHandler} className="blogLikeButton">
            like
          </button>
        </div>
        <div>
          <span>added by {blog.user.name}</span>
        </div>
        {blog.user.username === user.username ? (
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
        <div>
          <h2>comments</h2>
          <form onSubmit={addCommentHandler}>
            <input
              type="text"
              name="comment"
              value={comment}
              className="commentInput"
              onChange={({ target }) => setComment(target.value)}
              data-testid="blog-comment"
              placeholder="comment this blog"
            />
            <button type="submit">add comment</button>
          </form>
          <ul>
            {blog.comments.map((c) => (
              <li key={c.id}>{c.content}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

// --------------------------------RETURN COMPONENTS-----------------------------------------

export default Blog
