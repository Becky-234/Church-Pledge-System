const express = require('express');
const router = express.Router();
const {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
} = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getCampaigns).post(createCampaign);
router
    .route('/:id')
    .get(getCampaign)
    .put(updateCampaign)
    .delete(deleteCampaign);

module.exports = router;