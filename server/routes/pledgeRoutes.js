const express = require('express');
const router = express.Router();
const {
    getPledges,
    getPledge,
    createPledge,
    updatePledge,
    deletePledge,
    getOverduePledges,
} = require('../controllers/pledgeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getPledges).post(createPledge);
router.get('/overdue', getOverduePledges);
router
    .route('/:id')
    .get(getPledge)
    .put(updatePledge)
    .delete(deletePledge);

module.exports = router;