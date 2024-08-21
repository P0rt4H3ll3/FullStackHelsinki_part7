import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(({ notifications }) => {
    if (notifications === '') {
      return null
    }
    return notifications
  })

  return notification && <div>{notification}</div>
}
Notification.propTypes = {
  notification: PropTypes.oneOfType([
    PropTypes.oneOf([undefined, PropTypes.string])
  ])
}
export default Notification
