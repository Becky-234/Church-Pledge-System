const mongoose = require('mongoose');

const pledgeSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true,
        },
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Campaign',
            required: true,
        },
        amount: { type: Number, required: true, min: 0 },
        description: { type: String, trim: true },
        dueDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ['pending', 'partial', 'completed', 'overdue'],
            default: 'pending',
        },
        amountPaid: { type: Number, default: 0 },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

// Virtual for balance
pledgeSchema.virtual('balance').get(function () {
    return this.amount - this.amountPaid;
});

// Auto-update status before save (Mongoose 8 compatible)
pledgeSchema.pre('save', function () {
    if (this.amountPaid >= this.amount) {
        this.status = 'completed';
    } else if (this.amountPaid > 0) {
        this.status = 'partial';
    } else if (new Date() > this.dueDate) {
        this.status = 'overdue';
    } else {
        this.status = 'pending';
    }
    // No next() needed - just return
});

pledgeSchema.set('toJSON', { virtuals: true });
pledgeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Pledge', pledgeSchema);