const dummy = (blogs) => {
    return 1
}

function totalLikes(blogs) {
    let likesArray = blogs.map(({likes}) => likes)

    let result = likesArray.reduce((total, current) => total = total + current, 0)

    return result
}

function favoriteBlog(blogs) {
    let maxObj = blogs[0]

    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > maxObj.likes) {
            maxObj = blogs[i]
        }
    }

    return maxObj
}

function mostBlogs(blogs) {
    let blogCountHash = {}

    for (let i = 0; i < blogs.length; i++) {
        if (blogCountHash[blogs[i].author]) {
            blogCountHash[blogs[i].author] = blogCountHash[blogs[i].author] + 1
        } else {
            blogCountHash[blogs[i].author] = 1
        }
    }

    let highest = {
        author: "Someone",
        blogs: 0
    }

    for (let key in blogCountHash) {
        if (blogCountHash[key] > highest.blogs) {
            highest.author = key
            highest.blogs = blogCountHash[key]
        }
    }

    return highest
}

function mostLikes(blogs) {
    let likesCountHash = {}

    for (let i = 0; i < blogs.length; i++) {
        if (likesCountHash[blogs[i].author]) {
            likesCountHash[blogs[i].author] = likesCountHash[blogs[i].author] + blogs[i].likes
        } else {
            likesCountHash[blogs[i].author] = blogs[i].likes
        }
    }

    let highest = {
        author: "Someone",
        likes: 0
    }

    for (let key in likesCountHash) {
        if (likesCountHash[key] > highest.likes) {
            highest.author = key
            highest.likes = likesCountHash[key]
        }
    }

    return highest
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}