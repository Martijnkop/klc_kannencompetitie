# Visual Guide & Screenshots Description

## Application Layout

### Home Page (Public Leaderboard)
```
┌─────────────────────────────────────────────────┐
│  🏆 Leaderboard                           [Admin]│
├─────────────────────────────────────────────────┤
│                                                 │
│  [Select: Last 7 days ▼]              [Refresh]│
│  Last updated: 2:45 PM                         │
│                                                 │
│  ┌────────────────────────────────────────────┐│
│  │[Users] [Groups]                            ││
│  ├────────────────────────────────────────────┤│
│  │ Rank │ User         │ Score │ Variety │...││
│  │──────┼──────────────┼───────┼─────────┤...││
│  │  1   │ DiSC van der │  235  │    5    │...││
│  │  2   │ Another User │  187  │    3    │...││
│  │  3   │ User Three   │  142  │    4    │...││
│  └────────────────────────────────────────────┘│
│                                                 │
│  Table scrolls horizontally on mobile          │
└─────────────────────────────────────────────────┘
```

**Features on this page:**
- Date range selector (1, 7, 30, 365 days)
- Refresh button for immediate updates
- Last update timestamp
- Sortable data in tabs (Users/Groups)
- Auto-refreshes every 60 seconds when open
- Responsive tables

### Admin Login Page
```
┌─────────────────────────────────────────────────┐
│  🏆 Leaderboard                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│           ┌─────────────────────┐              │
│           │                     │              │
│           │    🔒               │              │
│           │  Admin Access       │              │
│           │                     │              │
│           │ Enter the admin     │              │
│           │ password to access  │              │
│           │ management tools    │              │
│           │                     │              │
│           │ [Password: *****]   │              │
│           │                     │              │
│           │  [Login Button]     │              │
│           │                     │              │
│           └─────────────────────┘              │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Features:**
- Password input field
- Submit button
- Error messages for wrong password
- Clean, centered modal design
- Session-based (cleared on logout)

### Admin Dashboard
```
┌─────────────────────────────────────────────────┐
│  ⚙️ Admin Dashboard                   [Logout] │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Manage Groups] [Manage Users] [Manage Produ] │
│  ├──────────────────────────────────────────┤  │
│  │ Groups                          [Add Group]  │
│  ├──────────────────────────────────────────┤  │
│  │ ID │ Name       │ Actions              │  │
│  ├────┼────────────┼──────────────────────┤  │
│  │ 1  │ Team A     │ [Delete - disabled]  │  │
│  │ 2  │ Team B     │ [Delete - disabled]  │  │
│  │ 3  │ Developers │ [Delete - disabled]  │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  [Modal for creating new group opens]          │
│  ┌──────────────────────────────┐              │
│  │ Create New Group             │              │
│  ├──────────────────────────────┤              │
│  │ Group Name: [________]       │              │
│  │            [Cancel] [Create] │              │
│  └──────────────────────────────┘              │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Three Tabs Available:**

1. **Manage Groups**
   - View all groups
   - Create new groups
   - Group names must be unique

2. **Manage Users**
   - View all users
   - Create new users
   - Assign/reassign to groups via dropdown
   - Change group membership easily

3. **Manage Products**
   - List all products
   - Inline edit multipliers
   - Click "Edit" → enter value → [Save] or [Cancel]
   - Multiplier range: 0-127 (decimals allowed)

## Data Flow Diagrams

### Leaderboard Update Flow
```
┌──────────────────────┐
│  Page Loads          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Fetch Initial Data  │
│  (Users + Groups)    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Display Table       │
│  Start 60s Timer     │
└──────────┬───────────┘
           │
      [Every 60s]
           │
           ▼
┌──────────────────────┐
│  Fetch New Data      │
│  (Silent Update)     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Re-render Table     │
│  Restart Timer       │
└──────────────────────┘
```

### Admin Authentication Flow
```
User Clicks "Admin"
       │
       ▼
Route to /admin-login
       │
       ▼
User enters password
       │
       ▼
Compare with VITE_ADMIN_PASSWORD
       │
    ┌──┴──┐
    │     │
   YES   NO
    │     │
    ▼     ▼
  Save  Show
 Session Error
    │     │
    ▼     │
Route to /admin
    │     │
    ▼     │
ProtectedRoute checks
sessionStorage
    │     │
    ▼     ▼
 Show   Redirect to
 Admin  /admin-login
```

## Component Hierarchy

