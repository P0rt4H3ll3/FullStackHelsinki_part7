import Togglable from './Togglable'
import BlogForm from './BlogForm'
import Blog from './Blog'

import blogService from '../services/blogs'

import { useQuery } from '@tanstack/react-query'
import { useUserValue } from '../UserContext.jsx'

const Blogs = ({ blogFormRef }) => {
  // --------------------------------QUERY-------------------------------------------
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => await blogService.getAll(),
    refetchOnWindowFocus: false
  })
  const blogs = result.data

  // --------------------------------QUERY-------------------------------------------
  const user = useUserValue()
  const blogForm = () => {
    return (
      <Togglable buttonLable="new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
    )
  }

  return (
    <div>
      {blogForm()}
      {(blogs ? [...blogs] : [])
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} username={user.username} />
        ))}
    </div>
  )
}

export default Blogs
