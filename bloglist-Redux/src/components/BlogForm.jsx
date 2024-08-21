import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = (event) => {
    event.preventDefault()
    createNewBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

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

BlogForm.propTypes = {
  createNewBlog: PropTypes.func.isRequired
}

export default BlogForm
