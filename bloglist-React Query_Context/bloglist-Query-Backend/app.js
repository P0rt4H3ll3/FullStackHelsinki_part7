//This code snippet sets up an Express.js application that connects to a MongoDB database using Mongoose, and configures various middleware and routes
const config = require('./utils/config')
require('express-async-errors') //eliminate the try-catch blocks completely  it automatically hooks into the error-handling mechanism of Express. This allows it to catch errors from async functions and forward them to your Express error-handling middleware. // This will automatically forward errors to the error-handling middleware
const express = require('express')
const app = express() //Creates an instance of the Express application
const cors = require('cors') //Imports the CORS middleware for handling Cross-Origin Resource Sharing.
const blogsRouter = require('./controllers/blogs') //Imports the router module that defines routes related to things.
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose') //Imports the Mongoose library for MongoDB interactions

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json()) //Parses incoming requests with JSON payloads.
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
//app.use(middleware.userExtractor)

app.use('/api/blogs', middleware.userExtractor, blogsRouter) //Mounts the nameRouter middleware at the '/api/things' path, handling routes related to things. routes can be found in controllers/routes.js
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test') {
  console.log('process.env is Test')
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app //Exports the Express application instance (app) so it can be started and used in other parts of the application.
