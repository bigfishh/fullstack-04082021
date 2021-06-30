const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1 })
        
    response.json(blogs) 
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
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' }) 
    }
    
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: user.name,
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
    const id = request.params.id

    // get user object that has this token
    const user = request.user
    console.log(user)
    const blog = await Blog.findById(id)
    if (blog.user.toString() === user.id.toString()) {
        await Blog.findOneAndDelete({ _id: id})
        response.status(204).end()
    } else {
        response.status(401).json({
            error: 'Unauthorized to delete this blog'
        })
    }
})

module.exports = blogsRouter