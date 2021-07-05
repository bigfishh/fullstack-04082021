import React, { useState } from 'react'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const Blog = ({ blog, updateLikes, deleteBlog }) => {

  const [showMore, setShowMore] = useState(false)

  function handleLike() {
    updateLikes(blog.id, blog.likes)
  }

  function handleDelete() {
    if (window.confirm(`remove ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      {showMore 
      ? <>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={handleLike}>like</button></p> 
        <p>{blog.user.username}</p>
        <button onClick={handleDelete}>delete</button>
      </>
      : null}
      <button onClick={() => setShowMore(!showMore)}>{showMore ? 'hide' : 'view'}</button>
    </div>  
  )
}

export default Blog