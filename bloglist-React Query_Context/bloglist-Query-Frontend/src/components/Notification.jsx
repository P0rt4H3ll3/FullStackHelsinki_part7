import PropTypes from 'prop-types'
import { useNotificationMessage } from '../NotificatonContext'

const Notification = () => {
  const message = useNotificationMessage()
  if (!message) return null
  return (
    <div className={message.includes('Error') ? 'error' : 'success'}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string
}
export default Notification
