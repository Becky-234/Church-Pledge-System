import api from './api'

const reportService = {
    getDashboard: async () => {
        const { data } = await api.get('/reports/dashboard')
        return data
    },

    exportExcel: async () => {
        const response = await api.get('/reports/export/excel', {
            responseType: 'blob',
        })
        return response
    },

    exportPDF: async () => {
        const response = await api.get('/reports/export/pdf', {
            responseType: 'blob',
        })
        return response
    },
}

export default reportService