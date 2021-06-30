const User = require('../models/user')

const initialBlogs = [
    {
        title: "React patterns",
        author: "Waldo",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Waldo",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    }
]

const usersInDb = async () => {
    const users = await User.find({})

    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    usersInDb
}