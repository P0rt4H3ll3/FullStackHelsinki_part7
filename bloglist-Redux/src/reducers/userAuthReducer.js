import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import loginService from '../services/login'

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null },
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    },
    removeUser(state, action) {
      state.user = null
    }
  }
})

export const { setUser, removeUser } = userSlice.actions

export const alreadyLoggedIn = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export const userLogin = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      console.log(`logged in as ${user.name}`)
    } catch (exception) {
      console.log(`Error : ${exception.response.data.error}`)
    }
  }
}

export const userLogout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(removeUser())
    console.log('logged out')
  }
}

export default userSlice.reducer
