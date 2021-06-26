const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../utils/blog_test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('has unique verifier', async () => {
        const response = await api.get('/api/blogs')
        const blogToTest = response.body[0]
    
        expect(blogToTest.id).toBeDefined()
    })

    test('updates likes property', async () => {
        const response = await api.get('/api/blogs')
        const updatedBlog = response.body[0]
        
        const blogToUpdate = await api
            .put(`/api/blogs/${updatedBlog.id}`)
            .send({ likes: 500 })
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
            const afterUpdate = await api.get(`/api/blogs/${blogToUpdate.body.id}`)
        
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
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
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
            .expect(400)
    
        const response = await api.get('/api/blogs')
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
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    
        const titles = response.body.map(({title}) => title)
        expect(titles).toContain('Goodnight Moon')
    
        const lastBlog = response.body[response.body.length - 1]
        expect(lastBlog.likes).toEqual(0)
    })
})

describe('deletion of a blog', () => {
    test('blog with valid id can be deleted', async () => {
        const response = await api.get('/api/blogs')
        const firstBlog = response.body[0]
    
        await api
            .delete(`/api/blogs/${firstBlog.id}`)
            .expect(204)
        
        const afterDelete = await api.get('/api/blogs')
        expect(afterDelete.body).toHaveLength(helper.initialBlogs.length - 1)

        const titles = afterDelete.body.map(r => r.title)

        expect(titles).not.toContain(firstBlog.title)
    })
})

afterAll(() => {
    mongoose.connection.close()
})