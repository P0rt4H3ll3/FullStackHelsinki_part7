import { useState } from 'react'
import { TextField, Button, Box, Typography, Paper } from '@mui/material'

import loginService from '../services/login'
import blogService from '../services/blogs'

import { useNotificationDispatch } from '../NotificatonContext.jsx'
import { useUserDispatch } from '../UserContext.jsx'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  // --------------------------------USESTATE----------------------------------
  const [username, setUsername] = useState([''])
  const [password, setPassword] = useState([''])
  // --------------------------------USESTATE----------------------------------

  // --------------------------------HOOKS AND DISPATCHES------------------------------
  const messageDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const navigate = useNavigate()
  // --------------------------------HOOKS AND DISPATCHES------------------------------

  // --------------------------------LOGIN HANDLER-------------------------------------

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'USER_LOGIN', payload: user })
      messageDispatch({
        type: 'SET_NOTIFICATION',
        payload: `logged in as ${user.name}`
      })
    } catch (exception) {
      messageDispatch({
        type: 'SET_NOTIFICATION',
        payload: `Error : ${exception.response.data.error}`
      })
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin(username, password)
    setPassword('')
    setUsername('')
    navigate('/')
  }

  // --------------------------------LOGIN HANDLER-------------------------------------

  // --------------------------------COMPONENT RETURN----------------------------------
  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4">Log into BlogApp:</Typography>
      </Paper>

      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            my: 4
          }}
        >
          <div>
            <TextField
              fullWidth
              label="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              data-testid="username"
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              data-testid="password"
            />
          </div>
        </Box>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mx: 4, mb: 4 }}
        >
          login
        </Button>
      </form>
    </>
  )
}

// --------------------------------COMPONENT RETURN----------------------------------

export default LoginForm
