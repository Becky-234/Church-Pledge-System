import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden relative">
      <div className="pointer-events-none fixed -top-24 -left-24 w-72 h-72 bg-primary-300/30 rounded-full blur-3xl" />
      <div className="pointer-events-none fixed -bottom-24 -right-24 w-72 h-72 bg-secondary-300/30 rounded-full blur-3xl" />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout