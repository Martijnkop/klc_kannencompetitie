# Quick Start Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Configure Environment
Copy the example environment file and update it:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3000/api    # Your backend API URL
VITE_ADMIN_PASSWORD=admin123              # Change this to a secure password!
VITE_LEADERBOARD_POLL_INTERVAL=60000      # Refresh every 60 seconds
```

## 3. Start Development Server
```bash
npm run dev
```

The app opens at `http://localhost:5173`

## 4. Access the Application

### Public Leaderboard
- **URL**: [http://localhost:5173](http://localhost:5173)
- **View**: User and Group leaderboards
- **Features**: Date range selection, auto-refresh every minute

### Admin Dashboard
- **URL**: [http://localhost:5173/admin-login](http://localhost:5173/admin-login)
- **Password**: Use the value from `VITE_ADMIN_PASSWORD` in your `.env`
- **Management**: Groups, Users, Products (multipliers)

## 5. Build for Production
```bash
npm run build
```

Output goes to `dist/` directory for deployment.

## Key Features

✅ **Real-time Leaderboard** - Auto-updates every 60 seconds
✅ **Password-Protected Admin** - Secure management tools
✅ **Responsive Design** - Works on desktop and mobile
✅ **Full TypeScript** - Type-safe code
✅ **Modern UI** - Built with Mantine components

## Typical Workflow

1. **First time setup**: Initialize database on backend with `POST /api/init`
2. **Create groups** via Admin → Manage Groups
3. **Create users** via Admin → Manage Users
4. **Assign users to groups** via Admin → Manage Users
5. **Set product multipliers** via Admin → Manage Products
6. **View leaderboards** on the main page
7. **Monitor real-time updates** as they refresh automatically

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:3000/api` |
| `VITE_ADMIN_PASSWORD` | Admin login password | `your_secure_password` |
| `VITE_LEADERBOARD_POLL_INTERVAL` | Auto-refresh interval (ms) | `60000` = 1 minute |

## API Integration

The frontend expects these endpoints on your backend:
- `GET /api/leaderboard/users` - User leaderboard
- `GET /api/leaderboard/groups` - Group leaderboard
- `GET /api/groups` - List groups
- `POST /api/groups` - Create group
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id/group` - Assign user to group
- `GET /api/products` - List products
- `PUT /api/products/:id/multiplier` - Update product multiplier

See [api.md](api.md) for full API documentation.

## Customization

### Change Password
Edit `.env`:
```env
VITE_ADMIN_PASSWORD=your_new_secure_password
```

### Change Polling Interval
Edit `.env` (in milliseconds):
```env
VITE_LEADERBOARD_POLL_INTERVAL=120000  # 2 minutes
```

### Change API URL
Edit `.env`:
```env
VITE_API_URL=https://your-api.com/api
```

## Common Issues

**"Module not found" or TypeScript errors?**
- Run `npm install` again
- Clear node_modules: `rm -r node_modules && npm install`

**API Not Connecting?**
- Check `VITE_API_URL` in `.env`
- Ensure backend is running
- Check browser console for CORS errors

**Admin password doesn't work?**
- Verify correct value in `.env`
- Restart dev server (`npm run dev`)
- Clear browser sessionStorage

## Production Deployment

```bash
# Build production bundle
npm run build

# Serve locally to test
npm run preview

# Deploy dist/ folder to your server
# Update VITE_API_URL in .env for production API endpoint
```

## Support

For issues or questions:
1. Check [FRONTEND_README.md](FRONTEND_README.md) for detailed documentation
2. Review [api.md](api.md) for backend API specs
3. Check browser console for error messages
