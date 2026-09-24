#  Church Pledge Management System

![Church Pledge Management System](https://img.shields.io/badge/Church-Pledge%20Management-blue)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

> A comprehensive system for churches to manage members, pledge campaigns, collections, and generate reports with notifications.

---

##  Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Live Demo](#-live-demo)
- [Video Walkthrough](#-video-walkthrough)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

##  Overview

The **Church Pledge Management System** is a full-stack web application designed to help churches efficiently manage their pledge campaigns, track member contributions, record collections, send reminders, and generate comprehensive reports.

This system solves real problems faced by church administrators:
- Manual tracking of pledges in spreadsheets
- Difficulty in knowing who has paid and who hasn't
- No automated reminder system
- Time-consuming report generation
- Lack of visibility into campaign progress

---

##  Features

### 1.  Member Management
-  Add, edit, view, and delete church members
-  Store member details: name, phone, email, group/fellowship
-  Search and filter members by group
-  View member pledge history and payment status
-  Import/export member data

### 2.  Pledge Campaign Management
-  Create pledge campaigns with title, description, and target amount
-  Set campaign start and end dates
-  Assign pledges to individual members
-  Track pledge status (active, completed, overdue)
-  Support for both monetary and non-monetary pledges

### 3.  Collection & Balance Tracking
-  Record collections/payments against pledges
-  Support multiple payment methods (cash, mobile money, bank transfer, cheque)
-  Real-time balance calculation (pledged vs paid)
-  Generate receipts for collections
-  Track partial payments

### 4.  Notifications & Reminders
-  Send SMS reminders for due payments
-  Email notifications for payment confirmations
-  Automated reminder scheduling (daily/weekly)
-  In-app notification center
-  Customizable notification templates

### 5.  Dashboard & Reports
-  Interactive dashboard with key metrics
-  Total pledged vs total collected
-  Campaign progress visualization (charts)
-  Member contribution rankings
-  Export reports to **Excel (.xlsx)** and **PDF**
-  Filter reports by date range, campaign, and group

### 6.  Authentication & Authorization
-  JWT-based authentication
-  Role-based access control (Admin, Pastor, Treasurer, Member)
-  Password hashing with bcrypt
-  Session management
-  Password reset functionality

---

##  Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Email notifications |
| **Twilio** | SMS notifications |
| **ExcelJS** | Excel report generation |
| **PDFKit** | PDF report generation |
| **Node-cron** | Scheduled reminders |
| **Joi** | Input validation |
| **Helmet** | Security headers |
| **CORS** | Cross-origin resource sharing |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React.js** | UI library |
| **React Router** | Routing |
| **Axios** | HTTP client |
| **Chart.js** | Data visualization |
| **Tailwind CSS** | Styling |
| **React Hook Form** | Form handling |
| **React Toastify** | Notifications |
| **Date-fns** | Date manipulation |

### DevOps & Tools
| Technology | Purpose |
|------------|---------|
| **Git** | Version control |
| **GitHub Actions** | CI/CD |
| **Render** | Deployment |
| **MongoDB Atlas** | Cloud database |
| **Postman** | API testing |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |

---

##  Architecture
┌─────────────────────────────────────────────────────────────┐
│ CLIENT │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ React.js (Frontend) │ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐ │ │
│ │ │Dashboard│ │Members │ │Pledges │ │ Reports │ │ │
│ │ └─────────┘ └─────────┘ └─────────┘ └─────────────┘ │ │
│ └───────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
│ REST API (HTTP/HTTPS)
▼
┌─────────────────────────────────────────────────────────────┐
│ SERVER │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Node.js + Express.js │ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐ │ │
│ │ │ Auth │ │Members │ │Pledges │ │ Reports │ │ │
│ │ │ Routes │ │ Routes │ │ Routes │ │ Routes │ │ │
│ │ └─────────┘ └─────────┘ └─────────┘ └─────────────┘ │ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐ │ │
│ │ │Controllers│ │Services│ │Middleware│ │ Utils │ │ │
│ │ └─────────┘ └─────────┘ └─────────┘ └─────────────┘ │ │
│ └───────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ DATABASE │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ MongoDB Atlas │ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐ │ │
│ │ │ Users │ │Members │ │Pledges │ │ Collections │ │ │
│ │ └─────────┘ └─────────┘ └─────────┘ └─────────────┘ │ │
│ └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘


---

##  Project Structure
Church-Pledge-System/
├── server/ # Backend (Node.js + Express)
│ ├── config/
│ │ ├── db.js # MongoDB connection
│ │ └── env.js # Environment configuration
│ ├── controllers/
│ │ ├── authController.js # Authentication logic
│ │ ├── memberController.js # Member CRUD
│ │ ├── pledgeController.js # Pledge CRUD
│ │ ├── collectionController.js # Collection logic
│ │ ├── reportController.js # Report generation
│ │ └── notificationController.js# Notifications
│ ├── middleware/
│ │ ├── auth.js # JWT verification
│ │ ├── role.js # Role-based access
│ │ ├── validate.js # Input validation
│ │ └── errorHandler.js # Global error handler
│ ├── models/
│ │ ├── User.js # User schema
│ │ ├── Member.js # Member schema
│ │ ├── Campaign.js # Campaign schema
│ │ ├── Pledge.js # Pledge schema
│ │ ├── Collection.js # Collection schema
│ │ └── Notification.js # Notification schema
│ ├── routes/
│ │ ├── authRoutes.js # /api/auth
│ │ ├── memberRoutes.js # /api/members
│ │ ├── pledgeRoutes.js # /api/pledges
│ │ ├── collectionRoutes.js # /api/collections
│ │ ├── reportRoutes.js # /api/reports
│ │ └── notificationRoutes.js # /api/notifications
│ ├── services/
│ │ ├── emailService.js # Email sending
│ │ ├── smsService.js # SMS sending
│ │ ├── excelService.js # Excel generation
│ │ └── pdfService.js # PDF generation
│ ├── utils/
│ │ ├── logger.js # Logging utility
│ │ ├── helpers.js # Helper functions
│ │ └── constants.js # Constants
│ ├── jobs/
│ │ └── reminderJob.js # Cron job for reminders
│ ├── tests/
│ │ ├── auth.test.js
│ │ ├── member.test.js
│ │ └── pledge.test.js
│ ├── .env.example # Environment variables template
│ ├── .gitignore
│ ├── package.json
│ ├── server.js # Entry point
│ └── README.md
│
├── client/ # Frontend (React.js)
│ ├── public/
│ │ ├── index.html
│ │ └── favicon.ico
│ ├── src/
│ │ ├── assets/
│ │ │ ├── images/
│ │ │ └── styles/
│ │ ├── components/
│ │ │ ├── common/
│ │ │ │ ├── Navbar.jsx
│ │ │ │ ├── Sidebar.jsx
│ │ │ │ ├── Footer.jsx
│ │ │ │ ├── Loader.jsx
│ │ │ │ └── Modal.jsx
│ │ │ ├── dashboard/
│ │ │ │ ├── StatsCard.jsx
│ │ │ │ ├── ChartCard.jsx
│ │ │ │ └── RecentActivity.jsx
│ │ │ ├── members/
│ │ │ │ ├── MemberList.jsx
│ │ │ │ ├── MemberForm.jsx
│ │ │ │ └── MemberCard.jsx
│ │ │ ├── pledges/
│ │ │ │ ├── PledgeList.jsx
│ │ │ │ ├── PledgeForm.jsx
│ │ │ │ └── PledgeCard.jsx
│ │ │ ├── collections/
│ │ │ │ ├── CollectionList.jsx
│ │ │ │ ├── CollectionForm.jsx
│ │ │ │ └── Receipt.jsx
│ │ │ └── reports/
│ │ │ ├── ReportFilters.jsx
│ │ │ ├── ReportTable.jsx
│ │ │ └── ExportButtons.jsx
│ │ ├── pages/
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Members.jsx
│ │ │ ├── Campaigns.jsx
│ │ │ ├── Pledges.jsx
│ │ │ ├── Collections.jsx
│ │ │ ├── Reports.jsx
│ │ │ ├── Notifications.jsx
│ │ │ └── Settings.jsx
│ │ ├── context/
│ │ │ ├── AuthContext.jsx
│ │ │ └── ThemeContext.jsx
│ │ ├── hooks/
│ │ │ ├── useAuth.js
│ │ │ ├── useFetch.js
│ │ │ └── useForm.js
│ │ ├── services/
│ │ │ ├── api.js
│ │ │ ├── authService.js
│ │ │ ├── memberService.js
│ │ │ ├── pledgeService.js
│ │ │ ├── collectionService.js
│ │ │ └── reportService.js
│ │ ├── utils/
│ │ │ ├── formatters.js
│ │ │ ├── validators.js
│ │ │ └── constants.js
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── .env.example
│ ├── .gitignore
│ ├── package.json
│ ├── tailwind.config.js
│ ├── vite.config.js
│ └── README.md
│
├── docs/ # Documentation
│ ├── API.md # API documentation
│ ├── DATABASE.md # Database schema
│ ├── DEPLOYMENT.md # Deployment guide
│ └── USER_GUIDE.md # User manual
│
├── .gitignore
├── docker-compose.yml # Docker setup
├── Dockerfile # Docker image
├── LICENSE
└── README.md # This file


---

##  Installation

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** v6 or higher (local or Atlas)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/Becky-234/church-pledge-system.git
cd church-pledge-system