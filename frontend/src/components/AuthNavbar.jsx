import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Headphones } from './Icons'

export function AuthNavbar() {
  const { user, logout } = useAuth()
  return <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-7"><Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900"><span className="rounded-lg bg-blue-600 p-2 text-white"><Headphones size={17}/></span>Helpdesk</Link><nav className="flex items-center gap-2">{user ? <button onClick={logout} className="btn btn-secondary">Log out</button> : <><Link className="btn btn-secondary" to="/login">Sign in</Link><Link className="btn btn-primary" to="/signup">Create account</Link></>}</nav></header>
}
