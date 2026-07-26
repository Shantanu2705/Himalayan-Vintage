# Himalayan Fleet Management — Enterprise Web Application & Quotation Portal

An enterprise-grade, production-ready web application built with **Next.js 16 (Turbopack)**, **TypeScript**, **Tailwind CSS**, and **Firebase Admin & Client SDKs**. Specially tailored for luxury travel operators and fleet management companies, featuring automated quotation generation, booking dispatch, invoicing, real-time image uploads, and A4 PDF printing.

---

## 🌟 Enterprise Highlights & Core Features

- 🔐 **Role-Based Access Control (RBAC)**: Secure multi-tier authentication supporting Administrator, Branch Manager, and Booking Operator roles with protected administrative user creation.
- 📋 **Dynamic 1-Click Quotation & Itinerary Engine**: Auto-compute tourist package pricing, day-wise itineraries, vehicle allocations, tolls, parking, and GST taxes.
- 🖨️ **React Portal Flawless A4 PDF Printing & Export**: Built-in PDF preview modal leveraging dedicated React Portals (`#global-print-area`) to bypass modal transforms and overflow clipping—guaranteeing 100% full-width A4 printouts from coordinate `(0,0)` without blank pages.
- 🖼️ **Non-Destructive Live Image Uploads**: Upload Company Logos, UPI Payment QR Codes, and Authorized Signatures directly via Data URLs without overwriting existing system configuration or custom fields.
- 🏢 **Persistent Enterprise Branding**: Real-time custom branding in the sticky header, sidebar profile, and formal PDF documents.
- 🗄️ **Zero-Config Firebase Live & Admin Seeding**: Live Firestore integration with automated seeding endpoint (`/api/seed`) to populate 50+ real-world vehicles, drivers, corporate clients, and routes.

---

## 🔑 Default Administrator Credentials

Upon starting the application or deploying to Vercel, you can log in instantly using:

- **Admin Login ID / Email**: `admin@gmail.com`
- **Admin Password**: `admin123`

*(Note: You can also use the instant 1-click **Admin Role** demo button on the login screen).*

---

## 🚀 Zero-Config Deployment on Vercel

This repository is **100% ready for Vercel deployment** with zero mandatory environment variable configuration required out of the box! Live Firebase credentials are embedded as fallbacks in `lib/firebase/config.ts`.

### 1-Click Vercel Host Guide:
1. Push or fork this repository to your GitHub account: `https://github.com/Shantanu2705/Quotation-Software-3`.
2. Log in to [Vercel](https://vercel.com) with your GitHub account and click **Add New Project**.
3. Import `Quotation-Software-3` from your GitHub list.
4. Leave all build settings at default (`Next.js`, Build Command: `next build`).
5. Click **Deploy**. In under 60 seconds, your live production portal will be deployed and running identically to localhost!

*(Optional: If you wish to use a different Firebase project, copy `.env.example` to Vercel's Environment Variables settings).*

---

## 💻 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Shantanu2705/Quotation-Software-3.git
cd "Quotation Software 3"
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Verify Production Output
```bash
npm run build
npm start
```

---

## 📂 Project Architecture

```text
├── app/                  # Next.js 16 App Router (Auth, Dashboard Routes, API Seeding)
├── components/
│   ├── layout/           # Sticky Header, Responsive Sidebar, RBAC Badges
│   ├── shared/           # React Portal PDF Preview Modal, Custom Form Components
│   └── ui/               # Radix UI + Tailwind Component Library
├── lib/
│   ├── firebase/         # Client Config, Live Firestore Rules, Admin SDK Seed Data
│   ├── store/            # Zustand State Management (Auth, Fleet, Settings, Notifications)
│   └── validations/      # Zod Schemas for Quotations, Invoices, Drivers, and Vehicles
└── utils/                # Date, Currency, and Tax Formatting Helpers
```

---

## 📜 License & Copyright
© 2026 Himalayan Vintage Holidays & Himalayan Fleet Management. All rights reserved.
