const express = require('express')
const router = express.Router()
const {
    getCollections,
    getCollection,
    createCollection,
    deleteCollection,
} = require('../controllers/collectionController')
const { protect } = require('../middleware/auth')
const { canManageCollections } = require('../middleware/roleMiddleware')

router.use(protect)

// Everyone can view collections
router.get('/', getCollections)
router.get('/:id', getCollection)

// Only admin and treasurer can manage
router.post('/', canManageCollections, createCollection)
router.delete('/:id', canManageCollections, deleteCollection)

module.exports = router