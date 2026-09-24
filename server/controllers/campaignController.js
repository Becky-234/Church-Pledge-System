const Campaign = require('../models/Campaign');

exports.getCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: campaigns.length, data: campaigns });
    } catch (error) {
        next(error);
    }
};

exports.getCampaign = async (req, res, next) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate(
            'createdBy',
            'name'
        );
        if (!campaign) {
            return res
                .status(404)
                .json({ success: false, message: 'Campaign not found' });
        }
        res.json({ success: true, data: campaign });
    } catch (error) {
        next(error);
    }
};

exports.createCampaign = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;
        const campaign = await Campaign.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Campaign created successfully',
            data: campaign,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCampaign = async (req, res, next) => {
    try {
        const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!campaign) {
            return res
                .status(404)
                .json({ success: false, message: 'Campaign not found' });
        }
        res.json({
            success: true,
            message: 'Campaign updated',
            data: campaign,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCampaign = async (req, res, next) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);
        if (!campaign) {
            return res
                .status(404)
                .json({ success: false, message: 'Campaign not found' });
        }
        res.json({ success: true, message: 'Campaign deleted' });
    } catch (error) {
        next(error);
    }
};