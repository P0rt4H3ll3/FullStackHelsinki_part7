import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const AnecdoteList = ({ anecdotes }) => {
  if (!anecdotes || anecdotes.length === 0) {
    return <div>No anecdotes available.</div>
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map((anecdote) => (
          <li key={anecdote.id}>
            <Link to={`/${anecdote.id}`}>{anecdote.content}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

AnecdoteList.propTypes = {
  anecdotes: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      info: PropTypes.string.isRequired,
      votes: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired
    }).isRequired
  ).isRequired
}
export default AnecdoteList
