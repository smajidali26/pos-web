# POSWeb - React POS System

A modern Point of Sale (POS) web application built with React, Redux, and Bootstrap, featuring user authentication.

## Features

- 🔐 **User Authentication** - Secure login with JWT tokens
- 🛒 **Shopping Cart** - Add, remove, and modify cart items
- 📦 **Product Management** - Browse, search, and filter products
- 🎨 **Modern UI** - Bootstrap-powered responsive design
- 🔄 **State Management** - Redux with Redux Toolkit
- 📱 **Responsive Design** - Works on desktop and mobile

## Getting Started

### Prerequisites

- Node.js (v24.6.0 or later)
- npm (v11.5.1 or later)
- Authentication API running on http://localhost:5090

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example environment file
copy .env.example .env

# Edit .env file to match your API configuration
# Default API URL is http://localhost:5090
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

### Authentication API

The application expects an authentication API running on `http://localhost:5090` with the following endpoint:

- `POST /api/auth/login` - User login
  - Request body: `{ "username": "string", "password": "string" }`
  - Response: `{ "token": "jwt_token", "user": { "username": "string" } }`

### Demo Credentials

For testing purposes, you can use:
- **Username**: admin
- **Password**: password

## Environment Configuration

The application uses environment variables for configuration. Copy `.env.example` to `.env` and update the values:

```env
# API Configuration
API_BASE_URL=http://localhost:9090

# Development Configuration
APP_NAME=Penny Pick Mart
APP_VERSION=1.0.0
```

**Important**: Environment variables in Vite must be prefixed with `VITE_` to be accessible in the client-side code.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Technology Stack

### Frontend
- **React 19** - UI framework
- **Redux Toolkit** - State management
- **React Redux** - React bindings for Redux
- **Bootstrap 5** - CSS framework
- **Bootstrap Icons** - Icon library
- **Axios** - HTTP client

### Build Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting

## Project Structure

```
src/
├── components/              # React components
│   ├── login/              # Login-related components
│   │   ├── Login.jsx       # Main login page
│   │   ├── LoginForm.jsx   # Form component
│   │   ├── LoginHeader.jsx # Header component
│   │   ├── LoginFooter.jsx # Footer component
│   │   ├── LoginError.jsx  # Error display
│   │   ├── index.js        # Component exports
│   │   └── README.md       # Login components docs
│   ├── Dashboard.jsx       # Main POS dashboard
│   ├── Header.jsx          # Navigation header
│   └── ProtectedRoute.jsx  # Route protection
├── hooks/                  # Custom React hooks
│   ├── useAuth.js          # Authentication hook
│   ├── useCart.js          # Shopping cart hook
│   └── useProducts.js      # Products hook
├── store/                  # Redux store
│   ├── index.js            # Store configuration
│   ├── authSlice.js        # Authentication state
│   ├── cartSlice.js        # Shopping cart state
│   ├── productsSlice.js    # Products state
│   └── selectors.js        # Redux selectors
├── services/               # API services
│   ├── apiClient.js        # Axios configuration
│   └── authService.js      # Authentication API calls
└── App.jsx                 # Main application component
```

## State Management

The application uses Redux with Redux Toolkit for state management:

- **Auth State** - User authentication, tokens, login status
- **Cart State** - Shopping cart items, quantities, totals
- **Products State** - Product inventory, categories, search/filter

## Authentication Flow

1. User enters credentials on login page
2. Credentials sent to `/api/auth/login` endpoint
3. JWT token received and stored in localStorage
4. Token automatically included in subsequent API requests
5. Protected routes redirect to login if not authenticated
6. Token validation on app initialization

## API Integration

The app includes axios interceptors for:
- Automatic token inclusion in requests
- Automatic logout on 401 responses
- Error handling and retry logic

## Development

The app uses modern React patterns:
- Functional components with hooks
- Redux Toolkit for simplified Redux usage
- Custom hooks for reusable logic
- Protected routes for authentication
- Responsive Bootstrap components

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the ESLint configuration to enable type-aware lint rules and TypeScript integration.

## Contributing

1. Follow the existing code structure
2. Use functional components and hooks
3. Maintain Redux best practices
4. Ensure responsive design
5. Add proper error handling
