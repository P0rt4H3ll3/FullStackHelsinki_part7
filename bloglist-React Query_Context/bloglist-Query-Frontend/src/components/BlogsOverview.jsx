import Togglable from './Togglable.jsx'
import BlogForm from './BlogForm.jsx'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material'

import { Link } from 'react-router-dom'
import { useRef } from 'react'

import blogService from '../services/blogs.js'

import { useQuery } from '@tanstack/react-query'

const BlogsOverview = () => {
  const blogFormRef = useRef()
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

  const blogList = () => {
    return (
      <TableContainer component={Paper} sx={{ elevation: 12 }}>
        <Table>
          <TableBody>
            {(blogs ? [...blogs] : [])
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Typography variant="h6">
                      <Link to={`/blogs/${blog.id}`}>
                        {blog.title} {blog.author}
                      </Link>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{blog.user.name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <div>
      <Box sx={{ my: 4 }}>{blogForm()}</Box>
      {blogList()}
    </div>
  )
}

export default BlogsOverview
