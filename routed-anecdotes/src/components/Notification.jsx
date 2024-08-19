import PropTypes from 'prop-types'

const Notification = ({ notification }) => {
  return <div>{notification}</div>
}

Notification.propTypes = {
  notification: PropTypes.string
}
export default Notification
