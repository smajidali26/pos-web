import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { productsService } from '../../services/productsService';
import { categoriesService } from '../../services/categoriesService';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_CATEGORIES_REQUEST,
  ADD_PRODUCT_REQUEST,
  UPDATE_PRODUCT_REQUEST,
  DELETE_PRODUCT_REQUEST,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addProductSuccess,
  addProductFailure,
  updateProductSuccess,
  updateProductFailure,
  deleteProductSuccess,
  deleteProductFailure,
} from './actions';
import { 
  FetchProductsPayload, 
  AddProductPayload, 
  UpdateProductPayload
} from './types';

// API call wrappers to avoid saga typing issues
const getAllProductsApi = (params: any) => productsService.getAllProducts(params);
const getAllCategoriesApi = () => categoriesService.getAllCategories();
const createProductApi = (productData: any) => productsService.createProduct(productData);
const updateProductApi = (id: number, productData: any) => productsService.updateProduct(id, productData);
const deleteProductApi = (id: number) => productsService.deleteProduct(id);

// Worker saga for fetching products
function* fetchProductsSaga(action: PayloadAction<FetchProductsPayload>) {
  try {
    const params = action.payload;
    
    // Call the products service
    const response: any = yield call(getAllProductsApi, params);
    
    // Dispatch success action
    yield put(fetchProductsSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Failed to fetch products';
    yield put(fetchProductsFailure(errorMessage));
  }
}

// Worker saga for fetching categories
function* fetchCategoriesSaga() {
  try {
    // Call the categories service
    const response: any = yield call(getAllCategoriesApi);
    
    // Dispatch success action
    yield put(fetchCategoriesSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Failed to fetch categories';
    yield put(fetchCategoriesFailure(errorMessage));
  }
}

// Worker saga for adding product
function* addProductSaga(action: PayloadAction<AddProductPayload>) {
  try {
    const productData = action.payload;
    
    // Call the products service
    const response: any = yield call(createProductApi, productData);
    
    // Dispatch success action
    yield put(addProductSuccess(response));
    
    // Optionally refetch products
    yield put({ type: FETCH_PRODUCTS_REQUEST, payload: {} });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Failed to add product';
    yield put(addProductFailure(errorMessage));
  }
}

// Worker saga for updating product
function* updateProductSaga(action: PayloadAction<UpdateProductPayload>) {
  try {
    const { id, ...productData } = action.payload;
    
    // Call the products service
    const response: any = yield call(updateProductApi, id, productData);
    
    // Dispatch success action
    yield put(updateProductSuccess(response));
    
    // Optionally refetch products
    yield put({ type: FETCH_PRODUCTS_REQUEST, payload: {} });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Failed to update product';
    yield put(updateProductFailure(errorMessage));
  }
}

// Worker saga for deleting product
function* deleteProductSaga(action: PayloadAction<number>) {
  try {
    const productId = action.payload;
    
    // Call the products service
    yield call(deleteProductApi, productId);
    
    // Dispatch success action
    yield put(deleteProductSuccess(productId));
    
    // Optionally refetch products
    yield put({ type: FETCH_PRODUCTS_REQUEST, payload: {} });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Failed to delete product';
    yield put(deleteProductFailure(errorMessage));
  }
}

// Watcher sagas
export function* watchFetchProducts() {
  yield takeLatest(FETCH_PRODUCTS_REQUEST, fetchProductsSaga);
}

export function* watchFetchCategories() {
  yield takeEvery(FETCH_CATEGORIES_REQUEST, fetchCategoriesSaga);
}

export function* watchAddProduct() {
  yield takeEvery(ADD_PRODUCT_REQUEST, addProductSaga);
}

export function* watchUpdateProduct() {
  yield takeEvery(UPDATE_PRODUCT_REQUEST, updateProductSaga);
}

export function* watchDeleteProduct() {
  yield takeEvery(DELETE_PRODUCT_REQUEST, deleteProductSaga);
}

// Root products saga
export function* productsSaga() {
  yield* [
    watchFetchProducts(),
    watchFetchCategories(),
    watchAddProduct(),
    watchUpdateProduct(),
    watchDeleteProduct(),
  ];
}
