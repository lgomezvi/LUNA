# Next.js Authentication Project

A modern web application demonstrating user authentication with Google Sign-In, MongoDB database integration, and a clean architecture using Next.js 14.

## Project Overview

This project shows how to:
- Let users sign in with their Google account
- Store user information in a MongoDB database
- Create protected routes (pages only logged-in users can see)
- Use modern web development tools and practices

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
│   └── auth-handler.tsx  # Handles user data storage
├── lib/                  # Utility functions and configurations
│   ├── auth.ts          # Authentication setup
│   └── mongodb.ts       # Database connection
└── models/              # Database models
    └── user.ts          # User data structure
```

## Key Features

1. **Authentication (auth.ts)**
   - Uses NextAuth.js for Google Sign-In
   - Manages user sessions
   - Protects routes from unauthorized access

2. **Database Integration (mongodb.ts)**
   - Connects to MongoDB
   - Stores user information
   - Updates user data when they log in

3. **Protected Dashboard (dashboard/page.tsx)**
   - Only accessible to logged-in users
   - Displays user profile information
   - Includes sign-out functionality

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
   - Replace `<password>` with your database password

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
- `auth-handler.tsx`: Manages user data synchronization
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
