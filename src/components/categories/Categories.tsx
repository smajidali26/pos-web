import React from 'react';
import useCategories from '../../hooks/useCategories';
import useRoleAccess from '../../hooks/useRoleAccess';

const Categories: React.FC = () => {
  const { categories, loading, error } = useCategories();
  const { canManageCategories } = useRoleAccess();
  const userCanManageCategories = canManageCategories();

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">
            <i className="bi bi-tags me-2 text-primary"></i>
            Categories
          </h2>
          <p className="text-muted mb-0">
            {userCanManageCategories ? 'Manage product categories' : 'Browse product categories'}
          </p>
        </div>
        {userCanManageCategories && (
          <button className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Add Category
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
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading categories...</span>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {!loading && (
        <div className="row">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="flex-shrink-0">
                        <i className="bi bi-tag text-primary" style={{ fontSize: '2rem' }}></i>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h5 className="card-title mb-1">{category.name}</h5>
                        <small className="text-muted">ID: {category.id}</small>
                      </div>
                    </div>
                    
                    {category.description && (
                      <p className="card-text text-muted mb-3">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-secondary">
                        0 products {/* This would come from a products count */}
                      </span>
                      
                      {userCanManageCategories && (
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" title="Edit Category">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-outline-danger" title="Delete Category">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5">
                <i className="bi bi-tags text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="text-muted mt-3">No categories found</h4>
                <p className="text-muted">
                  {userCanManageCategories ? (
                    <>
                      Start organizing your products by creating categories.
                      <br />
                      <button className="btn btn-primary mt-3">
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Your First Category
                      </button>
                    </>
                  ) : (
                    'No categories have been created yet.'
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sample Categories (when no API data) */}
      {!loading && categories.length === 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Sample Categories:</strong> Here are some example categories you might create:
            </div>
          </div>
          
          {/* Sample Category Cards */}
          {[
            { name: 'Electronics', icon: 'bi-laptop', description: 'Computers, phones, and electronic devices' },
            { name: 'Clothing', icon: 'bi-bag', description: 'Apparel and fashion items' },
            { name: 'Food & Beverages', icon: 'bi-cup-straw', description: 'Food items and drinks' },
            { name: 'Books', icon: 'bi-book', description: 'Books and reading materials' },
            { name: 'Sports & Outdoor', icon: 'bi-bicycle', description: 'Sports equipment and outdoor gear' },
            { name: 'Home & Garden', icon: 'bi-house', description: 'Home improvement and garden supplies' }
          ].map((sample, index) => (
            <div key={index} className="col-md-6 col-lg-4 col-xl-3 mb-4">
              <div className="card h-100 border-0 shadow-sm opacity-75">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0">
                      <i className={`bi ${sample.icon} text-secondary`} style={{ fontSize: '2rem' }}></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="card-title mb-1 text-muted">{sample.name}</h5>
                      <small className="text-muted">Sample category</small>
                    </div>
                  </div>
                  
                  <p className="card-text text-muted mb-3">
                    {sample.description}
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-light text-dark">
                      Sample
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
