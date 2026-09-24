const Pledge = require('../models/Pledge');
const Member = require('../models/Member');
const Campaign = require('../models/Campaign');

exports.getPledges = async (req, res, next) => {
    try {
        const { member, campaign, status } = req.query;
        let query = {};
        if (member) query.member = member;
        if (campaign) query.campaign = campaign;
        if (status) query.status = status;

        const pledges = await Pledge.find(query)
            .populate('member', 'name phone group')
            .populate('campaign', 'title targetAmount')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: pledges.length, data: pledges });
    } catch (error) {
        next(error);
    }
};

exports.getPledge = async (req, res, next) => {
    try {
        const pledge = await Pledge.findById(req.params.id)
            .populate('member', 'name phone group')
            .populate('campaign', 'title');
        if (!pledge) {
            return res
                .status(404)
                .json({ success: false, message: 'Pledge not found' });
        }
        res.json({ success: true, data: pledge });
    } catch (error) {
        next(error);
    }
};

exports.createPledge = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;
        const pledge = await Pledge.create(req.body);

        // Update campaign total pledged
        await Campaign.findByIdAndUpdate(pledge.campaign, {
            $inc: { totalPledged: pledge.amount },
        });

        // Update member total pledged
        await Member.findByIdAndUpdate(pledge.member, {
            $inc: { totalPledged: pledge.amount },
        });

        const populated = await pledge.populate([
            { path: 'member', select: 'name phone group' },
            { path: 'campaign', select: 'title' },
        ]);

        res.status(201).json({
            success: true,
            message: 'Pledge created successfully',
            data: populated,
        });
    } catch (error) {
        next(error);
    }
};

exports.updatePledge = async (req, res, next) => {
    try {
        const oldPledge = await Pledge.findById(req.params.id);
        if (!oldPledge) {
            return res
                .status(404)
                .json({ success: false, message: 'Pledge not found' });
        }

        const oldAmount = oldPledge.amount;
        const pledge = await Pledge.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        // Adjust member/campaign totals if amount changed
        if (req.body.amount && req.body.amount !== oldAmount) {
            const diff = req.body.amount - oldAmount;
            await Member.findByIdAndUpdate(pledge.member, {
                $inc: { totalPledged: diff },
            });
            await Campaign.findByIdAndUpdate(pledge.campaign, {
                $inc: { totalPledged: diff },
            });
        }

        res.json({ success: true, message: 'Pledge updated', data: pledge });
    } catch (error) {
        next(error);
    }
};

exports.deletePledge = async (req, res, next) => {
    try {
        const pledge = await Pledge.findByIdAndDelete(req.params.id);
        if (!pledge) {
            return res
                .status(404)
                .json({ success: false, message: 'Pledge not found' });
        }

        await Member.findByIdAndUpdate(pledge.member, {
            $inc: { totalPledged: -pledge.amount },
        });
        await Campaign.findByIdAndUpdate(pledge.campaign, {
            $inc: { totalPledged: -pledge.amount },
        });

        res.json({ success: true, message: 'Pledge deleted' });
    } catch (error) {
        next(error);
    }
};

exports.getOverduePledges = async (req, res, next) => {
    try {
        const pledges = await Pledge.find({
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' },
        })
            .populate('member', 'name phone')
            .populate('campaign', 'title');

        res.json({ success: true, count: pledges.length, data: pledges });
    } catch (error) {
        next(error);
    }
};