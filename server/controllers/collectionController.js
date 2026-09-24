const Collection = require('../models/Collection');
const Pledge = require('../models/Pledge');
const Member = require('../models/Member');
const Campaign = require('../models/Campaign');

exports.getCollections = async (req, res, next) => {
    try {
        const collections = await Collection.find()
            .populate('member', 'name phone')
            .populate('pledge', 'amount')
            .populate('recordedBy', 'name')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: collections.length, data: collections });
    } catch (error) {
        next(error);
    }
};

exports.getCollection = async (req, res, next) => {
    try {
        const collection = await Collection.findById(req.params.id)
            .populate('member', 'name phone')
            .populate('pledge', 'amount');
        if (!collection) {
            return res
                .status(404)
                .json({ success: false, message: 'Collection not found' });
        }
        res.json({ success: true, data: collection });
    } catch (error) {
        next(error);
    }
};

exports.createCollection = async (req, res, next) => {
    try {
        const { pledge: pledgeId, amount } = req.body;

        const pledge = await Pledge.findById(pledgeId);
        if (!pledge) {
            return res
                .status(404)
                .json({ success: false, message: 'Pledge not found' });
        }

        req.body.member = pledge.member;
        req.body.recordedBy = req.user.id;

        const collection = await Collection.create(req.body);

        // Update pledge amountPaid
        pledge.amountPaid += Number(amount);
        await pledge.save();

        // Update member totalPaid
        await Member.findByIdAndUpdate(pledge.member, {
            $inc: { totalPaid: Number(amount) },
        });

        // Update campaign totalCollected
        await Campaign.findByIdAndUpdate(pledge.campaign, {
            $inc: { totalCollected: Number(amount) },
        });

        const populated = await collection.populate([
            { path: 'member', select: 'name phone' },
            { path: 'pledge', select: 'amount' },
        ]);

        res.status(201).json({
            success: true,
            message: 'Collection recorded successfully',
            data: populated,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCollection = async (req, res, next) => {
    try {
        const collection = await Collection.findByIdAndDelete(req.params.id);
        if (!collection) {
            return res
                .status(404)
                .json({ success: false, message: 'Collection not found' });
        }

        // Reverse pledge payment
        const pledge = await Pledge.findById(collection.pledge);
        if (pledge) {
            pledge.amountPaid = Math.max(0, pledge.amountPaid - collection.amount);
            await pledge.save();

            await Member.findByIdAndUpdate(pledge.member, {
                $inc: { totalPaid: -collection.amount },
            });
            await Campaign.findByIdAndUpdate(pledge.campaign, {
                $inc: { totalCollected: -collection.amount },
            });
        }

        res.json({ success: true, message: 'Collection deleted' });
    } catch (error) {
        next(error);
    }
};