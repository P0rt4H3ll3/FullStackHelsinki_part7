const { test, describe } = require('node:test')
const assert = require('node:assert')

// blogs to test on

const listWithOneBlog = [
  {
    title: 'my first blog post',
    author: 'bananenphil',
    url: 'https://websiteofwonders2.de',
    likes: 3,
    id: '668136670258789e83f00191'
  }
]

const listWith3Blog = [
  {
    title: 'my first blog post',
    author: 'bananenphil',
    url: 'https://websiteofwonders2.de',
    likes: 3,
    id: '668136670258789e83f00191'
  },
  {
    title: 'my second blog post',
    author: 'bananenphil',
    url: 'https://websiteofwonders2.de',
    likes: 56,
    id: '6681367f0258789e83f00193'
  },
  {
    title: 'my third blog post',
    author: 'bananenphil',
    url: 'https://websiteofwonders2.de',
    likes: 2,
    id: '6681368b0258789e83f00195'
  }
]

// test

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes returns number of total likes of all blogs', () => {
  test('When list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 3)
  })

  test('When list has only 3 blog, equals the sum likes of that', () => {
    const result = listHelper.totalLikes(listWith3Blog)
    assert.strictEqual(result, 61)
  })
})

describe(' Favorit blog retrunes the blog with the most likes ', () => {
  test('test list should return "my second blog post" as favorit', () => {
    const result = listHelper.favoriteBlog(listWith3Blog)
    assert.deepStrictEqual(result, listWith3Blog[1])
  })
})
