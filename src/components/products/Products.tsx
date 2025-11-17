import React, { useEffect, useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import useRoleAccess from '../../hooks/useRoleAccess';
import { Pagination } from '../common';
import ProductModal from './ProductModal';
import StockUpdateModal from './StockUpdateModal';
import productsService from '../../services/productsService';
import { formatCurrency } from '../../utils/currency';

const Products: React.FC = () => {
  const {
    products,
    categories,
    loading,
    error,
    searchTerm,
    selectedCategoryId,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    sortBy,
    sortDirection,
    handleSearchChange,
    handleCategoryChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    clearFilters,
    clearError,
    startIndex,
    endIndex,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProducts();

  const { canManageProducts } = useRoleAccess();

  // Store the permission check result
  const userCanManageProducts = canManageProducts();

  // Product Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Stock Update Modal state
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedStockProduct, setSelectedStockProduct] = useState<any>(null);
  const [stockModalLoading, setStockModalLoading] = useState(false);
  const [stockModalError, setStockModalError] = useState<string | null>(null);

  // Load products from API when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setModalError(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (product: any) => {
    setSelectedProduct(product);
    setModalError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setModalError(null);
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      setModalLoading(true);
      setModalError(null);

      if (selectedProduct) {
        // Update existing product
        await updateProduct(selectedProduct.id, productData);
      } else {
        // Create new product
        await createProduct(productData);
      }

      handleCloseModal();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setModalError(err.response?.data?.message || 'Failed to save product. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenStockModal = (product: any) => {
    setSelectedStockProduct(product);
    setStockModalError(null);
    setShowStockModal(true);
  };

  const handleCloseStockModal = () => {
    setShowStockModal(false);
    setSelectedStockProduct(null);
    setStockModalError(null);
  };

  const handleUpdateStock = async (newQuantity: number, reason?: string) => {
    try {
      setStockModalLoading(true);
      setStockModalError(null);

      await productsService.updateStock(selectedStockProduct.id, newQuantity, reason);
      await fetchProducts(); // Refresh the list

      handleCloseStockModal();
    } catch (err: any) {
      console.error('Error updating stock:', err);
      setStockModalError(err.response?.data?.message || 'Failed to update stock. Please try again.');
    } finally {
      setStockModalLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to deactivate "${name}"? You can reactivate it later.`)) {
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error('Error deactivating product:', err);
      }
    }
  };

  const getSortIcon = (field: string): string => {
    if (sortBy !== field) return 'bi-arrow-down-up';
    return sortDirection === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up';
  };

  const handleSort = (field: string) => {
    const newDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
    handleSortChange(field, newDirection);
  };

  if (loading && products.length === 0) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">
            <i className="bi bi-box me-2 text-primary"></i>
            Products
          </h2>
          <p className="text-muted mb-0">
            {userCanManageProducts ? 'Manage your product catalog' : 'Browse product catalog'}
          </p>
        </div>
        {userCanManageProducts && (
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <i className="bi bi-plus-circle me-2"></i>
            Add Product
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={clearError}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Search */}
            <div className="col-md-6 col-lg-4">
              <label htmlFor="searchInput" className="form-label">Search Products</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  id="searchInput"
                  type="text"
                  className="form-control"
                  placeholder="Search by name, description..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleSearchChange('')}
                    title="Clear search"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-md-6 col-lg-4">
              <label htmlFor="categoryFilter" className="form-label">Category</label>
              <select
                id="categoryFilter"
                className="form-select"
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="col-md-6 col-lg-2">
              <label htmlFor="sortSelect" className="form-label">Sort By</label>
              <select
                id="sortSelect"
                className="form-select"
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  handleSortChange(field, direction as 'asc' | 'desc');
                }}
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
                <option value="category-asc">Category A-Z</option>
                <option value="createdAt-desc">Newest First</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="col-md-6 col-lg-2">
              <label className="form-label">&nbsp;</label>
              <div>
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={clearFilters}
                  disabled={!searchTerm && !selectedCategoryId}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && products.length > 0 && (
        <>
          <div className="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
            {products.map((product) => (
              <div key={product.id} className="mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{product.name}</h6>
                    <p className="card-text text-muted small mb-2">
                      {product.sizeName && (
                        <>
                          {product.sizeName}
                          <span className="mx-1">|</span>
                        </>
                      )}
                      <i className="bi bi-tag me-1"></i>
                      {product.categoryName || 'Uncategorized'}
                    </p>
                    {product.sku && (
                      <p className="card-text text-muted small mb-2">
                        <i className="bi bi-upc me-1"></i>
                        {product.sku}
                      </p>
                    )}
                    {product.description && (
                      <p className="card-text text-muted small mb-3" style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {product.description}
                      </p>
                    )}
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <span className="h5 text-success mb-0">
                            {formatCurrency(product.price || 0)}
                          </span>
                        </div>
                        <span className={`badge ${product.stockQuantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      
                      {userCanManageProducts && (
                        <div className="btn-group w-100" role="group">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleOpenEditModal(product)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleOpenStockModal(product)}
                            title="Update Stock"
                          >
                            <i className="bi bi-box-seam"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={loading}
            />
          </div>
        </>
      )}

      {/* No Results */}
      {!loading && products.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-box text-muted" style={{ fontSize: '4rem' }}></i>
          <h4 className="text-muted mt-3">No products found</h4>
          <p className="text-muted">
            {searchTerm || selectedCategoryId ? (
              <>
                No products match your current filters.
                <br />
                <button className="btn btn-link p-0" onClick={clearFilters}>
                  Clear filters to see all products
                </button>
              </>
            ) : (
              'No products have been added yet.'
            )}
          </p>
          {userCanManageProducts && !searchTerm && !selectedCategoryId && (
            <button className="btn btn-primary mt-3" onClick={handleOpenAddModal}>
              <i className="bi bi-plus-circle me-2"></i>
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        product={selectedProduct}
        categories={categories}
        isLoading={modalLoading}
        error={modalError}
      />

      {/* Stock Update Modal */}
      <StockUpdateModal
        show={showStockModal}
        onClose={handleCloseStockModal}
        onSave={handleUpdateStock}
        product={selectedStockProduct}
        isLoading={stockModalLoading}
        error={stockModalError}
      />
    </div>
  );
};

export default Products;
