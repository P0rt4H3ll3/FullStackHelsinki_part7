import { useMatch } from 'react-router-dom'
import userService from '../services/users'

import { useQuery } from '@tanstack/react-query'

const User = () => {
  const match = useMatch('/users/:id')

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
  console.log('this is users', users)
  const user = match ? users.find((user) => user.id === match.params.id) : null
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      {user.blogs.map((b) => {
        return <li key={b.id}>{b.title}</li>
      })}
    </div>
  )
}

export default User
