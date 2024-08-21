import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test(' check, that the form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const createNewBlog = vi.fn()
    const user = userEvent.setup()
    const { container } = render(<BlogForm createNewBlog={createNewBlog} />)

    const title = container.querySelector('.titleInput')
    const author = container.querySelector('.authorInput')
    const url = container.querySelector('.urlInput')
    const createButton = container.querySelector('.createNewBlogButton')

    await user.type(title, 'testing the new title')
    await user.type(author, 'testing the new Author')
    await user.type(url, 'http://testing-the-new-url.de')

    await user.click(createButton)

    expect(createNewBlog.mock.calls).toHaveLength(1)
    expect(createNewBlog.mock.calls[0][0]).toStrictEqual({
      title: 'testing the new title',
      author: 'testing the new Author',
      url: 'http://testing-the-new-url.de'
    })
  })
})
