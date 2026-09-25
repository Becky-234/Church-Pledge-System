import api from './api'

const collectionService = {
    getAll: async () => {
        const { data } = await api.get('/collections')
        return data
    },

    getById: async (id) => {
        const { data } = await api.get(`/collections/${id}`)
        return data
    },

    create: async (collectionData) => {
        const { data } = await api.post('/collections', collectionData)
        return data
    },

    delete: async (id) => {
        const { data } = await api.delete(`/collections/${id}`)
        return data
    },
}

export default collectionService