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
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-gradient-to-b from-primary-500 to-primary-600 shadow-[4px_0_30px_rgba(232,93,58,0.25)] z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-3 h-16 px-6 border-b border-white/15 shrink-0">
          <div className="p-2 bg-white/15 backdrop-blur-sm rounded-lg">
            <Church className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Church Pledge</h1>
            <p className="text-xs text-white/60">Management System</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-primary-600 shadow-md shadow-black/10'
                    : 'text-white/80 hover:bg-white/15 hover:text-white hover:translate-x-0.5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
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
        <div className="p-4 border-t border-white/15 shrink-0">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 shrink-0 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-xs">
              {initials || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-white/60 capitalize truncate">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLogoutConfirmOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/90 bg-white/10 hover:bg-white/20 transition"
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