import api from './api'

const memberService = {
    getAll: async (params = {}) => {
        const { data } = await api.get('/members', { params })
        return data
    },

    getById: async (id) => {
        const { data } = await api.get(`/members/${id}`)
        return data
    },

    create: async (memberData) => {
        const { data } = await api.post('/members', memberData)
        return data
    },

    update: async (id, memberData) => {
        const { data } = await api.put(`/members/${id}`, memberData)
        return data
    },

    delete: async (id) => {
        const { data } = await api.delete(`/members/${id}`)
        return data
    },

    getGroups: async () => {
        const { data } = await api.get('/members/groups')
        return data
    },
}

export default memberService