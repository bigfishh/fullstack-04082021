const mongoose = require('mongoose')
const config = require('../utils/config')
const uniqueValidator = require('mongoose-unique-validator')

const url = config.MONGODB_URI
console.log('connecting to', url)

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    name: String,
    passwordHash: String,
    // the ids of the blogs are stored within the user document as an array of Mongo ids
    // The type of the field is ObjectId that references note-style documents. MongoDB doesn't inherently know that this is a field that references notes, the syntax is purely to and defined by Mongoose. 
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

mongoose.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id 
        delete returnedObject.__v 
        // the passwordHash should not be revealed 
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)