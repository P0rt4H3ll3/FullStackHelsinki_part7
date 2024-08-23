import { useState } from 'react'
import PropTypes from 'prop-types'
import { useNotificationDispatch } from '../NotificatonContext.jsx'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'

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
      <h2>create new</h2>
      <table>
        <tbody>
          <tr>
            <td>title:</td>
            <td>
              <input
                type="text"
                name="title"
                value={title}
                className="titleInput"
                onChange={({ target }) => setTitle(target.value)}
                data-testid="blog-title"
              />
            </td>
          </tr>

          <tr>
            <td>author:</td>
            <td>
              <input
                type="text"
                name="author"
                value={author}
                className="authorInput"
                onChange={({ target }) => setAuthor(target.value)}
                data-testid="blog-author"
              />
            </td>
          </tr>

          <tr>
            <td>url:</td>
            <td>
              <input
                type="text"
                name="url"
                value={url}
                className="urlInput"
                onChange={({ target }) => setUrl(target.value)}
                data-testid="blog-url"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button type="submit" className="createNewBlogButton">
        create
      </button>
    </form>
  )
}

// --------------------------------RETURN COMPONENT-----------------------------------------

// --------------------------------PROP VALIDATION-----------------------------------

BlogForm.propTypes = {
  blogFormRef: PropTypes.object.isRequired
}

// --------------------------------PROP VALIDATION-----------------------------------

export default BlogForm
