import axios from "axios"
import toast from "react-hot-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jkvis_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const message = error.response?.data?.message || "An error occurred"

    // Don't show toast for certain endpoints
    const silentEndpoints = ["/auth/me"]
    const isSilentEndpoint = silentEndpoints.some((endpoint) => error.config?.url?.includes(endpoint))

    if (!isSilentEndpoint) {
      toast.error(message)
    }

    // Redirect to login if unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("jkvis_token")
      localStorage.removeItem("jkvis_user")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  },
)

export default api
