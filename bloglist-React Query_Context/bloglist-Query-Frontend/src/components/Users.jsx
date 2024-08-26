import userService from '../services/users'
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  TableHead
} from '@mui/material'
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

  return (
    <div>
      <Typography variant="h4" sx={{ my: 2 }}>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold' }}>
                  blogs created
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => {
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <Typography variant="h6">
                      <Link to={`/users/${u.id}`}>{u.name}</Link>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">{u.blogs.length}</Typography>
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

export default Users
