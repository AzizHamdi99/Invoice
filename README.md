# Invoice Manager
A full-stack invoice management application built with Next.js, featuring user authentication, CRUD operations, and PDF generation capabilities.
## Features

🔐 User Authentication - Secure login/signup with Clerk
📄 Invoice Management - Create, read, update, and delete invoices
📊 Invoice Tracking - View all your invoices in one place
🖨️ PDF Generation - Print/export invoices as PDF documents
📱 Responsive Design - Works on desktop and mobile devices
🎨 Modern UI - Built with Tailwind CSS and shadcn/ui components
🔥 Real-time Notifications - Toast notifications for user feedback

## Tech Stack

Frontend: Next.js 14, React 18, TypeScript
Styling: Tailwind CSS, shadcn/ui
Database: MongoDB with Mongoose ODM
Authentication: Clerk
Notifications: React Hot Toast
PDF Generation: (Add your preferred library - jsPDF, Puppeteer, etc.)

## Prerequisites
Before running this project, make sure you have:

Node.js 18+ installed
MongoDB database (local or cloud)
Clerk account for authentication
npm or yarn package manager

## Environment Variables
Create a .env.local file in the root directory and add the following variables:
env# Clerk Authentication
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

# Database
```bash

MONGODB_URI=your_mongodb_connection_string
```

# Next.js
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```
Installation

### Clone the repository
```bash
git clone https://github.com/AzizHamdi99/Invoice.git
cd Invoice
```

Install dependencies
```bash
npm install
```
# or
```bash
yarn install
```

Set up environment variables

Copy .env.example to .env.local
Fill in your environment variables


Run the development server
```bash
npm run dev
# or
yarn dev
```

Open your browser
Navigate to http://localhost:3000


### API Endpoints
Invoices

GET /api/invoices - Get all user invoices
POST /api/invoices - Create new invoice
GET /api/invoices/[id] - Get specific invoice
PUT /api/invoices/[id] - Update invoice
DELETE /api/invoices/[id] - Delete invoice
GET /api/invoices/[id]/pdf - Generate PDF for invoice


### Key Features Implementation
#### Authentication with Clerk

Automatic user management
Protected routes
User session handling

### Invoice CRUD Operations

Create invoices with multiple line items
View all invoices in a data table
Edit existing invoices
Delete invoices with confirmation
Search and filter capabilities

### PDF Generation

Professional invoice templates
Download and print functionality
Email integration (optional)

### Responsive Design

Mobile-first approach
Tailwind CSS utilities
shadcn/ui components

Scripts
```bash
 Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Database setup
npm run db:setup
```
### Contributing

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

### Deployment
Vercel (Recommended)

Push your code to GitHub
Import your repository on Vercel
Add environment variables
Deploy

Other Platforms
The app can be deployed on any platform that supports Next.js:

Netlify
Railway
DigitalOcean App Platform
AWS Amplify

### License
This project is licensed under the MIT License - see the LICENSE file for details.
Support
If you encounter any issues or have questions:

Check the Issues page
Create a new issue if your problem isn't already reported
Provide detailed information about your environment and the issue

### Acknowledgments

Next.js - React framework
Clerk - Authentication
Tailwind CSS - Styling
shadcn/ui - UI components
Mongoose - MongoDB ODM
React Hot Toast - Notifications


Made with ❤️ by Aziz Hamdi
LinkedIn:https://www.linkedin.com/in/aziz-hamdi-837175286/