const bcrypt = require('bcrypt')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const { usersInDb, initialUsers } = require('./test_helper')

const User = require('../models/user')

describe('Delete all test users and load initial test user into DB', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(initialUsers)
    /* not needed because i have my initial users, why did i do this ?
    const passwordHash = await bcrypt.hash('P4$$w0rd', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
    */
  })
  describe('Test different user creations', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'Philley',
        name: 'Porta Helle',
        password: '12345'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map((u) => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()
      assert(result.body.error.includes('expected username: root to be unique'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username has less than 3 characters', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'P',
        name: 'request-user',
        password: 'Password3'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()
      assert(
        result.body.error.includes('Username P must have at least 3 characters')
      )
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('creation fails with proper statuscode and message if password has less than 3 characters', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'Philley',
        name: 'request-user',
        password: 'P4'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()
      assert(
        result.body.error.includes(
          'password missing or must be longer than 3 charakters'
        )
      )
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('creation fails with proper statuscode and message if password is missing', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'Philley',
        name: 'request-user'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()
      assert(
        result.body.error.includes(
          'password missing or must be longer than 3 charakters'
        )
      )
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
  })

  // close connection
  after(async () => {
    await mongoose.connection.close()
  })
})
