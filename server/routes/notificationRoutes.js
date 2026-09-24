const express = require('express');
const router = express.Router();
const {
    getNotifications,
    createNotification,
    sendReminders,
    deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getNotifications).post(createNotification);
router.post('/reminders', sendReminders);
router.delete('/:id', deleteNotification);

module.exports = router;