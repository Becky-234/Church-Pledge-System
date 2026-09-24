const express = require('express');
const router = express.Router();
const {
    getMembers,
    getMember,
    createMember,
    updateMember,
    deleteMember,
    getGroups,
} = require('../controllers/memberController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getMembers).post(createMember);
router.get('/groups', getGroups);
router
    .route('/:id')
    .get(getMember)
    .put(updateMember)
    .delete(deleteMember);

module.exports = router;