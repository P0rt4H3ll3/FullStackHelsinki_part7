import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ transferLoginToParent }) => {
  const [username, setUsername] = useState([''])
  const [password, setPassword] = useState([''])

  const handleSubmit = (event) => {
    event.preventDefault()
    transferLoginToParent(username, password)
    setPassword('')
    setUsername('')
  }

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

LoginForm.propTypes = {
  transferLoginToParent: PropTypes.func.isRequired
}
export default LoginForm
