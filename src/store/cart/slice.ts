import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, Product, UpdateQuantityPayload, CartItem } from './types';

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isProcessing: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        existingItem.quantity += 1;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
      } else {
        // Add new item to cart
        state.items.push({
          ...product,
          quantity: 1,
          subtotal: product.price
        });
      }
      
      // Recalculate totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + item.subtotal, 0);
    },
    
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      // Recalculate totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + item.subtotal, 0);
    },
    
    updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
        item.subtotal = item.quantity * item.price;
      }
      
      // Recalculate totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + item.subtotal, 0);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.error = null;
    },

    // Checkout actions
    checkoutRequest: (state) => {
      state.isProcessing = true;
      state.error = null;
    },
    checkoutSuccess: (state) => {
      state.isProcessing = false;
      state.error = null;
      // Cart is cleared by the saga
    },
    checkoutFailure: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.error = action.payload;
    },

    // Save cart actions
    saveCartRequest: (state) => {
      state.isProcessing = true;
      state.error = null;
    },
    saveCartSuccess: (state) => {
      state.isProcessing = false;
      state.error = null;
    },
    saveCartFailure: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.error = action.payload;
    },

    // Load cart actions
    loadCartRequest: (state) => {
      state.isProcessing = true;
      state.error = null;
    },
    loadCartSuccess: (state, action: PayloadAction<{ items: CartItem[] }>) => {
      state.isProcessing = false;
      state.error = null;
      state.items = action.payload.items;
      // Recalculate totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + item.subtotal, 0);
    },
    loadCartFailure: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  checkoutRequest,
  checkoutSuccess,
  checkoutFailure,
  saveCartRequest,
  saveCartSuccess,
  saveCartFailure,
  loadCartRequest,
  loadCartSuccess,
  loadCartFailure,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
