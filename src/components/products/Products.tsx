import React, { useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import useRoleAccess from '../../hooks/useRoleAccess';
import { Pagination } from '../common';

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
    deleteProduct
  } = useProducts();

  const { canManageProducts } = useRoleAccess();

  // Store the permission check result
  const userCanManageProducts = canManageProducts();

  // Load products from API when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string | number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error('Error deleting product:', err);
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
          <button className="btn btn-primary">
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
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      className="card-img-top" 
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted small mb-2">
                      <i className="bi bi-tag me-1"></i>
                      {product.categoryName || product.category || 'Uncategorized'}
                    </p>
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
                            ${(product.price || 0).toFixed(2)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-muted text-decoration-line-through ms-2 small">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.stock !== undefined && (
                          <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        )}
                      </div>
                      
                      {userCanManageProducts && (
                        <div className="d-flex gap-2">
                          <button className="btn btn-outline-primary btn-sm flex-fill">
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
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
            <button className="btn btn-primary mt-3">
              <i className="bi bi-plus-circle me-2"></i>
              Add Your First Product
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
