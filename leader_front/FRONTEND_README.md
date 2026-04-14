# Leaderboard Frontend

A modern, responsive React frontend for a group and user leaderboard system with admin management tools.

## Features

- **Public Leaderboard**: Display user and group leaderboards with real-time scoring
- **Auto-polling**: Leaderboard refreshes automatically every 60 seconds when the page is open
- **Password-Protected Admin Panel**: Hidden admin routes that require authentication
- **Responsive Design**: Built with Mantine UI for a polished user experience
- **Admin Tools**:
  - Manage groups (create, view)
  - Manage users (create, assign to groups)
  - Configure product multipliers (weights) for scoring

## Tech Stack

- **React 19** with TypeScript
- **React Router** for navigation
- **Mantine UI** for components
- **Axios** for API calls
- **Vite** for build tooling

## Setup

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` with your configuration:
```env
VITE_API_URL=http://localhost:3000/api
VITE_ADMIN_PASSWORD=your_secure_password_here
VITE_LEADERBOARD_POLL_INTERVAL=60000
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_ADMIN_PASSWORD` | Admin panel password | `admin123` |
| `VITE_LEADERBOARD_POLL_INTERVAL` | Poll interval in milliseconds | `60000` (1 minute) |

## Running the Application

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173` (or the next available port)

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/
│   └── client.ts          # Axios client and API endpoints
├── components/
│   ├── GroupsManager.tsx  # Group management UI
│   ├── UsersManager.tsx   # User management UI
│   ├── ProductsManager.tsx # Product multiplier management
│   └── ProtectedRoute.tsx  # Authentication guard component
├── context/
│   └── AuthContext.tsx    # Authentication state management
├── pages/
│   ├── Leaderboard.tsx    # Public leaderboard page
│   ├── AdminLogin.tsx     # Admin login page
│   └── AdminDashboard.tsx # Admin management dashboard
├── types/
│   └── api.ts            # TypeScript types for API responses
├── App.tsx               # Main app with routing
└── main.tsx              # React entry point
```

## Pages

### Public Routes

- **`/`** - Main leaderboard page (users and groups tabs)
  - Shows real-time leaderboard data
  - Auto-refreshes every 60 seconds
  - Date range selector (last 1/7/30/365 days)
  - Manual refresh button

- **`/admin-login`** - Admin authentication page
  - Password-protected access to admin panel
  - Sessions stored in browser sessionStorage

### Protected Routes

- **`/admin`** - Admin dashboard (requires password)
  - **Manage Groups**: Create new groups, view all groups
  - **Manage Users**: Create users, assign users to groups
  - **Manage Products**: Edit product multipliers (scoring weights)
  - Logout button

## Usage Guide

### For End Users

1. Navigate to the application home page
2. View the leaderboard in either User or Group tabs
3. Select a date range to see scores from different periods
4. Click "Refresh" for immediate updates
5. Leaderboard automatically refreshes every minute

### For Administrators

1. Click the "Admin" button in the top-right corner
2. Enter the admin password (from `.env`)
3. In the admin dashboard, manage:
   - **Groups**: Create new groups for organizing users
   - **Users**: Create users and assign them to groups
   - **Products**: Set multipliers to weight products' impact on scores

#### Understanding Multipliers

Products have a multiplier value (0-127) that affects leaderboard scoring:
- **Multiplier = 1** (default): 1 unit = 1 point
- **Multiplier = 2**: 1 unit = 2 points (doubled)
- **Multiplier = 0.5**: 1 unit = 0.5 points (halved)

Example: If a user orders 2 Bier (multiplier 2) and 3 Pepsi (multiplier 1):
- Score = (2 × 2) + (3 × 1) = 4 + 3 = 7 points

## API Integration

The frontend communicates with a backend API for:
- Leaderboard data (users and groups)
- Product management
- User management
- Group management

All API endpoints are defined in [src/api/client.ts](src/api/client.ts).

## Authentication

- Admin panel uses session-based authentication
- Password stored in environment variables (NOT in code)
- Authentication state persists during the browser session
- Session storage is cleared when logging out

## Polling Behavior

The leaderboard page:
- Fetches data immediately on page load
- Sets up an interval to refresh every 60 seconds
- Cleans up the interval when the component unmounts
- Can be manually refreshed with the "Refresh" button
- Interval respects the selected date range

## TypeScript Types

All API responses are fully typed. Key types:

```typescript
interface UserLeaderboardEntry {
  rank: number;
  lid_naam: string;
  score: number;
  product_variety: number;
  total_items: number;
}

interface GroupLeaderboardEntry {
  rank: number;
  group_id: number | null;
  group_name: string;
  score: number;
  product_variety: number;
  total_items: number;
  member_count: number;
}
```

See [src/types/api.ts](src/types/api.ts) for all type definitions.

## Styling & Components

- Built with **Mantine UI** components
- Responsive design using Mantine's Grid and Container
- Dark mode support via Mantine's theme provider
- Responsive tables with horizontal scroll on mobile
- Clean, accessible form controls

## Troubleshooting

### "Failed to fetch" errors
- Ensure the backend API is running at the URL in `VITE_API_URL`
- Check CORS settings on your backend

### Admin password not working
- Verify the password in your `.env` file matches what you're entering
- Clear browser sessionStorage and try again
- Ensure you've restarted the dev server after changing `.env`

### Leaderboard not updating
- Ensure the polling interval is set in `VITE_LEADERBOARD_POLL_INTERVAL`
- Check browser console for API errors
- Try manual refresh button

## Development Notes

- The application uses Vite for fast development and optimized builds
- Mantine components are fully typed for TypeScript
- All API calls use axios with a configured client
- React Router provides client-side routing

## License

Use as needed for your leaderboard project.
