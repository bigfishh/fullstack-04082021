const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blog => {
            response.json(blog) 
        })
})

blogsRouter.get('/:id', (request, response) => {
    const id = request.params.id
    Blog
        .find({ _id: id })
        .then(blog => {
            response.json(blog) 
        })
})

blogsRouter.post('/', (request, response, next) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(error => {
            next(error)
        })
})

blogsRouter.put('/:id', async (request, response, next) => {
    try {
        const body = request.body 
        const id = request.params.id 

        const foundPost = await Blog.findOneAndUpdate({ _id: id }, body, { new: true })
        response.status(200).json(foundPost)
    } catch(exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const id = request.params.id
        await Blog.findOneAndDelete({ _id: id})
        response.status(204).end()
    } catch(exception) {
        next(exception)
    }
})

module.exports = blogsRouter