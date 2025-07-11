# 🌐 WebPro – Cloud-Based SaaS Website Builder Tool

**WebPro** is a modern, cloud-based B2B SaaS platform designed to help digital agencies build and manage websites quickly and efficiently. With a no-code drag-and-drop website builder, team collaboration tools, role-based access, and integrated Stripe payments, WebPro simplifies the entire workflow from project creation to launch.

---

## 🚀 Features

- ⚙️ **Drag-and-Drop Website Builder**
- 🧠 **Role-Based Access Control** (Agency Owner, Web Designer)
- 💳 **Stripe Integration** for billing & subscriptions
- 📊 **Real-Time Analytics & Charts** with Tremor
- 📁 **Media Management System**
- 📋 **To-Do Board / Pipelines** for project tracking
- 🌐 **Live Page Preview with Custom Domains**
- 🔐 **Clerk Authentication**
- 🎨 Built with **ShadCN UI + Tailwind CSS**

---

## 🛠 Tech Stack

| Category        | Technology             |
|----------------|------------------------|
| Frontend       | Next.js 15, TypeScript |
| Styling        | Tailwind CSS, ShadCN UI |
| Backend        | Prisma ORM, API Routes |
| Database       | Neon (PostgreSQL)      |
| Auth           | Clerk                  |
| Payments       | Stripe (Billing, Checkout, Webhooks) |
| Charts         | Tremor Library         |
| Deployment     | Vercel                 |

---

## 📁 Dashboards Overview

### 1. 🔓 Landing Page
- Public-facing marketing site with features, pricing, testimonials, and documentation
- Users can sign up or log in

### 2. 🧑‍💼 Agency Dashboard
- Analytics dashboard for agency performance
- Connect Stripe account and manage billing
- Invite team members with specific roles
- Create and manage sub-accounts (clients)

### 3. 🎨 Sub-Account Dashboard
- Project-level access for web designers or team members
- Drag-and-drop website creation using the Funnels module
- Media upload, contact management, and task board

---

## 📦 Getting Started

### 🔧 Prerequisites

- Node.js >= 18  
- A PostgreSQL database (Neon recommended)  
- Stripe account  
- Clerk account  

### 🧰 Clone and Install

```bash
git clone https://github.com/ajay-thakare/WebProjexus.git
cd WebProjexus

# Install dependencies
npm install
# or
yarn
# or
pnpm install
# or
bun install

🌐 Environment Variables
Create a .env file in the root and configure the following variables:

DATABASE_URL=your_neon_db_url
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

Then run:

npx prisma generate
npx prisma db push
```



### Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

### 👨‍💻 Author
Ajay Thakare
Computer Science Student & Full-Stack Developer
🔗 LinkedIn
📧 thakareajay6@gmail.com



