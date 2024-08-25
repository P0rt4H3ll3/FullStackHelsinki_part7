//This file defines a Mongoose schema and exports a model for a "Thing" entity, typically used in a MongoDB database.
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [String]
})

//Sets a transformation function for the schema's toJSON method.
//Transforms the returned object to include an id field based on _id.
//Deletes _id and __v fields from the returned object to clean up unnecessary data.
blogSchema.set('toJSON', {
  //is a special Mongoose option that determines how Mongoose documents are converted to JSON format.
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
