const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  content: String,
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }
})

//Sets a transformation function for the schema's toJSON method.
//Transforms the returned object to include an id field based on _id.
//Deletes _id and __v fields from the returned object to clean up unnecessary data.
commentSchema.set('toJSON', {
  //is a special Mongoose option that determines how Mongoose documents are converted to JSON format.
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Comment', commentSchema)
