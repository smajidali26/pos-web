# Cookie-Based Authentication Migration Guide

## Overview

This application has been migrated from **localStorage token storage** to **httpOnly cookie authentication** for improved security.

## What Changed?

### Frontend Changes (COMPLETED ✅)

1. **apiClient.ts**
   - Added `withCredentials: true` to axios configuration
   - Removed manual `Authorization` header injection
   - Removed all `localStorage` token reads/writes
   - Updated token refresh to use cookies instead of request body

2. **authService.ts**
   - Removed all `localStorage` operations for tokens
   - Simplified logout (backend clears cookies)
   - Simplified token refresh (backend reads from cookies)
   - Changed `hasRefreshToken()` to async `hasValidSession()`

3. **auth/saga.ts**
   - Removed token storage after login
   - Removed token updates after refresh
   - Removed token cleanup on logout/errors

4. **auth/slice.ts**
   - Removed initialization from localStorage
   - App starts in unauthenticated state
   - Session restored via API validation

### Backend Changes Required (TODO ⚠️)

You **MUST** update your backend API to support httpOnly cookies:

#### 1. Login Endpoint (`POST /api/auth/login`)

**Current behavior:**
```json
{
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": { ... }
}
```

**New behavior required:**
```javascript
// Set httpOnly cookies
res.cookie('authToken', token, {
  httpOnly: true,      // Cannot be accessed by JavaScript
  secure: true,        // Only sent over HTTPS in production
  sameSite: 'strict',  // CSRF protection
  maxAge: 15 * 60 * 1000 // 15 minutes
});

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Return only user data (no tokens in response body)
res.json({
  user: { ... }
});
```

#### 2. Token Refresh Endpoint (`POST /api/auth/refresh`)

**Current behavior:**
```javascript
// Reads refreshToken from request body
const { refreshToken } = req.body;
```

**New behavior required:**
```javascript
// Read refreshToken from httpOnly cookie
const refreshToken = req.cookies.refreshToken;

if (!refreshToken) {
  return res.status(401).json({ message: 'No refresh token' });
}

// Validate and generate new tokens
const newToken = generateNewToken(refreshToken);
const newRefreshToken = generateNewRefreshToken();

// Set new cookies
res.cookie('authToken', newToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000
});

res.cookie('refreshToken', newRefreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

res.json({ success: true });
```

#### 3. Logout Endpoint (`POST /api/auth/logout`)

**Current behavior:**
```javascript
// Receives refreshToken in request body
const { refreshToken } = req.body;
```

**New behavior required:**
```javascript
// Clear cookies
res.clearCookie('authToken');
res.clearCookie('refreshToken');

res.json({ success: true });
```

#### 4. Protected Endpoints (All authenticated routes)

**Current behavior:**
```javascript
// Reads token from Authorization header
const token = req.headers.authorization?.replace('Bearer ', '');
```

**New behavior required:**
```javascript
// Read token from httpOnly cookie
const token = req.cookies.authToken;

if (!token) {
  return res.status(401).json({ message: 'Unauthorized' });
}

// Verify token
const decoded = verifyJWT(token);
req.user = decoded;
```

#### 5. CORS Configuration

**CRITICAL:** You must configure CORS to allow credentials:

```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true // Allow cookies
}));
```

For production:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

#### 6. Cookie Parser Middleware

Install and configure cookie-parser:

```bash
npm install cookie-parser
```

```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());
```

## Security Benefits

✅ **XSS Protection**: httpOnly cookies cannot be accessed by JavaScript
✅ **CSRF Protection**: SameSite flag prevents cross-site attacks
✅ **Automatic Management**: No manual token handling in frontend
✅ **Secure Transmission**: Secure flag ensures HTTPS-only in production

## Testing Checklist

After implementing backend changes:

- [ ] Login sets authToken and refreshToken cookies
- [ ] Cookies have httpOnly, secure, and sameSite flags
- [ ] Protected endpoints read token from cookies
- [ ] Token refresh reads from cookie and sets new cookies
- [ ] Logout clears both cookies
- [ ] CORS allows credentials from frontend origin
- [ ] Session persists after page refresh
- [ ] 401 errors trigger token refresh automatically
- [ ] Failed refresh redirects to login

## Rollback Plan

If you need to rollback to localStorage:

1. Revert changes to:
   - `src/services/apiClient.ts`
   - `src/services/authService.ts`
   - `src/store/auth/saga.ts`
   - `src/store/auth/slice.ts`

2. Use git to restore previous versions:
```bash
git checkout HEAD~1 -- src/services/apiClient.ts
git checkout HEAD~1 -- src/services/authService.ts
git checkout HEAD~1 -- src/store/auth/saga.ts
git checkout HEAD~1 -- src/store/auth/slice.ts
```

## Additional Notes

### Session Restoration

Since the app no longer reads auth state from localStorage, you may need to add a session validation on app startup:

```typescript
// In App.tsx or main initialization
useEffect(() => {
  // Check if we have a valid session
  authService.validateToken()
    .then(result => {
      if (result.valid && result.user) {
        dispatch(restoreUser({ user: result.user }));
      }
    })
    .catch(() => {
      // No valid session
    });
}, []);
```

### Token Expiration

- **Access Token**: 15 minutes (recommended)
- **Refresh Token**: 7 days (recommended)
- Adjust `maxAge` in cookie settings based on your requirements

### Production Configuration

Remember to:
1. Set `secure: true` in production (requires HTTPS)
2. Configure proper CORS origin (not wildcard)
3. Use environment variables for cookie settings
4. Enable HTTPS/TLS on your backend

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify cookies are being set (DevTools → Application → Cookies)
3. Confirm CORS is configured with `credentials: true`
4. Ensure backend is using `cookie-parser` middleware
