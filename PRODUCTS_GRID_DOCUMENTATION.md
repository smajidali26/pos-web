# Products Grid with API Integration Documentation

## Overview
The Products component has been completely rewritten to integrate with the API endpoint `api/Products/GetAllProducts` with comprehensive features including search functionality, category filtering, and pagination. This provides a professional product management interface with excellent user experience.

## API Integration

### Primary Endpoint
```
GET /api/Products/GetAllProducts
```

### Query Parameters
The endpoint supports the following optional query parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Page number (1-based) | `?page=2` |
| `pageSize` | integer | Items per page | `?pageSize=12` |
| `searchTerm` | string | Search in name/description | `?searchTerm=laptop` |
| `categoryId` | integer | Filter by category | `?categoryId=5` |
| `sortBy` | string | Sort field | `?sortBy=name` |
| `sortDirection` | string | Sort direction (asc/desc) | `?sortDirection=desc` |

### Example API Calls
```javascript
// Basic call
GET /api/Products/GetAllProducts

// With pagination
GET /api/Products/GetAllProducts?page=2&pageSize=12

// With search and category filter
GET /api/Products/GetAllProducts?searchTerm=laptop&categoryId=1&page=1&pageSize=24

// With sorting
GET /api/Products/GetAllProducts?sortBy=price&sortDirection=asc
```

### Expected Response Format
```javascript
{
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "originalPrice": 129.99,
      "categoryId": 1,
      "categoryName": "Electronics",
      "imageUrl": "https://example.com/image.jpg",
      "stock": 25,
      "createdAt": "2025-08-26T10:00:00Z",
      "updatedAt": "2025-08-26T10:00:00Z"
    }
  ],
  "totalCount": 150,
  "totalPages": 13,
  "currentPage": 1,
  "pageSize": 12
}
```

## Features Implemented

### ✅ **Search Functionality**
- **Real-time Search**: Debounced search with 500ms delay
- **Search Fields**: Searches in product name and description
- **Search Clear**: One-click search term clearing
- **Search Persistence**: Search state maintained during navigation

### ✅ **Category Filtering**
- **Dynamic Categories**: Loaded from Categories API
- **All Categories Option**: Show all products regardless of category
- **Category Integration**: Uses category names for display
- **Filter Persistence**: Category filter maintained during operations

### ✅ **Advanced Pagination**
- **Page Navigation**: Previous/Next and direct page number selection
- **Page Size Options**: 6, 12, 24, 48 items per page
- **Smart Pagination**: Shows ellipsis for large page counts
- **Results Info**: "Showing X to Y of Z results"
- **Keyboard Accessible**: Full keyboard navigation support

### ✅ **Sorting Options**
- **Name Sorting**: Alphabetical A-Z and Z-A
- **Price Sorting**: Low to High and High to Low
- **Category Sorting**: By category name
- **Date Sorting**: Newest first
- **Visual Indicators**: Sort direction icons

### ✅ **Grid Display**
- **Responsive Layout**: 1-4 columns based on screen size
- **Product Cards**: Professional card design with images
- **Product Information**: Name, category, price, description, stock
- **Image Support**: Product images with fallback
- **Price Display**: Regular and sale price support
- **Stock Indicators**: In stock / Out of stock badges

### ✅ **Role-Based Access**
- **Management Actions**: Edit/Delete for Owner/Manager only
- **Add Product Button**: Only visible to authorized users
- **Contextual Help**: Different descriptions based on permissions

### ✅ **User Experience**
- **Loading States**: Spinners during data fetching
- **Error Handling**: User-friendly error messages with retry
- **Empty States**: Helpful messages when no products found
- **Filter Management**: Clear all filters functionality
- **Responsive Design**: Works on all screen sizes

## Component Architecture

### 1. Products Service (`src/services/productsService.js`)
- **API Communication**: Handles all product-related API calls
- **Parameter Building**: Constructs query parameters dynamically
- **Error Handling**: Centralized error management
- **Response Processing**: Handles different response formats

### 2. Products Hook (`src/hooks/useProducts.js`)
- **State Management**: Manages products, filters, and pagination state
- **API Integration**: Calls products service methods
- **Debounced Search**: Implements search debouncing
- **Action Handlers**: Provides methods for user interactions

### 3. Pagination Component (`src/components/Pagination.jsx`)
- **Reusable Component**: Can be used across different data grids
- **Smart Page Display**: Intelligent page number rendering
- **Page Size Control**: Dropdown for items per page
- **Accessibility**: ARIA labels and keyboard navigation

### 4. Products Component (`src/components/products/Products.jsx`)
- **Main UI**: Renders the complete products interface
- **Filter UI**: Search, category, and sort controls
- **Grid Layout**: Responsive product cards
- **Pagination Integration**: Uses pagination component

## State Management

### Local State (via useProducts hook)
```javascript
{
  products: [],              // Current page products
  categories: [],            // Available categories
  loading: false,            // Loading indicator
  error: null,              // Error message
  searchTerm: '',           // Current search term
  selectedCategoryId: '',   // Selected category filter
  currentPage: 1,           // Current page number
  pageSize: 12,             // Items per page
  totalCount: 0,            // Total products count
  totalPages: 0,            // Total pages count
  sortBy: 'name',           // Sort field
  sortDirection: 'asc'      // Sort direction
}
```

