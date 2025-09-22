import { useState, useEffect } from 'react';
import categoriesService from '../services/categoriesService';

interface Category {
  id: string | number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryData {
  name: string;
  description?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all categories
  const fetchCategories = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new category
  const createCategory = async (categoryData: CategoryData): Promise<Category> => {
    try {
      const createdCategory = await categoriesService.createCategory(categoryData);
      setCategories(prev => [...prev, createdCategory]);
      setError(null);
      return createdCategory;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data?.message || 'Failed to create category. Please try again.';
      setError(errorMessage);
      throw err;
    }
  };

  // Update category
  const updateCategory = async (id: string | number, categoryData: CategoryData): Promise<Category> => {
    try {
      const updatedCategory = await categoriesService.updateCategory(id, categoryData);
      setCategories(prev => prev.map(cat => 
        cat.id === id ? updatedCategory : cat
      ));
      setError(null);
      return updatedCategory;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data?.message || 'Failed to update category. Please try again.';
      setError(errorMessage);
      throw err;
    }
  };

  // Delete category
  const deleteCategory = async (id: string | number): Promise<void> => {
    try {
      await categoriesService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setError(null);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data?.message || 'Failed to delete category. Please try again.';
      setError(errorMessage);
      throw err;
    }
  };

  // Get category by ID
  const getCategoryById = async (id: string | number): Promise<Category> => {
    try {
      const category = await categoriesService.getCategoryById(id);
      return category;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data?.message || 'Failed to fetch category details.';
      setError(errorMessage);
      throw err;
    }
  };

  // Clear error
  const clearError = (): void => {
    setError(null);
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    clearError,
  };
};

export default useCategories;
