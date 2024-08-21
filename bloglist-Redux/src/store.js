import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import userAuthReducer from './reducers/userAuthReducer'

const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    blogs: blogReducer,
    userAuth: userAuthReducer
  }
})

export default store
