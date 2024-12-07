import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.defaults.headers['Authorization'] = `${localStorage.getItem('authToken')}`

export default api
