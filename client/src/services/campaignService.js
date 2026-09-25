import api from './api'

const campaignService = {
    getAll: async () => {
        const { data } = await api.get('/campaigns')
        return data
    },

    getById: async (id) => {
        const { data } = await api.get(`/campaigns/${id}`)
        return data
    },

    create: async (campaignData) => {
        const { data } = await api.post('/campaigns', campaignData)
        return data
    },

    update: async (id, campaignData) => {
        const { data } = await api.put(`/campaigns/${id}`, campaignData)
        return data
    },

    delete: async (id) => {
        const { data } = await api.delete(`/campaigns/${id}`)
        return data
    },
}

export default campaignService