# Donation Platform

A comprehensive MERN stack donation management platform for non-profit organizations, built with TypeScript and featuring automated tax receipt generation, case report management, and multi-role user system.

## Features

### Core Functionality
- **Multi-role User System**: Donors, Hospital Admins, and Super Admins
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Payment Processing**: Integrated Stripe and PayPal payment gateways
- **Case Report Management**: Photo upload and approval workflow system
- **Automated Tax Receipts**: CRA-compliant PDF generation and email delivery
- **Comprehensive Logging**: Winston-based logging for all operations

### User Roles

#### Donors
- Create accounts and make secure donations
- Track donation history and view personal dashboard
- Receive automated tax receipts via email
- View sponsored case reports with photo updates

#### Hospital Administrators
- Upload case reports with photos to secure "deposit tank"
- Track submission status (pending, approved, rejected, assigned)
- Manage their own case report submissions

#### Super Administrators
- Review and approve/reject case reports from deposit tank
- Manage all users and their roles
- Access comprehensive analytics and system health metrics
- Generate manual receipts and trigger annual receipt generation

## Technology Stack

### Backend
- **Node.js** with **Express.js** and **TypeScript**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **Stripe & PayPal** for payment processing
- **Multer** for file uploads
- **PDFKit** for receipt generation
- **Nodemailer** for email automation
- **Winston** for comprehensive logging
- **Node-cron** for scheduled tasks

### Frontend
- **React** with **TypeScript**
- **Next.js** for routing and SSR
- **TailwindCSS** for styling
- **React Hook Form** with **Yup** validation
- **Stripe Elements** for payment forms
- **Axios** for API communication
- **React Hot Toast** for notifications

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Stripe account for
