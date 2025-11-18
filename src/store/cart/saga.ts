import { call, put, takeEvery, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import type { AxiosError } from 'axios';
import apiClient from '../../services/apiClient';
import {
  CHECKOUT_REQUEST,
  SAVE_CART_REQUEST,
  LOAD_CART_REQUEST,
  checkoutSuccess,
  checkoutFailure,
  saveCartSuccess,
  saveCartFailure,
  loadCartSuccess,
  loadCartFailure,
  clearCart
} from './actions';
import { CheckoutPayload, CartState, CartItem } from './types';
import type { RootState } from '../index';

// Worker saga for checkout
function* checkoutSaga(action: PayloadAction<CheckoutPayload>): SagaIterator {
  try {
    const checkoutData = action.payload;

    // Call the checkout API
    const response: { data: { orderId: string; message: string } } = yield call(
      apiClient.post,
      '/api/orders/checkout',
      checkoutData
    );

    // Clear cart after successful checkout
    yield put(clearCart());

    // Dispatch success action
    yield put(checkoutSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message ?? 'Checkout failed. Please try again.';
    yield put(checkoutFailure(errorMessage));
  }
}

// Worker saga for saving cart to server
function* saveCartSaga(): SagaIterator {
  try {
    // Get current cart state
    const cartState: CartState = yield select((state: RootState) => state.cart);

    // Save cart to server
    yield call(
      apiClient.post,
      '/api/cart/save',
      {
        items: cartState.items,
        total: cartState.total,
        itemCount: cartState.itemCount
      }
    );

    yield put(saveCartSuccess());
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message ?? 'Failed to save cart';
    yield put(saveCartFailure(errorMessage));
  }
}

// Worker saga for loading cart from server
function* loadCartSaga(): SagaIterator {
  try {
    // Load cart from server
    const response: { data: { items: CartItem[] } } = yield call(
      apiClient.get,
      '/api/cart/load'
    );

    yield put(loadCartSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message ?? 'Failed to load cart';
    yield put(loadCartFailure(errorMessage));
  }
}

// Watcher sagas
export function* watchCheckout() {
  yield takeEvery(CHECKOUT_REQUEST, checkoutSaga);
}

export function* watchSaveCart() {
  yield takeEvery(SAVE_CART_REQUEST, saveCartSaga);
}

export function* watchLoadCart() {
  yield takeEvery(LOAD_CART_REQUEST, loadCartSaga);
}

// Root cart saga
export function* cartSaga() {
  yield* [
    watchCheckout(),
    watchSaveCart(),
    watchLoadCart(),
  ];
}
