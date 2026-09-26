import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import RoleRoute from './components/common/RoleRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Campaigns from './pages/Campaigns'
import Pledges from './pages/Pledges'
import Collections from './pages/Collections'
import Reports from './pages/Reports'
import Notifications from './pages/Notifications'

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<Landing />} />

      {/* Public auth pages */}
      <Route
        path="/login"
        element={user ? <Navigate to="/app" /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/app" /> : <Register />}
      />

      {/* Protected app pages */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="members"
          element={
            <RoleRoute permission="canViewMembers">
              <Members />
            </RoleRoute>
          }
        />
        <Route
          path="campaigns"
          element={
            <RoleRoute permission="canViewCampaigns">
              <Campaigns />
            </RoleRoute>
          }
        />
        <Route
          path="pledges"
          element={
            <RoleRoute permission="canViewPledges">
              <Pledges />
            </RoleRoute>
          }
        />
        <Route
          path="collections"
          element={
            <RoleRoute permission="canViewCollections">
              <Collections />
            </RoleRoute>
          }
        />
        <Route
          path="reports"
          element={
            <RoleRoute permission="canViewReports">
              <Reports />
            </RoleRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <RoleRoute permission="canViewNotifications">
              <Notifications />
            </RoleRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App