import axios from 'axios'

const baseURL = '/api/users'

const getAllUsers = async () => {
  const response = await axios.get(baseURL)
  console.log('getallUsers data', response.data)
  return response.data
}

export default { getAllUsers }
