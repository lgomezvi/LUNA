# Luna - Personal Cycle Tracking App

A modern, secure menstrual cycle tracking application built with Next.js 14, featuring Google authentication, personalized cycle predictions, and health recommendations.

## Project Overview

Luna helps users:
- Track their menstrual cycle securely and privately
- Get personalized health recommendations based on cycle phase
- Monitor cycle regularity and patterns
- Receive nutrition and exercise guidance aligned with their cycle
- Manage health information with a user-friendly interface

## Key Features

1. **Secure Authentication**
   - Google Sign-In integration
   - Protected user data
   - Personalized dashboard access

2. **Cycle Tracking**
   - Cycle phase prediction
   - Period tracking
   - Cycle length monitoring
   - Irregularity tracking

3. **Health Recommendations**
   - Phase-specific nutrition advice
   - Customized exercise suggestions
   - Personalized wellness tips
   - Allergy awareness integration

4. **User Experience**
   - Clean, intuitive interface
   - Mobile-responsive design
   - Personalized dashboard
   - Easy data input


## Project Structure

```
src/
├── app/                    # Main application pages and API routes
│   ├── api/               # Backend API endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   └── user/         # User management endpoints
│   ├── dashboard/        # Protected dashboard page
│   └── page.tsx          # Homepage
├── components/            # Reusable React components
│   ├── auth-buttons.tsx  # Login/Logout buttons
│   ├── cycle-status.tsx  # Cycle tracking display
│   └── user-details-form.tsx  # Profile setup
├── lib/                  # Utility functions and configurations
│   ├── auth.ts          # Authentication setup
│   └── mongodb.ts       # Database connection
│   └── cycle-helpers.ts # Cycle calculations
└── models/              # Database models
    └── user.ts          # User data structure
```

## Technical Implementation

### Frontend Technologies
- Next.js 14
- React 18
- Tailwind CSS
- shadcn/ui components
- TypeScript

### Backend Services
- MongoDB (user data storage)
- NextAuth.js (authentication)
- Google OAuth2

### Key Components
- `CycleStatusCard`: Displays current cycle phase and recommendations
- `UserDetailsForm`: Collects user cycle information
- `DashboardContent`: Main user interface

## How It Works

1. **User Authentication Flow:**
   - User clicks "Sign in with Google"
   - Google authentication window appears
   - After successful login, user info is saved to MongoDB
   - User is redirected to dashboard

2. **Data Storage:**
   - User email, name, and profile picture are stored
   - Information is updated each time user logs in
   - Unique Google ID is used to identify users

3. **Protected Routes:**
   - Dashboard page checks if user is logged in
   - Unauthorized users are redirected to homepage
   - Logged-in users can view their profile

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with:
   ```
   AUTH_SECRET="your-auth-secret"
   GOOGLE_ID="your-google-client-id"
   GOOGLE_SECRET="your-google-client-secret"
   MONGODB_URI="your-mongodb-connection-string"
   ```

3. Get Google OAuth credentials:
   - Go to Google Cloud Console
   - Create a new project
   - Enable Google+ API
   - Create OAuth credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

4. Set up MongoDB:
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Update MONGODB_URI in `.env.local`

5. Run the development server:
   ```bash
   npm run dev
   ```

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Project Components Overview

### Frontend Components
- `auth-buttons.tsx`: Login/Logout button components
- `dashboard/page.tsx`: Protected user dashboard

### Backend Components
- `api/auth/[...nextauth]/route.ts`: Authentication endpoints
- `api/user/route.ts`: User data management
- `models/user.ts`: MongoDB user schema

### Configuration Files
- `lib/auth.ts`: Authentication setup
- `lib/mongodb.ts`: Database connection
- `middleware.ts`: Route protection

## Want to Learn More?

Each folder in the project has a specific purpose:
- `app/`: Contains all pages and API routes
- `components/`: Reusable UI components
- `lib/`: Helper functions and configurations
- `models/`: Database schemas
