import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Megaphone,
  HandCoins,
  Wallet,
  BarChart3,
  Bell,
  Church,
  LogOut,
} from 'lucide-react'
import { usePermissions } from '../../hooks/usePermissions'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import ConfirmDialog from '../common/ConfirmDialog'

const Sidebar = ({ isOpen, onClose }) => {
  const {
    canViewMembers,
    canViewCampaigns,
    canViewPledges,
    canViewCollections,
    canViewReports,
    canViewNotifications,
  } = usePermissions()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true, show: true },
    { to: '/members', icon: Users, label: 'Members', show: canViewMembers },
    { to: '/campaigns', icon: Megaphone, label: 'Campaigns', show: canViewCampaigns },
    { to: '/pledges', icon: HandCoins, label: 'Pledges', show: canViewPledges },
    { to: '/collections', icon: Wallet, label: 'Collections', show: canViewCollections },
    { to: '/reports', icon: BarChart3, label: 'Reports', show: canViewReports },
    { to: '/notifications', icon: Bell, label: 'Notifications', show: canViewNotifications },
  ].filter((item) => item.show)

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
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white/70 backdrop-blur-xl border-r border-white/60 shadow-[4px_0_30px_rgba(0,0,0,0.04)] z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-3 h-16 px-6 border-b border-white/60 shrink-0">
          <div className="p-2 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg shadow-sm shadow-primary-500/30">
            <Church className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-secondary-800">Church Pledge</h1>
            <p className="text-xs text-secondary-400">Management System</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-md shadow-primary-500/30'
                    : 'text-secondary-600 hover:bg-white/80 hover:text-primary-600 hover:shadow-sm hover:translate-x-0.5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white transition-all duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40 group-hover:bg-primary-400'
                    }`}
                  />
                  <item.icon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isActive ? '' : 'group-hover:scale-110'
                    }`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout — pinned to bottom */}
        <div className="p-4 border-t border-white/60 shrink-0">
          <div className="flex items-center gap-3 mb-2 px-1">
            <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm shadow-primary-500/30">
              {initials || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-secondary-800 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-secondary-500 capitalize truncate">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLogoutConfirmOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50/80 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

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
    </>
  )
}

export default Sidebar