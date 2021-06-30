const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/blog_test_helper')
const jwt = require('jsonwebtoken')
let token

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const initialUser = {
        name: "Waldo",
        username:"whereiswaldo",
        password: "abc123"
    }

    const passwordHash = await bcrypt.hash(initialUser.password, 10)

    const user = new User({
        username: initialUser.username,
        name: initialUser.name,
        passwordHash
    })

    const savedUser = await user.save()

    const userForToken = {
        username: savedUser.username,
        id: savedUser._id 
    }

    token = jwt.sign(userForToken, process.env.SECRET)

    const newBlogs = helper.initialBlogs.map(blog => new Blog({...blog, "user": savedUser._id}))
    const promiseArray = newBlogs.map(blog => blog.save())
    await Promise.all(promiseArray)

    const allBlogs = await Blog.find({ user: savedUser._id })
    allBlogs.forEach(blog => savedUser.blogs.push(blog._id))
    await savedUser.save()
})

describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
    })

    test('all blogs are returned', async () => {
        const response = await api
                .get('/api/blogs')
                .set('Authorization', `bearer ${token}`)
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('has unique verifier', async () => {
        const response = await api
                .get('/api/blogs')
                .set('Authorization', `bearer ${token}`)
        const blogToTest = response.body[0]
    
        expect(blogToTest.id).toBeDefined()
    })

    test('updates likes property', async () => {
        const response = await api
                .get('/api/blogs')
                .set('Authorization', `bearer ${token}`)
        const updatedBlog = response.body[0]
        
        const blogToUpdate = await api
            .put(`/api/blogs/${updatedBlog.id}`)
            .send({ likes: 500 })
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
            const afterUpdate = await api.
                    get(`/api/blogs/${blogToUpdate.body.id}`)
                    .set('Authorization', `bearer ${token}`)
        
        expect(blogToUpdate.body.likes).toEqual(afterUpdate.body[0].likes)
    })
})

describe('addition of a new blog', () => {
    test('succeed with valid data', async () => {
        const newBlog = {
            title: "Go To Wonderland",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 3
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs').set('Authorization', `bearer ${token}`)
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
        
        const titles = response.body.map(({title}) => title)
        expect(titles).toContain('Go To Wonderland')
    })

    test('fails with status code 400 if data is invalid', async () => {
        const newBlog = {
            author: "Edsger W. Dijkstra",
            likes: 3
        }
    
        await api 
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(400)
    
        const response = await api.get('/api/blogs').set('Authorization', `bearer ${token}`)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('401 status if no token provided', async () => {
        const newBlog = {
            author: "Edsger W. Dijkstra",
            likes: 3
        }
    
        await api 
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    
        const response = await api.get('/api/blogs').set('Authorization', `bearer ${token}`)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('if no likes property, defaults to 0', async() => {
        const newBlog = {
            title: "Goodnight Moon",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html"
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs').set('Authorization', `bearer ${token}`)
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    
        const titles = response.body.map(({title}) => title)
        expect(titles).toContain('Goodnight Moon')
    
        const lastBlog = response.body[response.body.length - 1]
        expect(lastBlog.likes).toEqual(0)
    })
})

describe('deletion of a blog', () => {
    test('blog with valid id can be deleted', async () => {
        const response = await api.get('/api/blogs').set('Authorization', `bearer ${token}`)
        const firstBlog = response.body[0]
    
        await api
            .delete(`/api/blogs/${firstBlog.id}`).set('Authorization', `bearer ${token}`)
            .expect(204)
        
        const afterDelete = await api.get('/api/blogs').set('Authorization', `bearer ${token}`)
        expect(afterDelete.body).toHaveLength(helper.initialBlogs.length - 1)

        const titles = afterDelete.body.map(r => r.title)

        expect(titles).not.toContain(firstBlog.title)
    })
})

describe('user api: when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'annieezheng',
            name: 'Annie Zheng',
            password: 'helloHelloThere123'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
})

afterAll(() => {
    mongoose.connection.close()
})