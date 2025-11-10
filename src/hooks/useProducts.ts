import { useState, useEffect, useCallback } from 'react';
import productsService from '../services/productsService';
import categoriesService from '../services/categoriesService';

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
  reorderLevel: number;
  reorderQuantity: number;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt?: string;
  inventoryValue: number;
  needsReorder: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ProductsParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  categoryId?: string;
  isActive?: boolean;
  isLowStock?: boolean;
  includeInactive?: boolean;
}

interface ProductsResponse {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ProductData {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel?: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  categoryId: string;
  isActive?: boolean;
}

export const useProducts = () => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and pagination state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Sorting state (for client-side sorting since API doesn't support it)
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategoryId]);

  // Fetch products
  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const params: ProductsParams = {
        page: currentPage,
        pageSize: pageSize
      };

      // Add optional filters
      if (debouncedSearchTerm.trim()) {
        params.searchTerm = debouncedSearchTerm.trim();
      }

      if (selectedCategoryId) {
        params.categoryId = selectedCategoryId;
      }

      const response: ProductsResponse = await productsService.getAllProducts(params);

      // Handle PagedResult<ProductDto> response format
      let sortedProducts = response.items || [];

      // Apply client-side sorting
      sortedProducts = [...sortedProducts].sort((a, b) => {
        let compareValue = 0;

        switch (sortBy) {
          case 'name':
            compareValue = a.name.localeCompare(b.name);
            break;
          case 'price':
            compareValue = a.price - b.price;
            break;
          case 'category':
            compareValue = (a.categoryName || '').localeCompare(b.categoryName || '');
            break;
          case 'createdAt':
            compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
          default:
            compareValue = 0;
        }

        return sortDirection === 'asc' ? compareValue : -compareValue;
      });

      setProducts(sortedProducts);
      setTotalCount(response.totalCount || 0);
      setTotalPages(response.totalPages || Math.ceil((response.totalCount || 0) / pageSize));

    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
      setProducts([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearchTerm, selectedCategoryId, sortBy, sortDirection]);

  // Fetch categories
  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      const categoriesData = await categoriesService.getAllCategories();
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Actions
  const handleSearchChange = (term: string): void => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (categoryId: string): void => {
    setSelectedCategoryId(categoryId);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc' = 'asc'): void => {
    setSortBy(field);
    setSortDirection(direction);
  };

  const clearFilters = (): void => {
    setSearchTerm('');
    setSelectedCategoryId('');
    setCurrentPage(1);
    setSortBy('name');
    setSortDirection('asc');
  };

  const refreshProducts = (): void => {
    fetchProducts();
  };

  // Create product
  const createProduct = async (productData: ProductData): Promise<string> => {
    try {
      const newProductId = await productsService.createProduct(productData);
      await refreshProducts(); // Refresh the list
      return newProductId;
    } catch (err) {
      setError('Failed to create product. Please try again.');
      throw err;
    }
  };

  // Update product
  const updateProduct = async (id: string, productData: ProductData): Promise<void> => {
    try {
      await productsService.updateProduct(id, productData);
      await refreshProducts(); // Refresh the list
    } catch (err) {
      setError('Failed to update product. Please try again.');
      throw err;
    }
  };

  // Delete product (deactivates it)
  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await productsService.deleteProduct(id);
      await refreshProducts(); // Refresh the list
    } catch (err) {
      setError('Failed to delete product. Please try again.');
      throw err;
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    // Data
    products,
    categories,
    loading,
    error,
    
    // Filters
    searchTerm,
    selectedCategoryId,
    
    // Pagination
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    
    // Sorting
    sortBy,
    sortDirection,
    
    // Actions
    handleSearchChange,
    handleCategoryChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    clearFilters,
    fetchProducts,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
    
    // Computed values
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex: (currentPage - 1) * pageSize + 1,
    endIndex: Math.min(currentPage * pageSize, totalCount)
  };
};

export default useProducts;
