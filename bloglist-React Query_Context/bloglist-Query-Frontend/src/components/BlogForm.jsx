import { useState } from 'react'
import { useNotificationDispatch } from '../NotificatonContext.jsx'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Box, Paper, TextField, Typography } from '@mui/material'

const BlogForm = ({ blogFormRef }) => {
  // --------------------------------STATE------------------------------------------
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // --------------------------------STATE------------------------------------------
  // --------------------------------HOOKS------------------------------------------

  const queryClient = useQueryClient()
  const messageDispatch = useNotificationDispatch()

  // --------------------------------HOOKS------------------------------------------

  // --------------------------------CREATE NEW---------------------------------------

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

  const handleCreate = (event) => {
    event.preventDefault()
    newBlogMutation.mutate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    blogFormRef.current.toggleVisibility() // creating a new blog, this toggles visibility
  }

  // --------------------------------CREATE NEW---------------------------------------

  // --------------------------------RETURN COMPONENT-----------------------------------------
  return (
    <form onSubmit={handleCreate}>
      <Box>
        <Typography variant="h4" sx={{ my: 2 }}>
          Create new
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          mx: 4
        }}
      >
        <Paper>
          <div>
            <TextField
              fullWidth
              label="title"
              type="text"
              name="title"
              value={title}
              className="titleInput"
              onChange={({ target }) => setTitle(target.value)}
              data-testid="blog-title"
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="author"
              type="text"
              name="author"
              value={author}
              className="authorInput"
              onChange={({ target }) => setAuthor(target.value)}
              data-testid="blog-author"
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="url"
              type="url"
              name="url"
              value={url}
              className="urlInput"
              onChange={({ target }) => setUrl(target.value)}
              data-testid="blog-url"
            />
          </div>
        </Paper>
      </Box>
      <Box>
        <Button
          color="primary"
          variant="contained"
          sx={{
            my: 2,
            ':hover': { bgcolor: '#cbc86d' }
          }}
          type="submit"
          className="createNewBlogButton"
        >
          create
        </Button>
      </Box>
    </form>
  )
}

// --------------------------------RETURN COMPONENT-----------------------------------------

// --------------------------------PROP VALIDATION-----------------------------------

// --------------------------------PROP VALIDATION-----------------------------------

export default BlogForm
