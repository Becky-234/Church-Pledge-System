import { useAuth } from './useAuth'

export const usePermissions = () => {
    const { user } = useAuth()
    const role = user?.role || 'member'

    return {
        role,

        // Member management
        canManageMembers: role === 'admin',
        canViewMembers: ['admin', 'pastor', 'treasurer'].includes(role),

        // Campaigns
        canManageCampaigns: role === 'admin',
        canViewCampaigns: ['admin', 'pastor', 'treasurer', 'member'].includes(role),

        // Pledges
        canManagePledges: ['admin', 'treasurer'].includes(role),
        canViewPledges: true,

        // Collections
        canManageCollections: ['admin', 'treasurer'].includes(role),
        canViewCollections: true,

        // Reports
        canExportReports: ['admin', 'pastor', 'treasurer'].includes(role),
        canViewReports: ['admin', 'pastor', 'treasurer'].includes(role),

        // Notifications
        canSendNotifications: ['admin', 'pastor', 'treasurer'].includes(role),
        canViewNotifications: true,

        // Users
        canManageUsers: role === 'admin',
    }
}