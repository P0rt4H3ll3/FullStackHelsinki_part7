import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, transferIdToParent, username, transferIdToDelete }) => {
  const [visible, setVisible] = useState(false)
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

  const updateLikeHandler = () => {
    transferIdToParent({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id
    })
  }

  const deleteHandler = () => {
    if (window.confirm(`Remove Blog: ${blog.title} by ${blog.author}`)) {
      transferIdToDelete(blog)
    }
  }

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

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  transferIdToParent: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  transferIdToDelete: PropTypes.func.isRequired
}
export default Blog
