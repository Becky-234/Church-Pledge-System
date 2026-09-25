import { Navigate } from 'react-router-dom'
import { usePermissions } from '../../hooks/usePermissions'
import EmptyState from './EmptyState'
import { ShieldAlert } from 'lucide-react'

const RoleRoute = ({ children, allowedRoles = [], permission }) => {
  const permissions = usePermissions()
  const userRole = permissions.role

  // Check by role OR by permission flag
  const hasAccess = permission
    ? permissions[permission]
    : allowedRoles.includes(userRole)

  if (!hasAccess) {
    return (
      <div className="card">
        <EmptyState
          icon={ShieldAlert}
          title="Access Denied"
          description={`Your role (${userRole}) does not have permission to view this page.`}
        />
      </div>
    )
  }

  return children
}

export default RoleRoute