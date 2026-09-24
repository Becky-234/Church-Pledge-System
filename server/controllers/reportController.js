const Member = require('../models/Member');
const Pledge = require('../models/Pledge');
const Campaign = require('../models/Campaign');
const Collection = require('../models/Collection');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

exports.getDashboard = async (req, res, next) => {
    try {
        const [
            totalMembers,
            totalCampaigns,
            pledges,
            collections,
            recentCollections,
            overduePledges,
        ] = await Promise.all([
            Member.countDocuments(),
            Campaign.countDocuments(),
            Pledge.find(),
            Collection.find(),
            Collection.find()
                .populate('member', 'name')
                .sort({ createdAt: -1 })
                .limit(5),
            Pledge.find({
                dueDate: { $lt: new Date() },
                status: { $ne: 'completed' },
            })
                .populate('member', 'name')
                .limit(5),
        ]);

        const totalPledged = pledges.reduce((sum, p) => sum + p.amount, 0);
        const totalCollected = collections.reduce((sum, c) => sum + c.amount, 0);
        const balance = totalPledged - totalCollected;

        res.json({
            success: true,
            data: {
                totalMembers,
                totalCampaigns,
                totalPledged,
                totalCollected,
                balance,
                totalPledges: pledges.length,
                totalCollections: collections.length,
                collectionRate:
                    totalPledged > 0
                        ? Math.round((totalCollected / totalPledged) * 100)
                        : 0,
                recentCollections,
                overduePledges,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.exportExcel = async (req, res, next) => {
    try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Church Pledge System';

        // Sheet 1: Members
        const membersSheet = workbook.addWorksheet('Members');
        membersSheet.columns = [
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Phone', key: 'phone', width: 20 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Group', key: 'group', width: 20 },
            { header: 'Total Pledged', key: 'totalPledged', width: 15 },
            { header: 'Total Paid', key: 'totalPaid', width: 15 },
            { header: 'Balance', key: 'balance', width: 15 },
        ];
        const members = await Member.find();
        members.forEach((m) => {
            membersSheet.addRow({
                name: m.name,
                phone: m.phone,
                email: m.email,
                group: m.group,
                totalPledged: m.totalPledged,
                totalPaid: m.totalPaid,
                balance: m.totalPledged - m.totalPaid,
            });
        });

        membersSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        membersSheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF2C3E50' },
        };

        // Sheet 2: Pledges
        const pledgesSheet = workbook.addWorksheet('Pledges');
        pledgesSheet.columns = [
            { header: 'Member', key: 'member', width: 25 },
            { header: 'Campaign', key: 'campaign', width: 25 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Paid', key: 'paid', width: 15 },
            { header: 'Balance', key: 'balance', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Due Date', key: 'dueDate', width: 15 },
        ];
        const pledges = await Pledge.find()
            .populate('member', 'name')
            .populate('campaign', 'title');
        pledges.forEach((p) => {
            pledgesSheet.addRow({
                member: p.member?.name || 'N/A',
                campaign: p.campaign?.title || 'N/A',
                amount: p.amount,
                paid: p.amountPaid,
                balance: p.amount - p.amountPaid,
                status: p.status,
                dueDate: p.dueDate.toISOString().split('T')[0],
            });
        });

        pledgesSheet.getRow(1).font = {
            bold: true,
            color: { argb: 'FFFFFFFF' },
        };
        pledgesSheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF2C3E50' },
        };

        // Sheet 3: Collections
        const collectionsSheet = workbook.addWorksheet('Collections');
        collectionsSheet.columns = [
            { header: 'Member', key: 'member', width: 25 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Method', key: 'method', width: 20 },
            { header: 'Reference', key: 'reference', width: 20 },
            { header: 'Date', key: 'date', width: 15 },
        ];
        const collections = await Collection.find().populate('member', 'name');
        collections.forEach((c) => {
            collectionsSheet.addRow({
                member: c.member?.name || 'N/A',
                amount: c.amount,
                method: c.paymentMethod,
                reference: c.reference || '',
                date: c.collectedAt.toISOString().split('T')[0],
            });
        });

        collectionsSheet.getRow(1).font = {
            bold: true,
            color: { argb: 'FFFFFFFF' },
        };
        collectionsSheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF2C3E50' },
        };

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=church-report-${Date.now()}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        next(error);
    }
};

exports.exportPDF = async (req, res, next) => {
    try {
        const doc = new PDFDocument({ margin: 40 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=church-report-${Date.now()}.pdf`
        );

        doc.pipe(res);

        // Title
        doc.fontSize(20).fillColor('#2C3E50').text('Church Pledge System', {
            align: 'center',
        });
        doc.moveDown(0.3);
        doc
            .fontSize(10)
            .fillColor('#7F8C8D')
            .text(`Report Generated: ${new Date().toLocaleString()}`, {
                align: 'center',
            });
        doc.moveDown(1.5);

        // Summary
        const pledges = await Pledge.find();
        const collections = await Collection.find();
        const totalPledged = pledges.reduce((s, p) => s + p.amount, 0);
        const totalCollected = collections.reduce((s, c) => s + c.amount, 0);

        doc.fontSize(14).fillColor('#2C3E50').text('Summary');
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000');
        doc.text(`Total Pledged: ${totalPledged.toLocaleString()}`);
        doc.text(`Total Collected: ${totalCollected.toLocaleString()}`);
        doc.text(`Balance: ${(totalPledged - totalCollected).toLocaleString()}`);
        doc.moveDown(1.5);

        // Members
        doc.fontSize(14).fillColor('#2C3E50').text('Members');
        doc.moveDown(0.5);
        const members = await Member.find();
        members.forEach((m) => {
            doc
                .fontSize(10)
                .fillColor('#000')
                .text(
                    `${m.name} | ${m.phone} | ${m.group} | Pledged: ${m.totalPledged} | Paid: ${m.totalPaid}`
                );
        });

        doc.end();
    } catch (error) {
        next(error);
    }
};