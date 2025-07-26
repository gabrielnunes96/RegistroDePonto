import axios from 'axios'
import router from '@/routers'

const api = axios.create({
  baseURL: 'http://localhost:5000/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      // Remove quotes if token is stored with them
      const cleanToken = token.replace(/['"]+/g, '')
      // Ensure token format is correct
      config.headers.Authorization = cleanToken.startsWith('Bearer ')
        ? cleanToken
        : `Bearer ${cleanToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Clear auth data
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
        localStorage.removeItem('isAdmin')

        // Redirect to login
        if (router.currentRoute.value.path !== '/') {
          router.push('/')
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
