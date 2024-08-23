import PropTypes from 'prop-types'
import { useNotificationMessage } from '../NotificatonContext'

const Notification = () => {
  const message = useNotificationMessage()
  if (!message) return null
  return message.includes('Error') ? (
    <div className="error">{message}</div>
  ) : (
    <div className="success">{message}</div>
  )
}

Notification.propTypes = {
  message: PropTypes.string
}
export default Notification
