const Notification = require('../models/Notification');
const Pledge = require('../models/Pledge');

exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find()
            .populate('recipient', 'name phone')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        next(error);
    }
};

exports.createNotification = async (req, res, next) => {
    try {
        const notification = await Notification.create(req.body);

        // In a real production system, you'd send SMS/email here using
        // Twilio / Nodemailer. For this assignment, we simulate success.
        notification.status = 'sent';
        notification.sentAt = new Date();
        await notification.save();

        res.status(201).json({
            success: true,
            message: 'Notification sent',
            data: notification,
        });
    } catch (error) {
        next(error);
    }
};

exports.sendReminders = async (req, res, next) => {
    try {
        // Find pledges due within next 7 days that aren't completed
        const upcoming = await Pledge.find({
            dueDate: {
                $gte: new Date(),
                $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            status: { $ne: 'completed' },
        }).populate('member', 'name phone');

        const notifications = [];
        for (const pledge of upcoming) {
            const n = await Notification.create({
                recipient: pledge.member._id,
                type: 'reminder',
                channel: 'sms',
                subject: 'Payment Reminder',
                message: `Dear ${pledge.member.name}, your pledge of ${pledge.amount} is due on ${pledge.dueDate.toDateString()}. Thank you!`,
                status: 'sent',
                sentAt: new Date(),
            });
            notifications.push(n);
        }

        res.json({
            success: true,
            message: `${notifications.length} reminders sent`,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteNotification = async (req, res, next) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        next(error);
    }
};