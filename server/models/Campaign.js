const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        targetAmount: { type: Number, required: true, min: 0 },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ['active', 'completed', 'cancelled'],
            default: 'active',
        },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        totalPledged: { type: Number, default: 0 },
        totalCollected: { type: Number, default: 0 },
    },
    { timestamps: true }
);

campaignSchema.virtual('progress').get(function () {
    if (this.targetAmount === 0) return 0;
    return Math.round((this.totalCollected / this.targetAmount) * 100);
});

campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);