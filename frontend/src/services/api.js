import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    let message = '网络错误，请稍后重试'

    if (error.response) {
      message = error.response.data?.detail || error.response.data?.message || message
    } else if (error.request) {
      message = '无法连接到服务器，请检查网络'
    } else {
      message = error.message || message
    }

    return Promise.reject(new Error(message))
  }
)

export default api
