// lib/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // your Spring Boot base URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add JWT token to headers if available
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
