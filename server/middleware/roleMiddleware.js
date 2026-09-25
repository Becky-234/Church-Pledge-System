const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated',
            })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. This action requires one of: ${roles.join(', ')}`,
            })
        }

        next()
    }
}

// Permission helpers
const canManageMembers = authorize('admin')
const canViewMembers = authorize('admin', 'pastor', 'treasurer')
const canManageCampaigns = authorize('admin')
const canManagePledges = authorize('admin', 'treasurer')
const canManageCollections = authorize('admin', 'treasurer')
const canExportReports = authorize('admin', 'pastor', 'treasurer')
const canManageUsers = authorize('admin')
const canSendNotifications = authorize('admin', 'pastor', 'treasurer')

module.exports = {
    authorize,
    canManageMembers,
    canViewMembers,
    canManageCampaigns,
    canManagePledges,
    canManageCollections,
    canExportReports,
    canManageUsers,
    canSendNotifications,
}