# Categories API Integration Documentation

## Overview
The Categories component has been fully integrated with REST API endpoints for complete CRUD (Create, Read, Update, Delete) operations. This provides a robust category management system for your POS application.

## API Endpoints

### Base URL
All endpoints use the configured API base URL from environment variables:
```
__API_BASE_URL__/api/Categories
```

### Endpoint Details

#### 1. Get All Categories
```http
GET /api/Categories
```
**Response:** Array of category objects
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "productCount": 15,
    "createdAt": "2025-08-26T10:00:00Z",
    "updatedAt": "2025-08-26T10:00:00Z"
  }
]
```

#### 2. Get Category by ID
```http
GET /api/Categories/{id}
```
**Response:** Single category object

#### 3. Create Category
```http
POST /api/Categories
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "New Category",
  "description": "Category description"
}
```
**Response:** Created category object with ID

#### 4. Update Category
```http
PUT /api/Categories/{id}
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```
**Response:** Updated category object

#### 5. Delete Category
```http
DELETE /api/Categories/{id}
```
**Response:** Success confirmation

#### 6. Get Products by Category (Optional)
```http
GET /api/Categories/{id}/products
```
**Response:** Array of products in the category

## Implementation Files

### 1. Categories Service (`src/services/categoriesService.js`)
- **Purpose**: Handles all API communication for categories
- **Methods**:
  - `getAllCategories()` - Fetch all categories
  - `getCategoryById(id)` - Fetch single category
  - `createCategory(data)` - Create new category
  - `updateCategory(id, data)` - Update existing category
  - `deleteCategory(id)` - Delete category
  - `getProductsByCategory(id)` - Get products in category

### 2. Categories Hook (`src/hooks/useCategories.js`)
- **Purpose**: Custom React hook for category state management
- **Features**:
  - State management for categories array
  - Loading and error states
  - CRUD operation methods
  - Automatic data fetching on mount
  - Error handling with user-friendly messages

### 3. Categories Component (`src/components/categories/Categories.jsx`)
- **Purpose**: React component for category management UI
- **Features**:
  - Responsive grid layout
  - Add/Edit modals with form validation
  - Delete confirmation dialogs
  - Loading states and error handling
  - Operation feedback to users

## Features Implemented

### ✅ **CRUD Operations**
- **Create**: Add new categories with name and description
- **Read**: Display all categories in a responsive grid
- **Update**: Edit existing category details
- **Delete**: Remove categories with confirmation

### ✅ **User Experience**
- **Loading States**: Spinners during API operations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Required field validation
- **Confirmation Dialogs**: Safe deletion with user confirmation
- **Responsive Design**: Works on all screen sizes

### ✅ **State Management**
- **Custom Hook**: Centralized category state management
- **Automatic Sync**: UI automatically updates after operations
- **Error Recovery**: Clear error states and retry capability
- **Optimistic Updates**: Immediate UI feedback

## Error Handling

### API Error Responses
The system handles various error scenarios:

```javascript
// 400 Bad Request
{
  "message": "Category name is required",
  "errors": {
    "name": ["The name field is required"]
  }
}

// 404 Not Found
{
  "message": "Category not found"
}

// 409 Conflict
{
  "message": "Category name already exists"
}

// 500 Internal Server Error
{
  "message": "An error occurred while processing your request"
}
```

### Client-Side Error Handling
- **Network Errors**: Handled with retry capability
- **Validation Errors**: Displayed inline with forms
- **Server Errors**: User-friendly messages displayed
- **Authentication Errors**: Automatic token refresh or logout

## Usage Examples

### Using the Categories Service Directly
```javascript
import categoriesService from '../services/categoriesService';

// Create a new category
const newCategory = await categoriesService.createCategory({
  name: 'Books',
  description: 'Educational and entertainment books'
});

// Update a category
const updated = await categoriesService.updateCategory(1, {
  name: 'Updated Name',
  description: 'Updated description'
});

// Delete a category
await categoriesService.deleteCategory(1);
```

### Using the Custom Hook
```javascript
import useCategories from '../hooks/useCategories';

function MyComponent() {
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const handleCreate = async (data) => {
    try {
      await createCategory(data);
      // Success - categories state automatically updated
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {categories.map(cat => <div key={cat.id}>{cat.name}</div>)}
    </div>
  );
}
```

## Security Features

### Authentication
- **JWT Tokens**: All requests include Bearer token
- **Automatic Refresh**: Token refresh on expiration
- **Permission Check**: API validates user permissions

### Input Validation
- **Client-Side**: Form validation before submission
- **Server-Side**: Backend validation for security
- **Sanitization**: Input sanitization to prevent XSS

### Error Security
- **No Sensitive Data**: Error messages don't expose sensitive information
- **Rate Limiting**: API should implement rate limiting
- **CORS**: Proper CORS configuration required

## Backend Requirements

### Expected API Behavior
The backend should implement:

1. **RESTful Endpoints**: Standard HTTP methods and status codes
2. **JSON Responses**: Consistent JSON response format
3. **Error Handling**: Proper error status codes and messages
4. **Authentication**: JWT token validation
5. **Validation**: Input validation and sanitization
6. **CORS**: Allow frontend domain access

### Database Schema
Suggested category table structure:
```sql
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    IsDeleted BIT DEFAULT 0
);
```

## Testing

### Manual Testing
1. **Create Category**: Test form validation and success/error states
2. **Edit Category**: Test modal functionality and data persistence
3. **Delete Category**: Test confirmation dialog and deletion
4. **Error Scenarios**: Test network errors and API failures
5. **Loading States**: Verify loading indicators work correctly

### API Testing
Use tools like Postman or curl to test:
```bash
# Test create category
curl -X POST http://localhost:9090/api/Categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Category","description":"Test Description"}'

# Test get all categories
curl -X GET http://localhost:9090/api/Categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Performance Considerations

### Optimization Features
- **Lazy Loading**: Consider pagination for large datasets
- **Caching**: Implement caching for frequently accessed data
- **Debouncing**: Search functionality with debounced input
- **Optimistic Updates**: Immediate UI feedback

### Monitoring
- **API Response Times**: Monitor category endpoint performance
- **Error Rates**: Track API error frequencies
- **User Actions**: Monitor user interaction patterns

## Future Enhancements

### Planned Features
1. **Category Images**: Upload and display category images
2. **Subcategories**: Hierarchical category structure
3. **Bulk Operations**: Bulk create/update/delete
4. **Search & Filter**: Advanced category filtering
5. **Analytics**: Category usage statistics
6. **Export/Import**: CSV/Excel import/export functionality

### Integration Opportunities
1. **Product Integration**: Link products to categories
2. **Inventory Management**: Category-based inventory tracking
3. **Reporting**: Category-based sales reports
4. **E-commerce**: Category-based product browsing
