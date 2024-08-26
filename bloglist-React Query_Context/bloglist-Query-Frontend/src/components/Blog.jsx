import blogService from '../services/blogs.js'
import { useNotificationDispatch } from '../NotificatonContext.jsx'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useUserValue } from '../UserContext.jsx'
import { useMatch, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import {
  Divider,
  Paper,
  Box,
  Button,
  TextField,
  Typography,
  List,
  Link
} from '@mui/material'

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
      comment: comment,
      title: blog.title
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
        <Divider
          sx={{ mt: 2 }}
          orientation="horizontal"
          flexItem
          textAlign="left"
        >
          <Typography variant="h5">Title</Typography>
        </Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', my: 2 }}>
          <Paper sx={{ elevation: 12 }}>
            <Typography variant="h6" sx={{ my: 2, mx: 4 }}>
              {blog.title}
            </Typography>
          </Paper>
        </Box>
        <Divider orientation="horizontal" flexItem textAlign="left">
          <Typography variant="h5">URL</Typography>
        </Divider>
        <Divider orientation="horizontal" flexItem>
          <Typography variant="h5">Likes</Typography>
        </Divider>
        <Divider orientation="horizontal" flexItem textAlign="right">
          <Typography variant="h5">User</Typography>
        </Divider>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 4
          }}
        >
          <Paper
            sx={{
              elevation: 12,
              width: 300,
              height: 150, // Adjust height as needed
              display: 'flex',
              justifyContent: 'center', // Centers content horizontally
              alignItems: 'center' // Centers content vertically
            }}
          >
            <Link
              href={blog.url}
              sx={{ textAlign: 'center' }}
              onClick={(e) => {
                e.preventDefault()
                if (window.confirm('this URL goes nowhere')) {
                  return null
                }
              }}
            >
              <Typography>{blog.url}</Typography>
            </Link>
          </Paper>
          <Paper
            sx={{
              elevation: 12,
              width: 300,
              height: 150, // Adjust height as needed
              display: 'flex',
              justifyContent: 'center', // Centers content horizontally
              alignItems: 'center' // Centers content vertically
            }}
          >
            <Typography>{blog.likes} likes </Typography>
            <Button
              onClick={updateLikeHandler}
              className="blogLikeButton"
              size="small"
              color="primary"
              variant="contained"
              sx={{
                variant: 'contained',
                ':hover': { bgcolor: '#cbc86d' },
                m: 2
              }}
            >
              like
            </Button>
          </Paper>
          <Paper
            sx={{
              elevation: 12,
              width: 300,
              height: 150, // Adjust height as needed
              display: 'flex',
              justifyContent: 'center', // Centers content horizontally
              alignItems: 'center' // Centers content vertically
            }}
          >
            <div>
              <Typography>
                added by <br />
                {blog.user.name}
              </Typography>
            </div>
            {blog.user.username === user.username ? (
              <div>
                <Button
                  onClick={deleteHandler}
                  className="deleteButton"
                  size="small"
                  color="primary"
                  variant="contained"
                  sx={{
                    mx: 2,
                    ':hover': { bgcolor: '#cbc86d' }
                  }}
                >
                  remove
                </Button>
              </div>
            ) : null}
          </Paper>
        </Box>
        <div>
          <Divider
            orientation="horizontal"
            flexItem
            textAlign="left"
            sx={{ my: 4 }}
          >
            <Typography variant="h5">Comments</Typography>
          </Divider>
          <Paper>
            <form onSubmit={addCommentHandler}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  name="comment"
                  value={comment}
                  className="commentInput"
                  onChange={({ target }) => setComment(target.value)}
                  data-testid="blog-comment"
                  placeholder="comment this blog"
                />
                <Button
                  type="submit"
                  size="medium"
                  color="primary"
                  variant="contained"
                  sx={{
                    marginLeft: '8px',
                    // p: '4px 8px',
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
                    ':hover': { bgcolor: '#cbc86d' }
                  }}
                >
                  add comment
                </Button>
              </Box>
            </form>
          </Paper>

          {blog.comments.map((c) => (
            <Paper key={c.id} sx={{ my: 2 }}>
              <List sx={{ mx: 2 }}>{c.content}</List>
            </Paper>
          ))}
        </div>
      </div>
    </>
  )
}

// --------------------------------RETURN COMPONENTS-----------------------------------------

export default Blog
