# Role-Based Access Control (RBAC) Documentation

## Overview
The POS Web application now implements comprehensive Role-Based Access Control (RBAC) to restrict access to Dashboard and Categories routes to only Owner and Manager roles. This ensures that sensitive management functions are protected from unauthorized access.

## User Roles

### Role Hierarchy
```
Owner (Level 4)    - Full system access
Manager (Level 3)  - Management functions
Cashier (Level 2)  - Sales operations
Employee (Level 1) - Basic access
```

### Role Definitions

#### 1. Owner (owner)
- **Access Level**: Full system access
- **Permissions**: All features and administrative functions
- **Routes**: Dashboard, Categories, Products, Sales, Reports
- **Description**: System administrator with complete control

#### 2. Manager (manager)
- **Access Level**: Management functions
- **Permissions**: Business operations and reporting
- **Routes**: Dashboard, Categories, Products, Sales, Reports
- **Description**: Store manager with business oversight

#### 3. Cashier (cashier)
- **Access Level**: Sales operations
- **Permissions**: Sales processing and product viewing
- **Routes**: Products, Sales
- **Description**: Point-of-sale operator

#### 4. Employee (employee)
- **Access Level**: Basic access
- **Permissions**: Limited functionality
- **Routes**: Sales (limited)
- **Description**: Basic staff member

## Route Protection

### Protected Routes

#### Dashboard Routes
- **Paths**: `/`, `/dashboard`
- **Required Roles**: Owner, Manager
- **Restriction**: Cashier and Employee redirected to `/unauthorized`

#### Categories Routes
- **Paths**: `/categories`
- **Required Roles**: Owner, Manager
- **Restriction**: Cashier and Employee redirected to `/unauthorized`

#### Products Routes
- **Paths**: `/products`
- **Required Roles**: Owner, Manager, Cashier
- **Restriction**: Employee redirected to `/unauthorized`

#### Sales Routes
- **Paths**: `/sales`
- **Required Roles**: Owner, Manager, Cashier
- **Restriction**: No restrictions (all authenticated users)

#### Reports Routes
- **Paths**: `/reports`
- **Required Roles**: Owner, Manager
- **Restriction**: Cashier and Employee redirected to `/unauthorized`

### Unauthorized Access
- **Path**: `/unauthorized`
- **Access**: All authenticated users
- **Purpose**: Displays access denied message with user role information

## Implementation Files

### 1. Role Access Hook (`src/hooks/useRoleAccess.js`)
- **Purpose**: Centralized role and permission management
- **Features**:
  - Role hierarchy validation
  - Permission checking
  - Route access validation
  - User role display formatting

### 2. Role Protected Route (`src/components/RoleProtectedRoute.jsx`)
- **Purpose**: Route-level access control
- **Features**:
  - Role-based route protection
  - Automatic redirect to unauthorized page
  - Permission-based access control

### 3. Unauthorized Component (`src/components/Unauthorized.jsx`)
- **Purpose**: Access denied page
- **Features**:
  - User-friendly error message
  - Current role display
  - Navigation options
  - Help information

### 4. Enhanced Header (`src/components/Header.jsx`)
- **Purpose**: Role-based navigation
- **Features**:
  - Conditional menu items based on role
  - User role display in dropdown
  - Dynamic navigation visibility

### 5. Enhanced Categories (`src/components/categories/Categories.jsx`)
- **Purpose**: Role-based category management
- **Features**:
  - Management actions for Owner/Manager only
  - Read-only view for unauthorized roles
  - Conditional UI elements

## Permission System

### Permission Constants
```javascript
PERMISSIONS = {
  VIEW_DASHBOARD: ['owner', 'manager'],
  VIEW_CATEGORIES: ['owner', 'manager'],
  CREATE_CATEGORIES: ['owner', 'manager'],
  UPDATE_CATEGORIES: ['owner', 'manager'],
  DELETE_CATEGORIES: ['owner', 'manager'],
  VIEW_PRODUCTS: ['owner', 'manager', 'cashier'],
  CREATE_PRODUCTS: ['owner', 'manager'],
  VIEW_SALES: ['owner', 'manager', 'cashier'],
  VIEW_REPORTS: ['owner', 'manager']
}
```

### Permission Checking
```javascript
// Check specific permission
const canManageCategories = hasPermission('CREATE_CATEGORIES');

// Check role access
const isManagerOrAbove = hasRole(['owner', 'manager']);

// Check minimum role level
const canAccessReports = hasMinimumRole('manager');
```

## User Interface Changes

### Navigation Menu
- **Dynamic Visibility**: Menu items show/hide based on user role
- **Conditional Dropdowns**: Products dropdown shows relevant items only
- **Role Display**: User dropdown shows current role

### Categories Page
- **Management Actions**: Add/Edit/Delete buttons visible to Owner/Manager only
- **Read-Only Mode**: Other roles can view but not modify categories
- **Contextual Help**: Page description changes based on permissions

### User Dropdown
- **Role Badge**: Displays current user role
- **Profile Information**: Enhanced user information display
- **Role-Specific Actions**: Context-sensitive menu items

## Security Features

