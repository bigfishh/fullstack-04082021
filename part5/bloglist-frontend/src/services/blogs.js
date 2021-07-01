import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const createNew = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
    .catch(error => {
      if (error) {
        return error.response
      }
    })
  return response.data
}

const setToken = newToken => {
  token = `bearer ${newToken}`
}

export default { getAll, createNew, setToken }