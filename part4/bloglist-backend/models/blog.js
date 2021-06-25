const mongoose = require('mongoose')
const config = require('../utils/config')

const url = config.MONGODB_URI
console.log('connecting to', url)

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }, 
    url: {
        type: String,
        required: true
    }, 
    likes: Number
}) 

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)