### Client-Side Protection
- **Route Guards**: Prevent unauthorized route access
- **UI Restrictions**: Hide management functions from unauthorized users
- **Permission Validation**: Real-time permission checking

### Error Handling
- **Graceful Degradation**: Unauthorized users see appropriate error pages
- **Navigation Fallbacks**: Clear navigation options for unauthorized access
- **User Feedback**: Informative error messages

### State Management
- **Role Persistence**: User role stored in Redux state
- **Token Integration**: Role information from JWT tokens
- **Automatic Updates**: Role changes reflect immediately in UI

## Backend Integration

### Expected User Object Structure
```javascript
{
  "id": 1,
  "username": "john.doe",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "manager",  // Required for RBAC
  "permissions": [],  // Optional: specific permissions
  "createdAt": "2025-08-26T10:00:00Z"
}
```

### JWT Token Payload
```javascript
{
  "sub": "1",
  "username": "john.doe",
  "role": "manager",    // Required for role-based access
  "exp": 1724678400,
  "iat": 1724674800
}
```

### API Endpoints
Backend should validate user roles for protected endpoints:
```
GET /api/Categories     - Requires: owner, manager
POST /api/Categories    - Requires: owner, manager
PUT /api/Categories/:id - Requires: owner, manager
DELETE /api/Categories/:id - Requires: owner, manager
```

## Usage Examples

### Using Role Access Hook
```javascript
import useRoleAccess from '../hooks/useRoleAccess';

function MyComponent() {
  const {
    userRole,
    canAccessDashboard,
    canManageCategories,
    hasPermission
  } = useRoleAccess();

  return (
    <div>
      <p>Current Role: {userRole}</p>
      {canAccessDashboard && <DashboardLink />}
      {hasPermission('CREATE_CATEGORIES') && <AddCategoryButton />}
    </div>
  );
}
```

### Protecting Components
```javascript
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import { USER_ROLES } from '../hooks/useRoleAccess';

<RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
  <SensitiveComponent />
</RoleProtectedRoute>
```

### Conditional Rendering
```javascript
const { canManageCategories } = useRoleAccess();

return (
  <div>
    <CategoryList />
    {canManageCategories && <CategoryManagement />}
  </div>
);
```

## Testing Role-Based Access

### Test Scenarios

#### Owner Role
- ✅ Can access Dashboard
- ✅ Can access Categories (full CRUD)
- ✅ Can access Products
- ✅ Can access Sales
- ✅ Can access Reports

#### Manager Role
- ✅ Can access Dashboard
- ✅ Can access Categories (full CRUD)
- ✅ Can access Products
- ✅ Can access Sales
- ✅ Can access Reports

#### Cashier Role
- ❌ Cannot access Dashboard (redirected to /unauthorized)
- ❌ Cannot access Categories (redirected to /unauthorized)
- ✅ Can access Products (view only)
- ✅ Can access Sales
- ❌ Cannot access Reports (redirected to /unauthorized)

#### Employee Role
- ❌ Cannot access Dashboard (redirected to /unauthorized)
- ❌ Cannot access Categories (redirected to /unauthorized)
- ❌ Cannot access Products (redirected to /unauthorized)
- ✅ Can access Sales (limited)
- ❌ Cannot access Reports (redirected to /unauthorized)

### Manual Testing
1. **Login with different roles**: Test access with each role type
2. **Direct URL access**: Try accessing protected routes directly
3. **Navigation visibility**: Verify menu items show/hide correctly
4. **Action restrictions**: Test management actions are properly restricted
5. **Unauthorized page**: Verify proper error page display

## Security Considerations

### Client-Side Limitations
- **Not a Security Barrier**: Client-side restrictions are UX enhancements only
- **Backend Validation Required**: Server must validate all permissions
- **Token Security**: Ensure JWT tokens include role information securely

### Best Practices
1. **Defense in Depth**: Implement both client and server-side validation
2. **Principle of Least Privilege**: Grant minimum necessary permissions
3. **Regular Audits**: Review role assignments and permissions regularly
4. **Secure Token Storage**: Use secure storage for authentication tokens

## Future Enhancements

### Planned Features
1. **Dynamic Permissions**: Database-driven permission system
2. **Role Management UI**: Admin interface for role assignment
3. **Audit Logging**: Track role-based access attempts
4. **Temporary Permissions**: Time-limited access grants
5. **Multi-tenant Support**: Organization-based role isolation

### Advanced Features
1. **Resource-Based Permissions**: Object-level access control
2. **Delegation**: Temporary permission delegation
3. **Role Inheritance**: Hierarchical role relationships
4. **Context-Aware Permissions**: Location or time-based restrictions

## Troubleshooting

### Common Issues
1. **Infinite Redirects**: Check role validation logic
2. **Missing Permissions**: Verify user object contains role field
3. **Navigation Issues**: Ensure route protection is properly configured
4. **UI Inconsistencies**: Check conditional rendering logic

### Debug Mode
Enable console logging to monitor access control:
```javascript
// Check browser console for these messages:
"Access denied: User role 'cashier' does not have required access"
"Route protection active for: /dashboard"
"User role: manager, accessing: /categories"
```
