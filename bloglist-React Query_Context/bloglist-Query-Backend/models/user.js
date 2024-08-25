const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // The unique Option is Not a Validator cannot use the custome error message with array syntax, have to use the custome middleware to catch the 'MongoServerError: E11000 duplicate key error collection' error
    minLength: [3, 'Username {VALUE} must have at least 3 characters'] // Custom Error Messages with Array synthax only for individual validators in your schema., Mongoose also supports rudimentary templating for error messages. Mongoose replaces {VALUE} with the value being validated.
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
