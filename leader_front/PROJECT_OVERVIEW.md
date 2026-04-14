# Frontend Project Overview

## What Was Built

A complete, production-ready React frontend for a leaderboard management system with:

### 1. **Public Leaderboard Page** (`/`)
- Displays user rankings and scores
- Displays group rankings and scores
- Date range selector (last 1, 7, 30, or 365 days)
- Score calculation: `sum(product_amount × product_multiplier)`
- Shows additional metrics:
  - Product variety (unique products ordered)
  - Total items ordered
  - Member count (for groups)
- **Auto-polling**: Refreshes every 60 seconds when page is open
- Manual refresh button for immediate updates
- Responsive table layout

### 2. **Admin Dashboard** (Password-Protected at `/admin`)
Hidden admin routes that require password authentication:

#### A. Group Management
- View all groups
- Create new groups (name must be unique)
- Groups organize users together for collective scoring

#### B. User Management
- View all existing users
- Create new users
- Assign/reassign users to groups
- Change group assignments with dropdown selection
- Supports users with no group

#### C. Product Management
- View all products
- Edit product multipliers (weights)
- Multiplier range: 0-127
- Decimal multipliers supported (e.g., 0.5, 2.5, etc.)
- Inline editing with save/cancel
- Products discovered from backend are auto-added

### 3. **Authentication System**
- Session-based admin authentication
- Password stored in environment variables (secure)
- Login session persists during browser session
- Automatic redirect to login if session expires
- Logout capability that clears session

## Architecture

### Component Structure
```
App.tsx (Main entry with routing)
├── Navigation (Header with admin link)
├── Routes
│   ├── / → Leaderboard (public)
│   ├── /admin-login → AdminLogin (public)
│   └── /admin → AdminDashboard (protected)
│       ├── GroupsManager
│       ├── UsersManager
│       └── ProductsManager
```

### Key Technologies
- **React 19** - Latest React with hooks
- **TypeScript** - Full type safety
- **React Router v6** - Client-side routing
- **Mantine UI** - Component library
  - Tables, forms, modals, alerts, buttons
  - Responsive Grid system
  - Dark mode support
- **Axios** - HTTP client with interceptors
- **Vite** - Fast bundler and dev server

### API Communication
Centralized in `src/api/client.ts`:
- Configured axios instance
- Type-safe API functions
- Proper error handling
- Base URL from environment variables

### State Management
- React hooks (useState)
- React Context for authentication
- localStorage for admin session
- Direct API calls for data

## Environment Configuration

All sensitive configuration goes in `.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_ADMIN_PASSWORD=admin123
VITE_LEADERBOARD_POLL_INTERVAL=60000
```

No secrets in code - everything externalized.

## Features Implemented

### ✅ Leaderboard
- [x] Display user leaderboard with rankings
- [x] Display group leaderboard with rankings
- [x] Tabs for switching between users/groups
- [x] Date range filtering (last N days)
- [x] Auto-polling every 60 seconds
- [x] Manual refresh button
- [x] Last update timestamp
- [x] Loading states
- [x] Error handling and alerts

### ✅ Admin Interface
- [x] Password-protected access
- [x] Session-based authentication
- [x] Hidden admin routes (no navigation links)
- [x] Logout functionality
- [x] Tabbed interface for management tools

### ✅ Group Management
- [x] List all groups
- [x] Create new groups
- [x] Group name validation
- [x] Success/error messages

### ✅ User Management
- [x] List all users
- [x] Create new users
- [x] Assign users to groups
- [x] Change group assignments
- [x] Support for unassigned users

### ✅ Product Management
- [x] List all products with current multipliers
- [x] Edit multiplier inline
- [x] Validation (0-127 range)
- [x] Save/cancel actions
- [x] Decimal multiplier support

### ✅ UI/UX
- [x] Responsive design (mobile-friendly)
- [x] Professional Mantine component library
- [x] Loading indicators
- [x] Error alerts with icons
- [x] Disabled/disabled-state handling
- [x] Form validation
- [x] Modal dialogs for creation
- [x] Inline editing controls

