import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import blogs from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    }
  }
})

export const { setBlogs, appendBlog, increaseLike } = blogSlice.actions

export const initializeBlogs = () => {
  console.log('inside initializeBlogs in reducer')
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

export const updateBlogs = (newBlog) => {
  return async (dispatch) => {
    const updateBlog = await blogService.update(newBlog.id, newBlog)
    const allBlogs = await blogService.getAll()
    const updatedSetBlogs = allBlogs.map((b) =>
      b.id !== newBlog.id ? b : updateBlog
    )
    dispatch(setBlogs(updatedSetBlogs))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    const toDeleteBlog = await blogService.deleteBlog(id)
    const allBlogs = await blogService.getAll()
    dispatch(setBlogs(allBlogs))
  }
}

export default blogSlice.reducer
