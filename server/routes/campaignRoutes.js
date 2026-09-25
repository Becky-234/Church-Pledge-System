const express = require('express')
const router = express.Router()
const {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
} = require('../controllers/campaignController')
const { protect } = require('../middleware/auth')
const { canManageCampaigns } = require('../middleware/roleMiddleware')

router.use(protect)

// Everyone can view campaigns
router.get('/', getCampaigns)
router.get('/:id', getCampaign)

// Only admin can create/edit/delete
router.post('/', canManageCampaigns, createCampaign)
router.put('/:id', canManageCampaigns, updateCampaign)
router.delete('/:id', canManageCampaigns, deleteCampaign)

module.exports = router