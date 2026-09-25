const express = require('express')
const router = express.Router()
const {
    getMembers,
    getMember,
    createMember,
    updateMember,
    deleteMember,
    getGroups,
} = require('../controllers/memberController')
const { protect } = require('../middleware/auth')
const {
    canManageMembers,
    canViewMembers,
} = require('../middleware/roleMiddleware')

router.use(protect)

// Read access: admin, pastor, treasurer
router.get('/', canViewMembers, getMembers)
router.get('/groups', canViewMembers, getGroups)
router.get('/:id', canViewMembers, getMember)

// Write access: admin only
router.post('/', canManageMembers, createMember)
router.put('/:id', canManageMembers, updateMember)
router.delete('/:id', canManageMembers, deleteMember)

module.exports = router