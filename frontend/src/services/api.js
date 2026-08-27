import axios from 'axios'

// During local development, always use Vite's same-origin proxy. This avoids
// browser CORS preflight failures caused by backend CLIENT_URL differences.
const configuredApiUrl = import.meta.env.VITE_API_URL || '/api'
const apiBaseUrl = import.meta.env.DEV && /^https?:\/\/localhost:\d+\/api\/?$/i.test(configuredApiUrl)
  ? '/api'
  : configuredApiUrl
export const api = axios.create({ baseURL: apiBaseUrl })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('helpdesk_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export const authService = { login: (data) => api.post('/auth/login', data), signup: (data) => api.post('/auth/signup', data), me: () => api.get('/auth/me') }
export const ticketService = { list: (params) => api.get('/tickets', { params }), get: (id) => api.get(`/tickets/${id}`), create: (data) => api.post('/tickets', data), updateStatus: (id, status) => api.patch(`/tickets/${id}/status`, { status }) }
export const analyticsService = { get: () => api.get('/analytics') }
