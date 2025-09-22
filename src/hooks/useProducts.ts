import { useState, useEffect, useCallback } from 'react';
import productsService from '../services/productsService';
import categoriesService from '../services/categoriesService';

interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  categoryId?: string | number;
  categoryName?: string;
  category?: string;
  imageUrl?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Category {
  id: string | number;
  name: string;
  description?: string;
}

interface ProductsParams {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  searchTerm?: string;
  categoryId?: string | number;
}

interface ProductsResponse {
  data?: Product[];
  products?: Product[];
  totalCount?: number;
  totalPages?: number;
}

interface ProductData {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  categoryId?: string | number;
  imageUrl?: string;
  stock?: number;
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
  
  // Sorting state
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
  }, [debouncedSearchTerm, selectedCategoryId, sortBy, sortDirection]);

  // Fetch products
  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const params: ProductsParams = {
        page: currentPage,
        pageSize: pageSize,
        sortBy: sortBy,
        sortDirection: sortDirection
      };

      // Add optional filters
      if (debouncedSearchTerm.trim()) {
        params.searchTerm = debouncedSearchTerm.trim();
      }

      if (selectedCategoryId) {
        params.categoryId = selectedCategoryId;
      }

      const response: ProductsResponse | Product[] = await productsService.getAllProducts(params);
      
      // Handle different response formats
      if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        // Paginated response
        setProducts(response.data);
        setTotalCount(response.totalCount || 0);
        setTotalPages(response.totalPages || Math.ceil((response.totalCount || 0) / pageSize));
      } else if (Array.isArray(response)) {
        // Simple array response
        setProducts(response);
        setTotalCount(response.length);
        setTotalPages(Math.ceil(response.length / pageSize));
      } else if (response && typeof response === 'object' && 'products' in response) {
        // Single response format
        setProducts(response.products || []);
        setTotalCount(response.totalCount || 0);
        setTotalPages(response.totalPages || Math.ceil((response.totalCount || 0) / pageSize));
      }

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
  const createProduct = async (productData: ProductData): Promise<Product> => {
    try {
      const newProduct = await productsService.createProduct(productData);
      await refreshProducts(); // Refresh the list
      return newProduct;
    } catch (err) {
      setError('Failed to create product. Please try again.');
      throw err;
    }
  };

  // Update product
  const updateProduct = async (id: string | number, productData: ProductData): Promise<Product> => {
    try {
      const updatedProduct = await productsService.updateProduct(id, productData);
      await refreshProducts(); // Refresh the list
      return updatedProduct;
    } catch (err) {
      setError('Failed to update product. Please try again.');
      throw err;
    }
  };

  // Delete product
  const deleteProduct = async (id: string | number): Promise<void> => {
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
