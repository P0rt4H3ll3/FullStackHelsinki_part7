import { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { userLogin } from '../reducers/userAuthReducer'
import { notificationService } from '../reducers/notificationReducer'

const LoginForm = ({ transferLoginToParent }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const handleSubmit = (event) => {
    event.preventDefault()
    try {
      dispatch(userLogin(username, password))
      setPassword('')
      setUsername('')
    } catch (exception) {
      if (exception?.response?.data?.error) {
        dispatch(
          notificationService(
            `Error: while userLogin : ${exception.response.data.error} `
          )
        )
      } else {
        console.log(exception.message)
      }
    }
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
