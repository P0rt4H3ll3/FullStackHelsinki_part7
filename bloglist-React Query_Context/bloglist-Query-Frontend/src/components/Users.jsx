import userService from '../services/users'

import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

const Users = () => {
  const {
    data: users,
    isLoading,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => await userService.getAllUsers(),
    refetchOnWindowFocus: false
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading users: {error.message}</div>
  }

  if (!users || users.length === 0) {
    return <div>No users found</div>
  }
  console.log(users)
  return (
    <div>
      <h2>Users</h2>

      <table>
        <tr>
          <td>&nbsp;</td>
          <td style={{ fontWeight: 'bold' }}>blogs created</td>
        </tr>
        {users.map((u) => {
          return (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td>{u.blogs.length}</td>
            </tr>
          )
        })}
      </table>
    </div>
  )
}

export default Users
