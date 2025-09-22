## Authentication Testing Guide

### Testing the Login System

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Access the Application**
   - Navigate to: http://localhost:5173
   - You should see the login page

3. **Test Authentication Flow**

   **Without API Server:**
   - Try logging in with any credentials
   - You should see an error message about connection failure

   **With API Server (http://localhost:9090):**
   - Use the demo credentials:
     - Username: `admin`
     - Password: `admin123`
   - On successful login, you should be redirected to the POS dashboard

### Authentication Features

✅ **Login Page**
- Responsive design with Bootstrap
- Form validation
- Loading states
- Error handling
- Show/hide password toggle

✅ **Protected Routes**
- Automatic redirect to login when not authenticated
- Token persistence in localStorage
- Auto-logout on token expiration

✅ **User Interface**
- User menu in header with logout option
- Logout confirmation dialog
- Visual feedback for authentication states

✅ **State Management**
- Redux integration for auth state
- Automatic token management
- Error handling and loading states

### API Requirements

The authentication API should implement:

```javascript
// POST /api/auth/login
{
  "username": "admin",
  "password": "password"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "name": "Administrator"
  }
}
```

### Redux State Structure

```javascript
{
  auth: {
    user: { username: "admin" },
    token: "jwt_token_string",
    isAuthenticated: true,
    isLoading: false,
    error: null
  },
  cart: { /* cart state */ },
  products: { /* products state */ }
}
```

### Error Handling

- Network errors: "Login failed. Please try again."
- 401 Unauthorized: "Invalid credentials"
- 500 Server Error: "Server error. Please try again later."
- No API: "Connection failed. Is the API server running?"
