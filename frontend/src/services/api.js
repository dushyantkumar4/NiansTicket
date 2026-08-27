import axios from 'axios'

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api' })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('helpdesk_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export const authService = { login: (data) => api.post('/auth/login', data), signup: (data) => api.post('/auth/signup', data), me: () => api.get('/auth/me') }
export const ticketService = { list: (params) => api.get('/tickets', { params }), get: (id) => api.get(`/tickets/${id}`), create: (data) => api.post('/tickets', data), updateStatus: (id, status) => api.patch(`/tickets/${id}/status`, { status }) }
export const analyticsService = { get: () => api.get('/analytics') }
