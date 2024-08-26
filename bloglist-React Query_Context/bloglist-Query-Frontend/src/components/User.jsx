import { useMatch } from 'react-router-dom'
import userService from '../services/users'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
  Typography
} from '@mui/material'

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

  const user = match ? users.find((user) => user.id === match.params.id) : null
  return (
    <div>
      <Typography variant="h4" sx={{ my: 2 }}>
        {user.name}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Added Blogs
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user.blogs.map((b) => {
              return (
                <TableRow key={b.id}>
                  <TableCell>
                    <Typography variant="h6">{b.title}</Typography>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default User