```
App
├── Navigation (Header)
│   └── Admin Button (conditional)
│
├── Router
│   ├── Route: "/"
│   │   └── Leaderboard
│   │       ├── Loader (while fetching)
│   │       ├── Alert (errors)
│   │       ├── Controls (date range, refresh)
│   │       └── Tabs
│   │           ├── Panel: Users
│   │           │   └── Table
│   │           └── Panel: Groups
│   │               └── Table
│   │
│   ├── Route: "/admin-login"
│   │   └── AdminLogin
│   │       └── Form
│   │           └── PasswordInput
│   │
│   └── Route: "/admin" (Protected)
│       └── AdminDashboard
│           ├── Tabs
│           │   ├── Panel: Groups
│           │   │   └── GroupsManager
│           │   │       ├── Table
│           │   │       └── Modal (create)
│           │   │
│           │   ├── Panel: Users
│           │   │   └── UsersManager
│           │   │       ├── Table
│           │   │       └── Modal (create)
│           │   │
│           │   └── Panel: Products
│           │       └── ProductsManager
│           │           └── Table (inline edit)
│           │
│           └── Logout Button
```

## Typical User Journey

### End User (Viewing Leaderboard)

```
1. Open application
   ↓
2. See main leaderboard automatically
   ↓
3. View user rankings (scores, variety, items)
   ↓
4. Switch to Groups tab
   ↓
5. See group rankings (aggregate scores)
   ↓
6. Change date range to see historical data
   ↓
7. Scores update automatically every minute
   ↓
8. Can manually refresh anytime
```

### Administrator

```
1. Click "Admin" button
   ↓
2. Enter password at /admin-login
   ↓
3. Access to admin dashboard with 3 tabs
   ↓
4. CREATE GROUPS
   - Click "Add Group"
   - Enter group name
   - Click "Create"
   ↓
5. CREATE USERS
   - Click "Add User"
   - Enter username (lid_naam)
   - Select group (optional)
   - Click "Create"
   - Can reassign later via dropdown
   ↓
6. MANAGE PRODUCTS
   - View all products
   - Click "Edit" on any product
   - Enter new multiplier (0-127)
   - Click "Save" or "Cancel"
   ↓
7. Logout
   - Click logout button
   - Session cleared
   - Return to home
```

## API Integration Points

```
Frontend                Backend
    │                      │
    ├─GET /leaderboard/users
    │─────────────────────→│
    │                      │
    │←─────────────────────┤
    │ [User scores array]  │
    │                      │
    ├─GET /leaderboard/groups
    │─────────────────────→│
    │                      │
    │←─────────────────────┤
    │ [Group scores array] │
    │                      │
    ├─GET /groups
    │─────────────────────→│
    │←─────────────────────┤
    │ [All groups]         │
    │                      │
    ├─POST /groups
    │─────────────────────→│ (Create)
    │←─────────────────────┤
    │ [New group]          │
    │                      │
    ├─GET /users
    │─────────────────────→│
    │←─────────────────────┤
    │ [All users]          │
    │                      │
    ├─POST /users
    │─────────────────────→│ (Create)
    │←─────────────────────┤
    │ [New user]           │
    │                      │
    ├─PUT /users/:id/group
    │─────────────────────→│ (Assign)
    │←─────────────────────┤
    │ [Updated user]       │
    │                      │
    ├─GET /products
    │─────────────────────→│
    │←─────────────────────┤
    │ [All products]       │
    │                      │
    ├─PUT /products/:id/multiplier
    │─────────────────────→│ (Update)
    │←─────────────────────┤
    │ [Updated product]    │
```

## Responsive Behavior

### Desktop (Wide screens)
```
┌────────────────────────────────────┐
│ Header with all elements visible   │
├────────────────────────────────────┤
│ Full table with all columns        │
│ Date selector and buttons aligned  │
│ Pristine layout                    │
└────────────────────────────────────┘
```

### Tablet (Medium screens)
```
┌──────────────────────┐
│ Compact header       │
├──────────────────────┤
│ Table with scroll    │
│ Some columns hidden  │
│ Stacked controls    │
└──────────────────────┘
```

### Mobile (Small screens)
```
┌──────────────┐
│ Minimal      │
│ header       │
├──────────────┤
│ Horizontal   │
│ scrolling    │
│ table        │
│              │
│ Stacked      │
│ controls     │
│              │
│ Touch-       │
│ friendly     │
│ buttons      │
└──────────────┘
```

## Error Handling Display

```
┌─────────────────────────────────┐
│ ⚠ Error                         │
├─────────────────────────────────┤
│ Failed to fetch leaderboards    │
│ Network error or API down       │
└─────────────────────────────────┘
```

Errors show:
- Clear error message
- Alert box with icon
- Doesn't block other UI
- User can retry

## Loading States

```
User initiates action
    │
    ▼
[Show spinner/loading]
────────────────────
[Disable interactive elements]
────────────────────
[API request in progress]
────────────────────
[Hide spinner]
    │
    ├─→ Success: Update UI
    │
    └─→ Error: Show error message
```

## Browser Compatibility

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Theme Support

Application supports:
- Light mode (default)
- Dark mode (auto-detected from system)
- Configurable via Mantine theme provider

Users can switch via browser's theme preference setting.
