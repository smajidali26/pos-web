import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { authReducer } from './auth';
import { cartReducer } from './cart';
import { productsReducer } from './products';
import customersReducer from './customers/customersSlice';
import ordersReducer from './orders/ordersSlice';
import reportsReducer from './reports/reportsSlice';
import storesReducer from './stores/storesSlice';
import transfersReducer from './interStoreTransfers/transfersSlice';
import loyaltyReducer from './loyalty/loyaltySlice';
import analyticsReducer from './analytics/analyticsSlice';
import rootSaga from './sagas';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    customers: customersReducer,
    orders: ordersReducer,
    reports: reportsReducer,
    stores: storesReducer,
    interStoreTransfers: transfersReducer,
    loyalty: loyaltyReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disable thunk since we're using saga
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(sagaMiddleware),
});

// Run the root saga
sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Make store available globally for apiClient
declare global {
  interface Window {
    store: typeof store;
  }
}
window.store = store;

export default store;
