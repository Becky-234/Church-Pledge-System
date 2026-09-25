const express = require('express')
const router = express.Router()
const {
    getNotifications,
    createNotification,
    sendReminders,
    deleteNotification,
} = require('../controllers/notificationController')
const { protect } = require('../middleware/auth')
const { canSendNotifications } = require('../middleware/roleMiddleware')

router.use(protect)

router.get('/', getNotifications)
router.post('/', canSendNotifications, createNotification)
router.post('/reminders', canSendNotifications, sendReminders)
router.delete('/:id', canSendNotifications, deleteNotification)

module.exports = router