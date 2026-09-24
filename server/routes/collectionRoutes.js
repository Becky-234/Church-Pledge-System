const express = require('express');
const router = express.Router();
const {
    getCollections,
    getCollection,
    createCollection,
    deleteCollection,
} = require('../controllers/collectionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getCollections).post(createCollection);
router
    .route('/:id')
    .get(getCollection)
    .delete(deleteCollection);

module.exports = router;