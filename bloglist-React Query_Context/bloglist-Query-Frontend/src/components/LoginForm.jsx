import { useState } from 'react'

import loginService from '../services/login'
import blogService from '../services/blogs'

import { useNotificationDispatch } from '../NotificatonContext.jsx'
import { useUserDispatch } from '../UserContext.jsx'

const LoginForm = () => {
  // --------------------------------USESTATE----------------------------------
  const [username, setUsername] = useState([''])
  const [password, setPassword] = useState([''])
  // --------------------------------USESTATE----------------------------------

  // --------------------------------HOOKS AND DISPATCHES------------------------------
  const messageDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
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
  }

  // --------------------------------LOGIN HANDLER-------------------------------------

  // --------------------------------COMPONENT RETURN----------------------------------
  return (
    <>
      <h2>Log into BlogApp:</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            data-testid="username"
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            data-testid="password"
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

// --------------------------------COMPONENT RETURN----------------------------------

export default LoginForm
