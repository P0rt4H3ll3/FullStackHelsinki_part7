import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const username = 'Vitest_the_mighty'
  const updateBlog = vi.fn()
  const deleteBlog = vi.fn()
  const blog = {
    title: 'Test blog title',
    author: 'Test blog author',
    url: 'https://testwebsite.de',
    likes: 3,
    user: {
      username: 'Vitest_the_mighty',
      name: 'Vitest',
      id: '66964c313c399a7a0a37b7d6'
    },
    id: '66966a13886556a2b39e6f5c'
  }

  beforeEach(() => {
    container = render(
      <Blog
        key={blog.id}
        blog={blog}
        transferIdToParent={updateBlog}
        username={username}
        transferIdToDelete={deleteBlog}
      />
    ).container
  })

  test('component displays blog title and author but no URL or Likes', async () => {
    const title = screen.getByText(blog.title)
    const author = screen.getByText(blog.author)
    const url = screen.queryByText(blog.url)
    const likes = screen.queryByText(blog.likes)

    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('component displays blog title, author, URL and Likes when button clicked', async () => {
    const user = userEvent.setup()
    const viewButton = container.querySelector('.blogToggleButton')
    await user.click(viewButton)

    const title = screen.getByText(blog.title)
    const author = screen.getByText(blog.author)
    const url = screen.queryByText(blog.url)
    const likes = screen.queryByText(blog.likes)

    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('clicking the button calls event handler once', async () => {
    const user = userEvent.setup()
    const viewButton = container.querySelector('.blogToggleButton')
    await user.click(viewButton)

    const likeButton = container.querySelector('.blogLikeButton')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
