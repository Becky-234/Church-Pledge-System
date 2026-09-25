import api from './api'

const pledgeService = {
    getAll: async (params = {}) => {
        const { data } = await api.get('/pledges', { params })
        return data
    },

    getById: async (id) => {
        const { data } = await api.get(`/pledges/${id}`)
        return data
    },

    create: async (pledgeData) => {
        const { data } = await api.post('/pledges', pledgeData)
        return data
    },

    update: async (id, pledgeData) => {
        const { data } = await api.put(`/pledges/${id}`, pledgeData)
        return data
    },

    delete: async (id) => {
        const { data } = await api.delete(`/pledges/${id}`)
        return data
    },

    getOverdue: async () => {
        const { data } = await api.get('/pledges/overdue')
        return data
    },
}

export default pledgeService