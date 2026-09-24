const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const pledgeRoutes = require('./routes/pledgeRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Root
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Church Pledge Management System API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            members: '/api/members',
            campaigns: '/api/campaigns',
            pledges: '/api/pledges',
            collections: '/api/collections',
            reports: '/api/reports',
            notifications: '/api/notifications',
        },
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/pledges', pledgeRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(` http://localhost:${PORT}\n`);
});