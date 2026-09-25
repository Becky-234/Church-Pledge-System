import api from './api'

const notificationService = {
    getAll: async () => {
        const { data } = await api.get('/notifications')
        return data
    },

    create: async (notificationData) => {
        const { data } = await api.post('/notifications', notificationData)
        return data
    },

    sendReminders: async () => {
        const { data } = await api.post('/notifications/reminders')
        return data
    },

    delete: async (id) => {
        const { data } = await api.delete(`/notifications/${id}`)
        return data
    },
}

export default notificationService