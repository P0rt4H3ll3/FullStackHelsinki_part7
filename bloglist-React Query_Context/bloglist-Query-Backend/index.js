// main entry point file of a Node.js application
const app = require('./app') // This is where all the routes, middleware, and settings for the Express server are configured.
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
//serves as the entry point to start the Express server. It initializes the application with necessary configurations, including database connections, middleware setup, and route handling defined in ./app.
