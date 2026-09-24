const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Member = require('../models/Member');
const Campaign = require('../models/Campaign');
const Pledge = require('../models/Pledge');
const Collection = require('../models/Collection');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            User.deleteMany(),
            Member.deleteMany(),
            Campaign.deleteMany(),
            Pledge.deleteMany(),
            Collection.deleteMany(),
        ]);
        console.log('Cleared existing data');

        // Create admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@church.com',
            password: 'Admin@123',
            role: 'admin',
        });

        const treasurer = await User.create({
            name: 'Treasurer User',
            email: 'treasurer@church.com',
            password: 'Treasurer@123',
            role: 'treasurer',
        });
        console.log('👤 Users created');

        // Create members
        const members = await Member.insertMany([
            { name: 'John Doe', phone: '+256701000001', email: 'john@church.com', group: 'Youth Fellowship' },
            { name: 'Mary Jane', phone: '+256701000002', email: 'mary@church.com', group: 'Women Fellowship' },
            { name: 'Peter Paul', phone: '+256701000003', email: 'peter@church.com', group: 'Men Fellowship' },
            { name: 'Sarah Williams', phone: '+256701000004', email: 'sarah@church.com', group: 'Youth Fellowship' },
            { name: 'David Kim', phone: '+256701000005', email: 'david@church.com', group: 'Choir' },
        ]);
        console.log(`👥 ${members.length} members created`);

        // Create campaigns
        const campaigns = await Campaign.insertMany([
            {
                title: 'New Church Building',
                description: 'Funds for new church building project',
                targetAmount: 100000000,
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
                createdBy: admin._id,
            },
            {
                title: 'Youth Camp 2024',
                description: 'Annual youth camp sponsorship',
                targetAmount: 5000000,
                startDate: new Date('2024-06-01'),
                endDate: new Date('2024-08-31'),
                createdBy: admin._id,
            },
        ]);
        console.log(`${campaigns.length} campaigns created`);

        // Create pledges
        const pledges = await Pledge.insertMany([
            { member: members[0]._id, campaign: campaigns[0]._id, amount: 500000, dueDate: new Date('2024-12-31'), createdBy: treasurer._id },
            { member: members[1]._id, campaign: campaigns[0]._id, amount: 1000000, dueDate: new Date('2024-12-31'), createdBy: treasurer._id },
            { member: members[2]._id, campaign: campaigns[1]._id, amount: 300000, dueDate: new Date('2024-08-31'), createdBy: treasurer._id },
            { member: members[3]._id, campaign: campaigns[1]._id, amount: 250000, dueDate: new Date('2024-08-31'), createdBy: treasurer._id },
            { member: members[4]._id, campaign: campaigns[0]._id, amount: 750000, dueDate: new Date('2024-12-31'), createdBy: treasurer._id },
        ]);

        // Update campaign + member totals
        for (const p of pledges) {
            await Campaign.findByIdAndUpdate(p.campaign, { $inc: { totalPledged: p.amount } });
            await Member.findByIdAndUpdate(p.member, { $inc: { totalPledged: p.amount } });
        }
        console.log(`${pledges.length} pledges created`);

        console.log('\n Seed complete!\n');
        console.log('Login credentials:');
        console.log('   Admin:     admin@church.com / Admin@123');
        console.log('   Treasurer: treasurer@church.com / Treasurer@123\n');

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seed();