const express = require('express');
const router = express.Router();
const {
    getDashboard,
    exportExcel,
    exportPDF,
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/export/excel', exportExcel);
router.get('/export/pdf', exportPDF);

module.exports = router;