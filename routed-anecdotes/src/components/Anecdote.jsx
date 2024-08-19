import PropTypes from 'prop-types'

const Anecdote = ({ anecdote }) => {
  if (!anecdote) {
    return <div>Anecdote not found</div>
  }

  return (
    <div className="SingleAnecdoteView">
      <h2>{anecdote.content}</h2>
      <div>has {anecdote.votes} votes</div>
      <div>for more info see {anecdote.info}</div>
    </div>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.oneOfType([
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      votes: PropTypes.number.isRequired,
      info: PropTypes.string.isRequired
    }),
    PropTypes.oneOf([null]) // This allows `null` as a valid value
  ])
}
export default Anecdote
