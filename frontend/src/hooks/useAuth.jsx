import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('helpdesk_user') || 'null'))
  const [loading, setLoading] = useState(true)
  const save = (payload) => {
    const data = payload?.data || payload
    const token = data?.token
    const currentUser = data?.user
    if (!token || !currentUser) throw new Error('The server did not return an authenticated session.')
    localStorage.setItem('helpdesk_token', token)
    localStorage.setItem('helpdesk_user', JSON.stringify(currentUser))
    setUser(currentUser)
    return currentUser
  }
  const logout = () => { localStorage.removeItem('helpdesk_token'); localStorage.removeItem('helpdesk_user'); setUser(null) }
  useEffect(() => {
    if (!localStorage.getItem('helpdesk_token')) { setLoading(false); return }
    authService.me().then((response) => setUser(response.data?.user || response.data)).catch(logout).finally(() => setLoading(false))
  }, [])
  return <AuthContext.Provider value={{ user, loading, save, logout, isAdmin: user?.role === 'admin' }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
