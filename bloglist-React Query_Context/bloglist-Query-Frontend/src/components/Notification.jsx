import PropTypes from 'prop-types'
import { useNotificationMessage } from '../NotificatonContext'
import { Alert } from '@mui/material'

const Notification = () => {
  const message = useNotificationMessage()
  if (!message) return null
  return (
    <Alert severity={message.includes('Error') ? 'error' : 'success'}>
      {message}
    </Alert>
  )
}

Notification.propTypes = {
  message: PropTypes.string
}
export default Notification
