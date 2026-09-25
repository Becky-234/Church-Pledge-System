const express = require('express')
const router = express.Router()
const {
    getDashboard,
    exportExcel,
    exportPDF,
} = require('../controllers/reportController')
const { protect } = require('../middleware/auth')
const { canExportReports } = require('../middleware/roleMiddleware')

router.use(protect)

// Dashboard: everyone
router.get('/dashboard', getDashboard)

// Reports: admin, pastor, treasurer
router.get('/export/excel', canExportReports, exportExcel)
router.get('/export/pdf', canExportReports, exportPDF)

module.exports = router