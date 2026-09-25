const express = require('express')
const router = express.Router()
const {
    getPledges,
    getPledge,
    createPledge,
    updatePledge,
    deletePledge,
    getOverduePledges,
} = require('../controllers/pledgeController')
const { protect } = require('../middleware/auth')
const { canManagePledges } = require('../middleware/roleMiddleware')

router.use(protect)

// Everyone can view pledges
router.get('/', getPledges)
router.get('/overdue', canManagePledges, getOverduePledges)
router.get('/:id', getPledge)

// Only admin and treasurer can manage
router.post('/', canManagePledges, createPledge)
router.put('/:id', canManagePledges, updatePledge)
router.delete('/:id', canManagePledges, deletePledge)

module.exports = router