import { Link } from 'react-router-dom'
import { SignInButton, SignUpButton, UserButton, useAuth as useClerkAuth } from '@clerk/react'
import { useAuth } from '../hooks/useAuth'
import { Headphones } from './Icons'

export function AuthNavbar() {
  const { user, logout } = useAuth()
  return <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-7"><Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900"><span className="rounded-lg bg-blue-600 p-2 text-white"><Headphones size={17}/></span>Helpdesk</Link><nav className="flex items-center gap-2">{user ? <button onClick={logout} className="btn btn-secondary">Log out</button> : import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? <ClerkControls/> : <><Link className="btn btn-secondary" to="/login">Sign in</Link><Link className="btn btn-primary" to="/signup">Create account</Link></>}</nav></header>
}

function ClerkControls() {
  const { isSignedIn } = useClerkAuth()
  return isSignedIn ? <UserButton afterSignOutUrl="/login"/> : <><SignInButton mode="modal"><button className="btn btn-secondary">Sign in with Clerk</button></SignInButton><SignUpButton mode="modal"><button className="btn btn-primary">Create account with Clerk</button></SignUpButton></>
}
