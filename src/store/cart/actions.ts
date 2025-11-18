import { createAction } from '@reduxjs/toolkit';
import { Product, CartItem, UpdateQuantityPayload, CheckoutPayload } from './types';

// Cart Action Types
export const ADD_TO_CART = 'cart/ADD_TO_CART';
export const REMOVE_FROM_CART = 'cart/REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'cart/UPDATE_QUANTITY';
export const CLEAR_CART = 'cart/CLEAR_CART';

export const CHECKOUT_REQUEST = 'cart/CHECKOUT_REQUEST';
export const CHECKOUT_SUCCESS = 'cart/CHECKOUT_SUCCESS';
export const CHECKOUT_FAILURE = 'cart/CHECKOUT_FAILURE';

export const SAVE_CART_REQUEST = 'cart/SAVE_CART_REQUEST';
export const SAVE_CART_SUCCESS = 'cart/SAVE_CART_SUCCESS';
export const SAVE_CART_FAILURE = 'cart/SAVE_CART_FAILURE';

export const LOAD_CART_REQUEST = 'cart/LOAD_CART_REQUEST';
export const LOAD_CART_SUCCESS = 'cart/LOAD_CART_SUCCESS';
export const LOAD_CART_FAILURE = 'cart/LOAD_CART_FAILURE';

// Action Creators
export const addToCart = createAction<Product>(ADD_TO_CART);
export const removeFromCart = createAction<string | number>(REMOVE_FROM_CART);
export const updateQuantity = createAction<UpdateQuantityPayload>(UPDATE_QUANTITY);
export const clearCart = createAction(CLEAR_CART);

export const checkoutRequest = createAction<CheckoutPayload>(CHECKOUT_REQUEST);
export const checkoutSuccess = createAction<{ orderId: string; message: string }>(CHECKOUT_SUCCESS);
export const checkoutFailure = createAction<string>(CHECKOUT_FAILURE);

export const saveCartRequest = createAction(SAVE_CART_REQUEST);
export const saveCartSuccess = createAction(SAVE_CART_SUCCESS);
export const saveCartFailure = createAction<string>(SAVE_CART_FAILURE);

export const loadCartRequest = createAction(LOAD_CART_REQUEST);
export const loadCartSuccess = createAction<{ items: CartItem[] }>(LOAD_CART_SUCCESS);
export const loadCartFailure = createAction<string>(LOAD_CART_FAILURE);
