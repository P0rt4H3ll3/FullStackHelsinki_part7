import Blog from './Blog'
import { useDispatch, useSelector } from 'react-redux'
import { updateBlogs, deleteBlog } from '../reducers/blogReducer'
import { notificationService } from '../reducers/notificationReducer'

const BlogList = ({ user }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(({ blogs }) => {
    return blogs
  })

  const handleUpdate = (blog) => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    try {
      dispatch(updateBlogs(newBlog))
      dispatch(notificationService(`You Liked Blog : ${blog.title}`))
    } catch (exception) {
      if (exception?.response?.data?.error) {
        dispatch(
          notificationService(
            `An Error Occured while updating the blog: ${exception.response.data.error}`
          )
        )
      } else {
        dispatch(notificationService(`An Error Occured: ${exception.message}`))
      }
    }
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Remove Blog: ${blog.title} by ${blog.author}`)) {
      try {
        dispatch(deleteBlog(blog.id))
      } catch (exception) {
        if (exception?.response?.data?.error) {
          dispatch(
            notificationService(
              `An Error Occured while deleting the blog: ${exception.response.data.error}`
            )
          )
        } else {
          dispatch(
            notificationService(`An Error Occured: ${exception.message}`)
          )
        }
      }
    }
  }

  return [...blogs]
    .sort((a, b) => b.likes - a.likes)
    .map((blog) => (
      <Blog
        key={blog.id}
        blog={blog}
        likeHandler={() => handleUpdate(blog)}
        username={user.username}
        deleteHandler={() => handleDelete(blog)}
      />
    ))
}

export default BlogList
