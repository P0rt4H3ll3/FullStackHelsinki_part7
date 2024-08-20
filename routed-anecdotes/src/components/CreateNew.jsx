import PropTypes from 'prop-types'
import { useField } from '../hooks'

const CreateNew = ({ addNew }) => {
  const { onReset: resetContent, ...contentFields } = useField('text')
  const { onReset: resetAuthor, ...authorFields } = useField('text')
  const { onReset: resetInfo, ...infoFields } = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    const content = contentFields.value
    const author = authorFields.value
    const info = infoFields.value
    if (content && author && info) {
      addNew({
        content,
        author,
        info,
        votes: 0
      })
    }
  }
  const handleReset = () => {
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentFields} />
        </div>
        <div>
          author
          <input {...authorFields} />
        </div>
        <div>
          url for more info
          <input {...infoFields} />
        </div>
        <button type="submit">create</button>
        <button type="button " onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  )
}
CreateNew.propTypes = {
  addNew: PropTypes.func.isRequired
}

export default CreateNew
