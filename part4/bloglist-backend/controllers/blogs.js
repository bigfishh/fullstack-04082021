const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

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

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    const user = await User.findById(body.userId)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
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