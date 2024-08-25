const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumOfAll = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return sumOfAll
}

const favoriteBlog = (blogs) => {
  const bestBlog = blogs.reduce((best, blog) => {
    return blog.likes > best.likes ? blog : best
  }, blogs[0] || null)
  return bestBlog
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
