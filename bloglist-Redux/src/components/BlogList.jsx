import Blog from './Blog'
import { useDispatch, useSelector } from 'react-redux'
import { updateBlogs, deleteBlog } from '../reducers/blogReducer'
import { notificationService } from '../reducers/notificationReducer'

const BlogList = ({ user }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(({ blogs }) => {
    return blogs
  })

  // const createNewBlog = async (newBlogObject) => {
  //   blogFormRef.current.toggleVisibility() // creating a new blog, this toggles visibilit
  //   setMessage(`new blog ${newBlog.title} by ${newBlog.author} added`)
  //   setMessage(
  //       `An Error Occured while creating a new blog:${exception.response.data.error}`
  //     )
  //   }
  // }

  // const updateBlog = async (updatedBlogObject) => {
  //     setMessage(
  //       `blog ${updateBlogRes.title} by ${updateBlogRes.author} was updated`
  //     )
  //   } catch (exception) {
  //     if (
  //       exception.response &&
  //       exception.response.data &&
  //       exception.response.data.error
  //     ) {
  //       setMessage(
  //         `An Error Occured while updating the blog: ${exception.response.data.error}`
  //       )
  //     } else {
  //       setMessage(`An Error Occured: ${exception.message}`)
  //     }
  //   }

  // const deleteBlog = async (id) => {
  //   try {
  //     await blogService.deleteBlog(id)
  //     setBlogs(blogs.filter((blog) => blog.id !== id))
  //     setMessage('deleted blog')
  //   } catch (exception) {
  //     if (
  //       exception.response &&
  //       exception.response.data &&
  //       exception.response.data.error
  //     ) {
  //       setMessage(
  //         `An Error Occured while deleting the blog: ${exception.response.data.error}`
  //       )
  //     } else {
  //       setMessage(`An Error Occured: ${exception.message}`)
  //     }
  //   }
  // }
  const updateBlog = (blog) => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    try {
      dispatch(updateBlogs(newBlog))
      dispatch(notificationService(`You Liked Blog : ${blog.title}`))
    } catch (error) {
      console.log('this error occured while Updating a blog', error)
    }
  }

  const deleteOwnBlog = (blog) => {
    if (window.confirm(`Remove Blog: ${blog.title} by ${blog.author}`)) {
      console.log('this blog should be deleted >', blog)
      dispatch(deleteBlog(blog.id))
    }
  }

  return [...blogs]
    .sort((a, b) => b.likes - a.likes)
    .map((blog) => (
      <Blog
        key={blog.id}
        S
        blog={blog}
        likeHandler={() => updateBlog(blog)}
        username={user.username}
        deleteHandler={() => deleteOwnBlog(blog)}
      />
    ))
}

export default BlogList
