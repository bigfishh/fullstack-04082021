import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs => {
      console.log("BLOGS", blogs)
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

  const handleLogin = async (e) => {
    e.preventDefault()
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
      setUsername('')
      setPassword('')
    } catch(exception) {
      setMessage('wrong username or password')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType('')
      }, 5000)
    }
  }

  function renderBlogs() {
    return blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />)
  }

  async function handleBlogSubmit(e) {
    e.preventDefault()
      const blog = await blogService.createNew({title, author, url})
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

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} messageType={messageType}/>
      {user 
      ? <div>
          {user.username} logged in! 
          <button onClick={handleLogout} >Logout</button>
          <BlogForm handleBlogSubmit={handleBlogSubmit} title={title} setTitle={setTitle} author={author} setAuthor={setAuthor} url={url} setUrl={setUrl} />
          <hr/>
          {renderBlogs()}
        </div> 
      : <LoginForm handleLogin={handleLogin} username={username} password={password} setPassword={setPassword} setUsername={setUsername} />}
    </div>
  )
}

export default App