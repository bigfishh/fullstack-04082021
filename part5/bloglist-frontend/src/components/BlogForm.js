function BlogForm({ handleBlogSubmit, title, setTitle, author, setAuthor, url, setUrl }) {
    return(
        <>
            <h2>create new</h2>
            <form onSubmit={handleBlogSubmit} >
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

export default BlogForm