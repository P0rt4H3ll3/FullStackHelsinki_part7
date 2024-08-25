const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'my inital Blog post #1',
    author: 'bananenphil',
    url: 'https://websiteofwonders1.de',
    likes: 3
  },
  {
    title: 'my inital Blog post #2',
    author: 'apfelphil',
    url: 'https://websiteofwonders2.de',
    likes: 56
  },
  {
    title: 'my inital Blog post #3',
    author: 'kiwiphil',
    url: 'https://websiteofwonders3.de',
    likes: 2
  }
]
const initialUsers = [
  {
    username: 'root',
    name: 'root superuser',
    passwordHash:
      '$2b$10$w5andjmx5/NWIARldNodme0wZgjmYoVKEHbfr5jtLxhm1vEPezqC6',
    blogs: [],
    _id: '6697c8eae37835bac71ef1f8',
    __v: 0,
    id: '6697c8eae37835bac71ef1f8'
  },
  {
    username: 'user',
    name: 'user manila',
    passwordHash:
      '$2b$10$sDr4LAYI8CjfHNbS5zaBbOYEGN5dDovJWv9kuFlhFJfsZgYdECf1K',
    blogs: [],
    _id: '66ab47dc5ce6a6ce1c835d7f',
    __v: 0,
    id: '66ab47dc5ce6a6ce1c835d7f'
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  nonExistingId,
  initialUsers
}
