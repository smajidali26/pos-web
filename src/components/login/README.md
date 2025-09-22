# Login Components

This folder contains all login-related components organized in a modular structure.

## Components

### `Login.jsx` (Main Component)
The main login page component that orchestrates all other login components.

**Usage:**
```jsx
import Login from './components/login';
// or
import { Login } from './components/login';
```

### `LoginForm.jsx`
Reusable form component that handles user input and form submission.

**Props:**
- `onSubmit: (formData) => void` - Called when form is submitted
- `isLoading: boolean` - Shows loading state
- `error: string` - Current error message

**Features:**
- Username/password inputs
- Show/hide password toggle
- Remember me checkbox
- Form validation
- Auto error clearing on input

### `LoginHeader.jsx`
Displays the login page header with logo and title.

**Props:**
- `title: string` - Page title (default: "POSWeb")
- `subtitle: string` - Page subtitle (default: "Sign in to your account")

### `LoginFooter.jsx`
Footer section with contact information and demo credentials.

**Props:**
- `contactText: string` - Contact text (default: "Don't have an account?")
- `contactLink: string` - Contact link text (default: "Contact Administrator")
- `showDemoCredentials: boolean` - Show demo credentials (default: true)

### `LoginError.jsx`
Error display component with dismiss functionality.

**Props:**
- `error: string` - Error message to display

**Features:**
- Auto-dismissible alert
- Redux integration for error clearing
- Bootstrap styling

## File Structure

```
components/login/
├── index.js              # Export all components
├── Login.jsx             # Main login page
├── LoginForm.jsx         # Form component
├── LoginHeader.jsx       # Header component
├── LoginFooter.jsx       # Footer component
├── LoginError.jsx        # Error display component
└── README.md             # This file
```

## Usage Examples

### Basic Usage
```jsx
import Login from './components/login';

function App() {
  return <Login />;
}
```

### Custom Login Page
```jsx
import { LoginHeader, LoginForm, LoginFooter, LoginError } from './components/login';

function CustomLogin() {
  const handleSubmit = (formData) => {
    // Handle login
  };

  return (
    <div className="login-container">
      <LoginHeader title="Custom POS" subtitle="Welcome back" />
      <LoginError error={error} />
      <LoginForm onSubmit={handleSubmit} isLoading={false} />
      <LoginFooter showDemoCredentials={false} />
    </div>
  );
}
```

## Benefits of This Structure

1. **Modularity** - Each component has a single responsibility
2. **Reusability** - Components can be used independently
3. **Maintainability** - Easy to modify individual parts
4. **Testing** - Each component can be tested in isolation
5. **Customization** - Easy to create custom login layouts

## Integration with Redux

All login components are integrated with the Redux auth slice:
- Form submission dispatches `loginUser` action
- Error display uses `clearError` action
- Loading states come from auth slice state

## Styling

Components use Bootstrap classes for consistent styling:
- `card` and `card-body` for layout
- `form-control` and `input-group` for inputs
- `btn` and `alert` for interactive elements
- `text-*` utilities for text styling
