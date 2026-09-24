const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Name is required'], trim: true },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            unique: true,
            trim: true,
        },
        email: { type: String, lowercase: true, trim: true },
        group: {
            type: String,
            required: [true, 'Group is required'],
            trim: true,
        },
        address: { type: String, trim: true },
        dateJoined: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true },
        totalPledged: { type: Number, default: 0 },
        totalPaid: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Virtual for balance
memberSchema.virtual('balance').get(function () {
    return this.totalPledged - this.totalPaid;
});

memberSchema.set('toJSON', { virtuals: true });
memberSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Member', memberSchema);