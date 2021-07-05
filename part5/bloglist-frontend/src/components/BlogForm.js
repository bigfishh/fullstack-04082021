import React, { useState } from 'react'
import PropTypes from 'prop-types'

function BlogForm({ handleBlogSubmit }) {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    handleBlogSubmit({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit} >
        <div>
                    title:
          <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
                    author:
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
                    url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button>create</button>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  handleBlogSubmit: PropTypes.func.isRequired
}

export default BlogForm