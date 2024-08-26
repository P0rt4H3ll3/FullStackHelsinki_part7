//This file is an Express router module that defines several routes for interacting with a MongoDB collection using the Mongoose ORM.

// 'express-async-errors' eliminate the try-catch blocks completely  it automatically hooks into the error-handling mechanism of Express. This allows it to catch errors from async functions and forward them to your Express error-handling middleware. // This will automatically forward errors to the error-handling middleware

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comments')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(request.user.id)

  const blog = new Blog({
    ...body,
    user: user._id
  })
  if (!blog.url || !blog.title) {
    response.status(400).end()
  }
  if (!blog.likes) blog.likes = 0

  const addedBlog = await blog.save()
  user.blogs = user.blogs.concat(addedBlog._id) // user.blogs is the array of blogs the user has posted, the just posted blog id is added using concat or spread operator to generat new array, does not change existing array
  await user.save()

  const populatedBlog = await Blog.findById(addedBlog._id)
    .populate('user', {
      username: 1,
      name: 1
    })
    .populate('comments', { content: 1 })
  response.status(201).json(populatedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const indivitualBlog = await Blog.findById(request.params.id)
  response.json(indivitualBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!request.token) {
    response.status(401).json({ error: 'missing token, please login' })
  }
  const userid = request.user.id

  if (!(blog.user.toString() === userid.toString())) {
    return response
      .status(401)
      .json({ error: 'You do not have permission to delete this blog post' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const uBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const blogToUpdate = await Blog.findByIdAndUpdate(request.params.id, uBlog, {
    new: true
  })
    .populate('user', { username: 1, name: 1 }) //so it works with part5 update the likes and display the username
    .populate('comments', { content: 1 })
  response.json(blogToUpdate)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { id } = request.params
  const body = request.body
  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(404)
  }

  const comment = new Comment({
    ...body,
    blog: blog._id
  })
  const newComment = await comment.save()

  blog.comments = blog.comments.concat(newComment._id)
  await blog.save()

  const populatedComment = await Comment.findById(newComment._id).populate(
    'blog',
    {
      title: 1,
      id: 1
    }
  )

  response.status(201).json(populatedComment)
})

blogsRouter.delete('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    response.status(404).json({ error: 'no blog found' })
  }
  //delet all comments associated with the blog
  await Comment.deleteMany({ blog: blog._id })
  // Clear the comments array in the blog document
  blog.comments = []
  await blog.save()
  return response.status(200).json({ message: 'All Comments deleted ', blog })
})
module.exports = blogsRouter