### Computed Values
```javascript
{
  hasNextPage: boolean,     // Can navigate to next page
  hasPreviousPage: boolean, // Can navigate to previous page
  startIndex: number,       // First item index on current page
  endIndex: number          // Last item index on current page
}
```

## Performance Optimizations

### 1. Debounced Search
- **500ms Delay**: Prevents excessive API calls during typing
- **Search State Separation**: Immediate UI update, delayed API call
- **Cancel Previous**: Cancels pending search requests

### 2. Efficient Pagination
- **Server-Side Pagination**: Only loads current page data
- **Smart Page Reset**: Resets to page 1 when filters change
- **Optimized Rendering**: Minimal re-renders during pagination

### 3. Caching Strategy
- **Category Caching**: Categories loaded once and cached
- **State Persistence**: Filter state maintained during navigation
- **Error Recovery**: Graceful error handling without state loss

## Usage Examples

### Basic Implementation
```javascript
import Products from './components/products/Products';

function App() {
  return <Products />;
}
```

### Using the Products Hook
```javascript
import { useProducts } from './hooks/useProducts';

function CustomProductList() {
  const {
    products,
    loading,
    searchTerm,
    handleSearchChange,
    handlePageChange
  } = useProducts();

  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Advanced Filtering
```javascript
const {
  products,
  categories,
  selectedCategoryId,
  handleCategoryChange,
  clearFilters
} = useProducts();

// Filter by specific category
handleCategoryChange('5');

// Clear all filters
clearFilters();
```

## Backend Requirements

### API Response Format
The backend should return responses in this format:

```javascript
// Successful response
{
  "data": Product[],          // Array of products
  "totalCount": number,       // Total products matching filters
  "totalPages": number,       // Total pages available
  "currentPage": number,      // Current page number
  "pageSize": number          // Items per page
}

// Alternative simple format (also supported)
Product[]  // Simple array of products
```

### Product Model
```javascript
{
  "id": number,               // Required: Unique identifier
  "name": string,             // Required: Product name
  "description": string,      // Optional: Product description
  "price": number,            // Required: Current price
  "originalPrice": number,    // Optional: Original price (for sales)
  "categoryId": number,       // Optional: Category ID
  "categoryName": string,     // Optional: Category name
  "imageUrl": string,         // Optional: Product image URL
  "stock": number,            // Optional: Stock quantity
  "createdAt": string,        // Optional: Creation date (ISO format)
  "updatedAt": string         // Optional: Last update date (ISO format)
}
```

### Error Responses
```javascript
// 400 Bad Request
{
  "message": "Invalid page number",
  "errors": {
    "page": ["Page must be greater than 0"]
  }
}

// 500 Internal Server Error
{
  "message": "An error occurred while fetching products"
}
```

## Testing

### Manual Testing Checklist
- ✅ **Search**: Test search functionality with various terms
- ✅ **Category Filter**: Test filtering by different categories
- ✅ **Pagination**: Test page navigation and page size changes
- ✅ **Sorting**: Test all sorting options
- ✅ **Responsive**: Test on different screen sizes
- ✅ **Loading States**: Verify spinners appear during loading
- ✅ **Error Handling**: Test network error scenarios
- ✅ **Empty States**: Test with no results

### API Testing
```bash
# Test basic endpoint
curl "http://localhost:5090/api/Products/GetAllProducts"

# Test with parameters
curl "http://localhost:5090/api/Products/GetAllProducts?page=1&pageSize=12&searchTerm=laptop&categoryId=1"

# Test sorting
curl "http://localhost:5090/api/Products/GetAllProducts?sortBy=price&sortDirection=desc"
```

## Future Enhancements

### Planned Features
1. **Advanced Search**: Multi-field search with operators
2. **Bulk Operations**: Select multiple products for actions
3. **Export Functionality**: Export product list to CSV/Excel
4. **Product Images**: Multiple images and image carousel
5. **Quick Actions**: Quick edit from grid view
6. **Saved Filters**: Save and load filter presets

### Performance Improvements
1. **Virtual Scrolling**: For very large product lists
2. **Image Lazy Loading**: Load images as they come into view
3. **Background Sync**: Automatic data refresh
4. **Offline Support**: Cache products for offline viewing

## Troubleshooting

### Common Issues
1. **No Products Showing**: Check API endpoint and network connectivity
2. **Search Not Working**: Verify search term parameter format
3. **Pagination Issues**: Check totalCount and totalPages in API response
4. **Category Filter Empty**: Ensure categories API is working
5. **Images Not Loading**: Check imageUrl format and CORS settings

### Debug Information
Enable browser console to see debug logs:
- API request parameters
- Response data structure
- Component state changes
- Error details

The Products grid is now a fully-featured, production-ready component with professional API integration, comprehensive filtering, and excellent user experience! 🎉
