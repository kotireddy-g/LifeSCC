# LifeSCC - Patient Experience Platform

> **Full-stack web and mobile application for Life Slimming & Cosmetic Clinic** - A chain of non-surgical cosmetic clinics with 10+ branches across Telangana and Andhra Pradesh, India.

---

## 📋 Project Overview

**LifeSCC** is a comprehensive patient management and booking platform that includes:

- 🌐 **Web Application** (React + Vite + TypeScript + Tailwind CSS)
- 📱 **Mobile Application** (React Native + Expo)
- ⚙️ **Backend API** (Node.js + Express + Prisma + PostgreSQL)

### Key Features

- **Patient Portal**: Browse services, book appointments, track history
- **Admin Dashboard**: Manage appointments, leads, patients, services, and branches
- **Real-time Availability**: Dynamic time slot checking
- **Multi-branch Support**: 10+ clinic locations
- **Lead Management**: Convert inquiries to appointments
- **Email Notifications**: Automated confirmations and updates
- **Analytics Dashboard**: Performance metrics and insights

---

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Email**: Nodemailer
- **File Upload**: Multer + Cloudinary

### Web Frontend
- **Framework**: React 18+ with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **UI Components**: Shadcn/UI
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

### Mobile App
- **Framework**: React Native with Expo SDK 50+
- **Navigation**: React Navigation v6
- **Styling**: NativeWind
- **HTTP Client**: Axios

---

## 📁 Project Structure

```
lifescc/
├── apps/
│   ├── web/                    # React + Vite web application
│   └── mobile/                 # React Native Expo app
├── packages/
│   └── server/                 # Express.js backend API
├── package.json                # Root workspace configuration
├── .env.example               # Environment variables template
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LifeSCC
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your values:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT secrets
# - Email credentials (Mailtrap for development)
# - Cloudinary credentials (optional for image uploads)
```

### 4. Set Up the Database

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with demo data
npm run db:seed
```

The seed script will create:
- **1 Super Admin**: `admin@lifescc.com` / `Admin@123`
- **2 Admin Users**: For branch management
- **5 Patient Users**: Including `ananya.reddy@gmail.com` / `Admin@123`
- **5 Branches**: Across Hyderabad, Vizag, and Vijayawada
- **15 Services**: Weight Loss, Skin Care, and Hair Care treatments
- **20+ Appointments**: With various statuses
- **18 Leads**: With different sources and statuses

### 5. Start the Development Servers

```bash
# Terminal 1: Start backend server
npm run dev:server
# Server runs on http://localhost:5000

# Terminal 2: Start web application
npm run dev:web
# Web app runs on http://localhost:5173

# Terminal 3: Start mobile app
npm run dev:mobile
# Follow Expo CLI instructions to open on device/emulator
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new patient | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh-token` | Refresh access token | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user profile | Yes |
| PUT | `/auth/me` | Update profile | Yes |
| PUT | `/auth/change-password` | Change password | Yes |
| POST | `/auth/forgot-password` | Send reset email | No |
| POST | `/auth/reset-password` | Reset password | No |

### Service Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/services` | List all services (with filters) | No |
| GET | `/services/categories` | List all categories | No |
| GET | `/services/:slug` | Get service by slug | No |
| POST | `/services` | Create service | Admin |
| PUT | `/services/:id` | Update service | Admin |
| DELETE | `/services/:id` | Delete service | Admin |

### Branch Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/branches` | List all branches | No |
| GET | `/branches/:id` | Get branch details | No |
| GET | `/branches/:id/services` | Get available services | No |
| GET | `/branches/:id/slots` | Get available time slots | No |
| POST | `/branches` | Create branch | Admin |
| PUT | `/branches/:id` | Update branch | Admin |

### Appointment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/appointments` | List all appointments | Admin |
| GET | `/appointments/my` | Get my appointments | Patient |
| GET | `/appointments/:id` | Get appointment details | Optional |
| POST | `/appointments` | Book appointment | Optional |
| PUT | `/appointments/:id/status` | Update status | Admin |
| PUT | `/appointments/:id/reschedule` | Reschedule appointment | Optional |
| PUT | `/appointments/:id/cancel` | Cancel appointment | Optional |

