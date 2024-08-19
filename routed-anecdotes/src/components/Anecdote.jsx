import PropTypes from 'prop-types'

const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>has {anecdote.votes} votes</div>
      <div>for more info see {anecdote.info}</div>
    </div>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.shape({
    content: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired,
    info: PropTypes.string.isRequired
  }).isRequired
}
export default Anecdote
