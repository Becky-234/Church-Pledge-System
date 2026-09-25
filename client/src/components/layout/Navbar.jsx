import { useState, useRef, useEffect } from 'react'
import { Menu, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ConfirmDialog from '../common/ConfirmDialog'

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } finally {
      setLoggingOut(false)
      setLogoutConfirmOpen(false)
    }
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-white/80 hover:text-primary-600 text-secondary-600 transition lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 lg:flex-none" />

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/80 transition"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm shadow-primary-500/30">
            {initials || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-secondary-800">{user?.name}</p>
            <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-secondary-400 hidden sm:block transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-white/60 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-4 py-2 border-b border-white/60">
              <p className="text-sm font-medium text-secondary-800">{user?.name}</p>
              <p className="text-xs text-secondary-500">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                setDropdownOpen(false)
                setLogoutConfirmOpen(true)
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50/80 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Log out?"
        message="You'll need to sign in again to access your account."
        confirmText="Log out"
        cancelText="Stay signed in"
        loading={loggingOut}
        icon={LogOut}
      />
    </header>
  )
}

export default Navbar