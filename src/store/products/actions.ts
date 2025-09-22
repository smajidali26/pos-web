import { createAction } from '@reduxjs/toolkit';
import { 
  FetchProductsPayload, 
  ProductsResponse, 
  AddProductPayload, 
  UpdateProductPayload, 
  UpdateStockPayload,
  ProductResponse,
  CategoriesResponse,
  Category
} from './types';

// Products Action Types
export const FETCH_PRODUCTS_REQUEST = 'products/FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'products/FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'products/FETCH_PRODUCTS_FAILURE';

export const FETCH_CATEGORIES_REQUEST = 'products/FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'products/FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'products/FETCH_CATEGORIES_FAILURE';

export const ADD_PRODUCT_REQUEST = 'products/ADD_PRODUCT_REQUEST';
export const ADD_PRODUCT_SUCCESS = 'products/ADD_PRODUCT_SUCCESS';
export const ADD_PRODUCT_FAILURE = 'products/ADD_PRODUCT_FAILURE';

export const UPDATE_PRODUCT_REQUEST = 'products/UPDATE_PRODUCT_REQUEST';
export const UPDATE_PRODUCT_SUCCESS = 'products/UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_FAILURE = 'products/UPDATE_PRODUCT_FAILURE';

export const DELETE_PRODUCT_REQUEST = 'products/DELETE_PRODUCT_REQUEST';
export const DELETE_PRODUCT_SUCCESS = 'products/DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_FAILURE = 'products/DELETE_PRODUCT_FAILURE';

export const SET_SELECTED_CATEGORY = 'products/SET_SELECTED_CATEGORY';
export const SET_SEARCH_TERM = 'products/SET_SEARCH_TERM';
export const SET_PAGE = 'products/SET_PAGE';
export const SET_PAGE_SIZE = 'products/SET_PAGE_SIZE';
export const SET_SORT = 'products/SET_SORT';
export const UPDATE_STOCK = 'products/UPDATE_STOCK';

// Action Creators
export const fetchProductsRequest = createAction<FetchProductsPayload>(FETCH_PRODUCTS_REQUEST);
export const fetchProductsSuccess = createAction<ProductsResponse>(FETCH_PRODUCTS_SUCCESS);
export const fetchProductsFailure = createAction<string>(FETCH_PRODUCTS_FAILURE);

export const fetchCategoriesRequest = createAction(FETCH_CATEGORIES_REQUEST);
export const fetchCategoriesSuccess = createAction<CategoriesResponse>(FETCH_CATEGORIES_SUCCESS);
export const fetchCategoriesFailure = createAction<string>(FETCH_CATEGORIES_FAILURE);

export const addProductRequest = createAction<AddProductPayload>(ADD_PRODUCT_REQUEST);
export const addProductSuccess = createAction<ProductResponse>(ADD_PRODUCT_SUCCESS);
export const addProductFailure = createAction<string>(ADD_PRODUCT_FAILURE);

export const updateProductRequest = createAction<UpdateProductPayload>(UPDATE_PRODUCT_REQUEST);
export const updateProductSuccess = createAction<ProductResponse>(UPDATE_PRODUCT_SUCCESS);
export const updateProductFailure = createAction<string>(UPDATE_PRODUCT_FAILURE);

export const deleteProductRequest = createAction<number>(DELETE_PRODUCT_REQUEST);
export const deleteProductSuccess = createAction<number>(DELETE_PRODUCT_SUCCESS);
export const deleteProductFailure = createAction<string>(DELETE_PRODUCT_FAILURE);

export const setSelectedCategory = createAction<string>(SET_SELECTED_CATEGORY);
export const setSearchTerm = createAction<string>(SET_SEARCH_TERM);
export const setPage = createAction<number>(SET_PAGE);
export const setPageSize = createAction<number>(SET_PAGE_SIZE);
export const setSort = createAction<{ sortBy: string; sortDirection: 'asc' | 'desc' }>(SET_SORT);
export const updateStock = createAction<UpdateStockPayload>(UPDATE_STOCK);