### Lead Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/leads` | List all leads | Admin |
| POST | `/leads` | Create lead | Optional |
| PUT | `/leads/:id` | Update lead | Admin |
| PUT | `/leads/:id/convert` | Convert to appointment | Admin |
| DELETE | `/leads/:id` | Delete lead | Admin |
| POST | `/leads/contact` | Submit contact form | No |

### Dashboard Endpoints (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Key metrics |
| GET | `/dashboard/appointments/chart` | Appointment trends |
| GET | `/dashboard/services/popular` | Top services |
| GET | `/dashboard/branches/performance` | Branch-wise stats |
| GET | `/dashboard/recent-activity` | Recent activity |

---

## 🔐 Authentication Flow

1. User logs in with email/password
2. Server returns `accessToken` (15 min) and `refreshToken` (7 days)
3. Client stores tokens and attaches accessToken to requests
4. On 401 error, client uses refreshToken to get new accessToken
5. On refresh failure, redirect to login

---

## 🗄️ Database Schema

### Main Models

- **User**: Patients, Admins, and Super Admins
- **Branch**: Clinic locations with operating hours
- **ServiceCategory**: Weight Loss, Skin Care, Hair Care
- **Service**: Individual treatments with pricing
- **BranchService**: Many-to-many relationship
- **Appointment**: Bookings with status tracking
- **Lead**: Inquiries and callback requests
- **ContactMessage**: General contact form submissions

---

## 🎨 Design System (Web App)

### Colors

```css
Primary: #8B5CF6 (Violet)
Secondary: #EC4899 (Pink)
Accent: #06B6D4 (Cyan)
Success: #10B981
Warning: #F59E0B
Error: #EF4444
```

### Typography

- **Headings**: Inter / Poppins (600-700)
- **Body**: Inter (400-500)

---

## 👥 User Roles

### Patient
- Browse services
- Book appointments
- View appointment history
- Update profile

### Admin
- View all appointments
- Manage leads
- Update appointment status
- View analytics

### Super Admin
- All admin permissions
- Manage services and branches
- User management

---

## 📱 Mobile App Setup

The mobile app is built with Expo for easy development and testing.

```bash
# Start Expo development server
cd apps/mobile
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Open in Expo Go app
# Scan the QR code with your phone
```

---

## 🚢 Deployment

### Backend (Railway / Render)

1. Create PostgreSQL database
2. Set environment variables
3. Deploy from Git repository
4. Run migrations: `npm run db:migrate`
5. Seed data: `npm run db:seed`

### Web Frontend (Vercel)

1. Connect Git repository
2. Set build command: `npm run build --workspace=apps/web`
3. Set output directory: `apps/web/dist`
4. Set environment variable: `VITE_API_URL`

### Mobile App (EAS Build)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
cd apps/mobile
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

---

## 🧪 Testing

### API Health Check

```bash
curl http://localhost:5000/health
```

### Login Test

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lifescc.com","password":"Admin@123"}'
```

---

## 📝 Scripts Reference

```bash
# Development
npm run dev:server          # Start backend server
npm run dev:web            # Start web app
npm run dev:mobile         # Start mobile app

# Database
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Run migrations
npm run db:seed            # Seed demo data
npm run db:studio          # Open Prisma Studio

# Build
npm run build:server       # Build backend
npm run build:web          # Build web app
```

---

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify network/firewall settings

### Port Already in Use

```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port in .env
PORT=5001
```

### Prisma Client Errors

```bash
# Regenerate Prisma client
npm run db:generate
```

---

## 📄 License

This project is proprietary software for Life Slimming & Cosmetic Clinic.

---

## 👨‍💻 Development Team

For questions or support, contact the development team.

---

## 🎯 Project Timeline

- **Day 1-2**: Backend API + Database ✅
- **Day 2-3**: Web Application (In Progress)
- **Day 3**: Mobile Application
- **Day 3**: Testing & Deployment

---

**Built with ❤️ for LifeSCC**