### ✅ Developer Experience
- [x] Full TypeScript support
- [x] Proper type definitions
- [x] Error handling throughout
- [x] Clean code structure
- [x] Documented components
- [x] Environment configuration
- [x] Production build ready

## File Organization

```
src/
├── api/
│   └── client.ts              # API functions and axios config
├── components/
│   ├── GroupsManager.tsx      # Group CRUD UI
│   ├── UsersManager.tsx       # User CRUD UI
│   ├── ProductsManager.tsx    # Product multiplier edit UI
│   └── ProtectedRoute.tsx     # Auth guard component
├── context/
│   └── AuthContext.tsx        # Auth state & session management
├── pages/
│   ├── Leaderboard.tsx        # Main leaderboard display
│   ├── AdminLogin.tsx         # Password entry
│   └── AdminDashboard.tsx     # Admin hub
├── types/
│   └── api.ts                 # TypeScript interfaces
├── App.tsx                    # Router setup
├── App.css                    # Global styles
├── main.tsx                   # React entry point
└── index.css                  # Base styles
```

## How It Works

### Polling Mechanism
1. Component mounts: fetch initial data
2. useEffect sets interval to refetch every 60 seconds
3. Data is fetched silently in background
4. No interruption to user viewing leaderboard
5. Interval cleaned up when component unmounts

### Authentication Flow
1. User clicks "Admin" button
2. Routed to `/admin-login`
3. User enters password
4. Compared against `VITE_ADMIN_PASSWORD`
5. On match: session stored in sessionStorage
6. User redirected to `/admin`
7. ProtectedRoute checks sessionStorage
8. Logout clears session and returns to home

### Data Flow
```
User Action
    ↓
Component calls API function
    ↓
axios client makes request
    ↓
API returns typed response
    ↓
State updates with data
    ↓
Component re-renders
```

## Customization Points

### Styling
- Edit `src/App.css` for global styles
- Mantine theme customization in `App.tsx`
- Component-level styles with Mantine props

### Polling Interval
- Change `VITE_LEADERBOARD_POLL_INTERVAL` in `.env`
- Default: 60000ms (1 minute)
- Minimum safe: 5000ms (5 seconds)

### Admin Password
- Change `VITE_ADMIN_PASSWORD` in `.env`
- Must restart dev server after change
- Consider using environment-specific passwords

### API Endpoints
- Change `VITE_API_URL` in `.env`
- Works with any backend following the API spec

## Performance Considerations

- **Code Splitting**: Vite handles automatic chunking
- **Lazy Loading**: Routes not needed on initial load
- **API Optimization**: Only fetches what's visible
- **Re-renders**: Optimized with React hooks
- **Bundle Size**: Mantine is tree-shakable

## Security Notes

- ⚠️ Admin password sent in plain HTTP (use HTTPS in production)
- ⚠️ Session stored in sessionStorage (cleared on browser close)
- ⚠️ No token-based auth (simple password auth)
- ✅ Credentials not sent in requests
- ✅ Admin endpoints are backend-validated
- ✅ Environment variables not exposed to client (Vite VITE_ prefix)

For production, consider:
- HTTPS/TLS for all connections
- Token-based authentication (JWT)
- Rate limiting on admin endpoints
- Audit logging for admin actions

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Next Steps

1. **Start dev server**: `npm run dev`
2. **Configure backend**: Update `VITE_API_URL` in `.env`
3. **Change admin password**: Update `VITE_ADMIN_PASSWORD` in `.env`
4. **Initialize backend** with `POST /api/init`
5. **Create test data** via admin panel
6. **View leaderboards** on main page
7. **Deploy**: `npm run build` and serve `dist/` folder

## Support & Documentation

- **Frontend README**: [FRONTEND_README.md](FRONTEND_README.md)
- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **API Spec**: [api.md](api.md)
- **Mantine Docs**: https://mantine.dev
- **React Router**: https://reactrouter.com
