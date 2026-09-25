import api from './api'

const authService = {
    login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password })
        return data
    },

    register: async (userData) => {
        const { data } = await api.post('/auth/register', userData)
        return data
    },

    getMe: async () => {
        const { data } = await api.get('/auth/me')
        return data
    },
}

export default authService