const Member = require('../models/Member');

// @desc    Get all members
// @route   GET /api/members
exports.getMembers = async (req, res, next) => {
    try {
        const { group, search } = req.query;
        let query = {};

        if (group) query.group = group;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const members = await Member.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: members.length, data: members });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single member
// @route   GET /api/members/:id
exports.getMember = async (req, res, next) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res
                .status(404)
                .json({ success: false, message: 'Member not found' });
        }
        res.json({ success: true, data: member });
    } catch (error) {
        next(error);
    }
};

// @desc    Create member
// @route   POST /api/members
exports.createMember = async (req, res, next) => {
    try {
        const member = await Member.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Member created successfully',
            data: member,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update member
// @route   PUT /api/members/:id
exports.updateMember = async (req, res, next) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!member) {
            return res
                .status(404)
                .json({ success: false, message: 'Member not found' });
        }
        res.json({
            success: true,
            message: 'Member updated successfully',
            data: member,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
exports.deleteMember = async (req, res, next) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) {
            return res
                .status(404)
                .json({ success: false, message: 'Member not found' });
        }
        res.json({ success: true, message: 'Member deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all unique groups
// @route   GET /api/members/groups
exports.getGroups = async (req, res, next) => {
    try {
        const groups = await Member.distinct('group');
        res.json({ success: true, data: groups });
    } catch (error) {
        next(error);
    }
};