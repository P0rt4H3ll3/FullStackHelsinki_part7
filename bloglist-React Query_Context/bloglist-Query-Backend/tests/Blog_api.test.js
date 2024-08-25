const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)
// run with command npm run test-all ./tests/
const { initialBlogs, blogsInDb, initialUsers } = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

let rootToken
let userToken

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await User.insertMany(initialUsers)

  const rootUser = await User.findOne({ username: 'root' })

  const insertBlogs = initialBlogs.map(
    (blog) => new Blog({ ...blog, user: rootUser._id })
  )

  const saveInitialBlogs = insertBlogs.map((blog) => blog.save())
  await Promise.all(saveInitialBlogs)

  const rootCredentials = {
    username: 'root',
    password: 'P4$$w0rd'
  }

  const userCredentials = {
    username: 'user',
    password: '12345'
  }

  const rootResponse = await api.post('/api/login').send(rootCredentials)
  rootToken = rootResponse.body.token

  const userResponse = await api.post('/api/login').send(userCredentials)
  userToken = userResponse.body.token
})

describe('Get Requests to DB', () => {
  test('HTTP GET request to the /api/blogs URL, verify JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('HTTP GET request to the /api/blogs URL, all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

describe('everything concerning IDs of blogs', () => {
  test('ID property of blog posts', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach((blog, index) => {
      assert(blog.id !== undefined, `ID field of ${index} Blog undefined`) //node test runner using assert, legacy using jest and .toBeDefined()
    })
  })
})

describe('Everything about adding Blogs with or without properties', () => {
  test('HTTP POST request, verify that the number increased', async () => {
    const newBlog = {
      title: 'my new blog post',
      author: 'avocadophil',
      url: 'https://websiteofwonders4.de',
      likes: 100
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${rootToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map((r) => r.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(titles.includes('my new blog post'))
  })

  test('add Blog with no likes propperty, likes should be 0', async () => {
    const newBlog = {
      title: 'my without likes blog post',
      author: 'lycheephil',
      url: 'https://websiteofwonders5.de'
    }
    const withoutLikesResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${rootToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //checking the  Response Directly = Unit Testing ?
    //confirms that the server logic adds the like property
    // but the DB is not checked
    assert.strictEqual(withoutLikesResponse.body.likes, 0)

    //Checking DB = Integration Testing ?
    //Ensures that the blog post is actually saved correctly in the database.
    //Involves an extra database query and more lines of code = more complex

    const blogsInDbAtEnd = await blogsInDb()
    const addedBlog = blogsInDbAtEnd.find(
      (blog) => blog.id === withoutLikesResponse.body.id
    )
    assert.strictEqual(blogsInDbAtEnd.length, initialBlogs.length + 1)
    assert.strictEqual(addedBlog.likes, 0)
  })

  test('add Blog with no title, return 400', async () => {
    const newBlog = {
      author: 'lycheephil',
      url: 'https://websiteofwonders6.de',
      likes: 100
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${rootToken}`)
      .send(newBlog)
      .expect(400)

    const dbAfterAddAttempt = await blogsInDb()

    assert(dbAfterAddAttempt.length, initialBlogs.length)
  })

  test('add Blog with no Url, return 400', async () => {
    const newBlog = {
      title: 'my without Url blog post',
      author: 'lycheephil',
      likes: 100
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${rootToken}`)
      .send(newBlog)
      .expect(400)

    const dbAfterAddAttempt = await blogsInDb()

    assert(dbAfterAddAttempt.length, initialBlogs.length)
  })

  test('add Blog with no token, return 401 Unauthorized', async () => {
    const newBlog = {
      title: 'my without token blog post',
      author: 'Melonephil',
      url: 'https://websiteofwonders7.de',
      likes: 111
    }
    await api.post('/api/blogs').send(newBlog).expect(401)

    const dbAfterAddAttempt = await blogsInDb()

    assert(dbAfterAddAttempt.length, initialBlogs.length)
  })
})

describe('deleting Blogs', () => {
  test('deleting a single blog with valid id', async () => {
    const dbBeforeDelete = await api.get('/api/blogs')
    const blogToDelete = dbBeforeDelete.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${rootToken}`)
      .expect(204)

    const dbAfterDelete = await api.get('/api/blogs') // how to decide when to use the helper function blogsInDb() and when to query the db

    assert.strictEqual(
      dbAfterDelete.body.length,
      dbBeforeDelete.body.length - 1
    )

    const titles = dbAfterDelete.body.map((blog) => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('deleting a single blog with invalid id', async () => {
    const dbBeforeDelete = await api.get('/api/blogs')
    const blogToDelete = dbBeforeDelete.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(401)

    const dbAfterDelete = await api.get('/api/blogs') // how to decide when to use the helper function blogsInDb() and when to query the db

    assert.strictEqual(dbAfterDelete.body.length, dbBeforeDelete.body.length)

    const titles = dbAfterDelete.body.map((blog) => blog.title)
    assert(titles.includes(blogToDelete.title))
  })
})

describe("update Blogs, test on 'likes'", () => {
  test('Updateing a single blog with valid id', async () => {
    const dbBeforeUpdate = await api.get('/api/blogs')
    const blogToUpdate = dbBeforeUpdate.body[0]

    const updatedBlog = {
      title: 'my updated blog post',
      author: 'liquorphil',
      url: 'https://websiteofwonders7.de',
      likes: 100
    } // could use spread operator to shorten the key values to only the updated part ...
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200)

    const BlogAfterUpdate = await api.get(`/api/blogs/${blogToUpdate.id}`)

    assert.strictEqual(BlogAfterUpdate.body.likes, 100)
  })
})
// close connection
after(async () => {
  await mongoose.connection.close()
})
