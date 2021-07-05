import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs => {
      console.log('BLOGS', blogs)
      setBlogs( blogs )
    })
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      console.log(`logging in ${username} ${password}`)
      let loggedInUser = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(loggedInUser)
      )
      setUser(loggedInUser)
      blogService.setToken(loggedInUser.token)
    } catch(exception) {
      setMessage('wrong username or password')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType('')
      }, 5000)
    }
  }

  async function updateLikes(blogId, blogLikes) {
    const updatedBlog = await blogService.updateBlog(blogId, blogLikes)
    console.log('updatedBlog', updatedBlog)
    if (updatedBlog.likes) {
      const updateBlogList = blogs.map((blog) => {
        if (blog.id === blogId) {
          return updatedBlog
        }
        return blog
      })

      setBlogs(updateBlogList)
    }
  }

  async function deleteBlog(blogId) {
    const deleteResponse = await blogService.removeBlog(blogId)
    if (!deleteResponse) {
      const updatedBlogs = blogs.filter(blog => blog.id !== blogId)
      setBlogs(updatedBlogs)
    }
  }

  function renderBlogs() {
    const sortedByLikes = blogs.sort((a,b) => b.likes - a.likes)

    return sortedByLikes.map(blog =>
      <Blog key={blog.id} blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog}/>)
  }

  async function handleBlogSubmit(blogObj) {
    blogFormRef.current.toggleVisibility()
    const blog = await blogService.createNew(blogObj)
    if (blog.error === 'token expired') {
      setMessage(`${blog.error}: please log in again`)
      setMessageType('error')
      setUser(null)
      window.localStorage.clear()
    } else {
      setMessage(`a new blog ${blog.title} by ${blog.author} added`)
      setMessageType('success')
      setBlogs([...blogs, blog])
    }
    setTimeout(() => {
      setMessage(null)
      setMessageType('')
    }, 5000)
  }

  function handleLogout() {
    window.localStorage.clear()
    setUser(null)
  }

  const blogFormRef = useRef()

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} messageType={messageType}/>
      {user
        ? <div>
          {user.username} logged in!
          <button onClick={handleLogout} >Logout</button>
          <Togglable toggleType='create new blog' ref={blogFormRef}>
            <BlogForm handleBlogSubmit={handleBlogSubmit} />
          </Togglable>
          <hr/>
          {renderBlogs()}
        </div>
        : <Togglable toggleType='login'>
          <LoginForm handleLogin={handleLogin} />
        </Togglable>}
    </div>
  )
}

export default App