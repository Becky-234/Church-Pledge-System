const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true,
        },
        type: {
            type: String,
            enum: ['reminder', 'confirmation', 'announcement'],
            required: true,
        },
        channel: {
            type: String,
            enum: ['sms', 'email', 'in_app'],
            default: 'in_app',
        },
        subject: { type: String, trim: true },
        message: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'sent', 'failed'],
            default: 'pending',
        },
        sentAt: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);