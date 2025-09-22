import type { RootState } from './index';
import type { CartItem } from './cart/types';

// Cart Selectors
export const selectCartItems = (state: RootState): CartItem[] => state.cart.items;

export const selectCartTotal = (state: RootState): number => state.cart.total;

export const selectCartItemCount = (state: RootState): number => state.cart.itemCount;

export const selectCartIsEmpty = (state: RootState): boolean => state.cart.items.length === 0;

// Auth Selectors
export const selectUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;

export const selectAuthError = (state: RootState): string | null => state.auth.error;

export const selectIsLoading = (state: RootState): boolean => state.auth.isLoading;