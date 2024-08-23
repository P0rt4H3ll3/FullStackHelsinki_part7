import { useField } from '../hooks/index'
import { createBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { notificationService } from '../reducers/notificationReducer'

const BlogForm = ({ blogFormRef }) => {
  const dispatch = useDispatch()
  const { onReset: resetTitle, ...titleFields } = useField('text')
  const { onReset: resetAuthor, ...authorFields } = useField('text')
  const { onReset: resetUrl, ...urlFields } = useField('url')

  const handleCreate = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: titleFields.value,
      author: authorFields.value,
      url: urlFields.value
    }
    try {
      dispatch(createBlog(newBlog))
      dispatch(
        notificationService(
          `new Blog by the title:${newBlog.title} and author:${newBlog.author} was created`
        )
      )
      resetAuthor()
      resetTitle()
      resetUrl()
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      dispatch(notificationService(`Error: inside handleCreate ${error}`))
    }
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
                {...titleFields}
                className="titleInput"
                data-testid="blog-title"
              />
            </td>
          </tr>

          <tr>
            <td>author:</td>
            <td>
              <input
                {...authorFields}
                className="authorInput"
                data-testid="blog-author"
              />
            </td>
          </tr>

          <tr>
            <td>url:</td>
            <td>
              <input
                {...urlFields}
                className="urlInput"
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

// BlogForm.propTypes = {
//   createNewBlog: PropTypes.func.isRequired
// }

export default BlogForm
