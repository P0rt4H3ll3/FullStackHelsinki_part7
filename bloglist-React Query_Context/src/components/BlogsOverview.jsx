import Togglable from './Togglable.jsx'
import BlogForm from './BlogForm.jsx'

import { Link } from 'react-router-dom'

import blogService from '../services/blogs.js'

import { useQuery } from '@tanstack/react-query'

const BlogsOverview = ({ blogFormRef }) => {
  // --------------------------------QUERY-------------------------------------------
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => await blogService.getAll(),
    refetchOnWindowFocus: false
  })
  const blogs = result.data

  // --------------------------------QUERY-------------------------------------------
  const blogForm = () => {
    return (
      <Togglable buttonLable="create new" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
    )
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const blogList = () => {
    return (
      <div>
        {(blogs ? [...blogs] : [])
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <div key={blog.id} style={blogStyle} className="blog">
              <div
                className="BlogSmallView"
                style={{ display: 'flex', gap: '8px' }}
              >
                <Link to={`/blogs/${blog.id}`}>
                  {blog.title} {blog.author}
                </Link>
              </div>
            </div>
          ))}
      </div>
    )
  }

  return (
    <div>
      {blogForm()}
      {blogList()}
    </div>
  )
}

export default BlogsOverview
