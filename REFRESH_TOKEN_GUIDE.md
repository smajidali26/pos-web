# Refresh Token Implementation

## Overview
The refresh token functionality has been implemented to automatically handle token expiration and refresh access tokens without requiring users to log in again. This enhances user experience by maintaining seamless authentication sessions.

## Features Implemented

### 1. Automatic Token Refresh
- **Proactive Refresh**: Tokens are automatically refreshed 5 minutes before expiration
- **Background Processing**: Token refresh happens silently without user intervention
- **Queue Management**: Multiple simultaneous API requests are queued during token refresh to prevent race conditions

### 2. Enhanced Authentication Flow
- **Dual Token Storage**: Both access tokens and refresh tokens are stored in localStorage
- **Fallback Handling**: If refresh fails, users are automatically logged out and redirected to login
- **State Synchronization**: Redux state is updated with new tokens after successful refresh

### 3. API Request Interception
- **Automatic Retry**: Failed 401 requests are automatically retried with new tokens
- **Queue Management**: Multiple failed requests are queued and retried after token refresh
- **Error Handling**: Graceful fallback to logout if refresh token is invalid or expired

## Key Components

### 1. AuthService (`src/services/authService.js`)
```javascript
// New methods added:
refreshToken()    // Refresh access token using refresh token
hasRefreshToken() // Check if refresh token exists
logout()          // Enhanced to handle refresh token cleanup
```

### 2. API Client (`src/services/apiClient.js`)
- **Enhanced Response Interceptor**: Automatically handles 401 errors
- **Request Queue**: Manages multiple requests during token refresh
- **Smart Retry Logic**: Retries original requests with new tokens

### 3. Auth Slice (`src/store/authSlice.js`)
```javascript
// New actions:
refreshToken      // Async thunk for token refresh
updateTokens      // Reducer for manual token updates

// Enhanced state:
refreshToken      // Stores refresh token
```

### 4. Token Refresh Hook (`src/hooks/useTokenRefresh.js`)
- **Automatic Monitoring**: Checks token expiration every minute
- **Proactive Refresh**: Refreshes tokens before they expire
- **Manual Refresh**: Provides function for manual token refresh

## Usage

### Automatic Refresh
The system automatically handles token refresh. No manual intervention required.

### Manual Refresh
Users can manually refresh their session from the user dropdown menu when the token is expiring:

```jsx
// Available in Header component
const { manualRefresh, isTokenExpiring } = useTokenRefresh();
```

### API Integration
The backend should support these endpoints:

```bash
POST /api/auth/login
# Response: { token, refreshToken, user }

POST /api/auth/refresh
# Body: { refreshToken }
# Response: { token, refreshToken? }

POST /api/auth/logout
# Body: { refreshToken }
```

## Security Features

### 1. Token Validation
- **JWT Decoding**: Tokens are decoded to check expiration times
- **Expiration Buffer**: 5-minute buffer before actual expiration
- **Automatic Cleanup**: Invalid tokens are immediately removed

### 2. Error Handling
- **Graceful Degradation**: Falls back to logout if refresh fails
- **State Cleanup**: Clears all tokens and state on authentication errors
- **User Notification**: Clear feedback on authentication issues

### 3. Storage Management
- **localStorage**: Secure storage of tokens
- **Automatic Cleanup**: Tokens removed on logout or error
- **Synchronization**: Redux state kept in sync with localStorage

## Configuration

### Environment Variables
```bash
__API_BASE_URL__=http://localhost:5090  # API base URL
```

### Token Expiration
- **Check Interval**: 60 seconds (configurable in useTokenRefresh.js)
- **Refresh Buffer**: 300 seconds (5 minutes before expiration)
- **Request Timeout**: 10 seconds (configurable in apiClient.js)

## Benefits

1. **Improved UX**: Users stay logged in longer without interruption
2. **Security**: Short-lived access tokens with secure refresh mechanism
3. **Reliability**: Automatic retry of failed requests
4. **Performance**: Background token refresh doesn't block UI
5. **Scalability**: Queue management handles multiple concurrent requests

## Troubleshooting

### Common Issues
1. **No Refresh Token**: Check if backend returns refreshToken on login
2. **Refresh Fails**: Verify refresh endpoint and token format
3. **Infinite Refresh**: Check token expiration calculation logic
4. **CORS Issues**: Ensure API allows refresh endpoint calls

### Debug Mode
Enable console logging to monitor token refresh:
```javascript
// Check browser console for these messages:
"Token is expiring, attempting refresh..."
"Token refreshed successfully"
"Refresh failed, logging out"
```

## Future Enhancements

1. **Token Blacklisting**: Server-side token invalidation
2. **Sliding Expiration**: Extend token lifetime on activity
3. **Multiple Device Support**: Handle tokens across devices
4. **Offline Support**: Cache and sync tokens when online
5. **Biometric Auth**: Integrate with device authentication
