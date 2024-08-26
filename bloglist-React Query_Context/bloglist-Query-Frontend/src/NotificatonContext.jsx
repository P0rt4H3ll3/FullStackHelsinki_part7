import { createContext, useReducer, useEffect, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'REMOVE_NOTIFICATION':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [message, messageDispatch] = useReducer(notificationReducer, null)

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        messageDispatch({
          type: 'REMOVE_NOTIFICATION'
        })
      }, 5000)
    }
  }, [message])

  return (
    <NotificationContext.Provider value={[message, messageDispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationMessage = () => {
  const messageAndDispatch = useContext(NotificationContext)
  return messageAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const messageAndDispatch = useContext(NotificationContext)
  return messageAndDispatch[1]
}

export default NotificationContext
