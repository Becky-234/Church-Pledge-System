const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema(
    {
        pledge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pledge',
            required: true,
        },
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true,
        },
        amount: { type: Number, required: true, min: 0 },
        paymentMethod: {
            type: String,
            enum: ['cash', 'mobile_money', 'bank_transfer', 'cheque'],
            default: 'cash',
        },
        reference: { type: String, trim: true },
        notes: { type: String, trim: true },
        recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        collectedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Collection', collectionSchema);