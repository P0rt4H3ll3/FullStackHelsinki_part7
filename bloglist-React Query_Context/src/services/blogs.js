import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const config = (token) => ({ headers: { Authorization: token } })

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlogObject) => {
  const response = await axios.post(baseUrl, newBlogObject, config(token))
  return response.data
}

const update = async (id, updatedBlogObject) => {
  const response = await axios.put(
    `${baseUrl}/${id}`,
    updatedBlogObject,
    config(token)
  )
  return response.data
}

const deleteBlog = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, config(token))
  return response.data
}

export default { getAll, create, update, deleteBlog, setToken }
