import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'
import { renderWithProviders } from '../utils/utils-for-tests'

describe.only('<BlogForm />', () => {
  test.only(' check, that the form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const mockDispatch = vi.fn()
    useDispatch.mockReturnValue(mockDispatch)

    const user = userEvent.setup()
    const { container } = renderWithProviders(<BlogForm />)

    const title = container.querySelector('.titleInput')
    const author = container.querySelector('.authorInput')
    const url = container.querySelector('.urlInput')
    const createButton = container.querySelector('.createNewBlogButton')

    await user.type(title, 'testing the new title')
    await user.type(author, 'testing the new Author')
    await user.type(url, 'http://testing-the-new-url.de')

    await user.click(createButton)
    console.log('this is createBlog.mock.calls ', createBlog.mock.calls)
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toStrictEqual({
      title: 'testing the new title',
      author: 'testing the new Author',
      url: 'http://testing-the-new-url.de'
    })
  })
})
