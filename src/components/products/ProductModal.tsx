import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { vendorsService, type Vendor } from '../../services/vendorsService';
import { sizesService, type Size } from '../../services/sizesService';

interface Product {
  id: string;
  name: string;
  description: string;
  sizeId?: string;
  sizeName?: string;
  sku: string;
  barcode: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
  reorderLevel: number;
  reorderQuantity: number;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  primaryVendorId?: string;
  primaryVendorName?: string;
}

interface ProductModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  product?: Product | null;
  categories: Array<{ id: string; name: string }>;
  isLoading?: boolean;
  error?: string | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  show,
  onClose,
  onSave,
  product,
  categories,
  isLoading = false,
  error = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    sizeId: '',
    price: '',
    cost: '',
    stockQuantity: '',
    minStockLevel: '',
    reorderLevel: '',
    reorderQuantity: '',
    description: '',
    sku: '',
    barcode: '',
    primaryVendorId: '',
    isActive: true
  });

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingSizes, setLoadingSizes] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load vendors and sizes when modal opens
  useEffect(() => {
    if (show) {
      loadVendors();
      loadSizes();
    }
  }, [show]);

  const loadVendors = async () => {
    try {
      setLoadingVendors(true);
      const data = await vendorsService.getAll(false); // Only active vendors
      setVendors(data);
    } catch (err) {
      console.error('Error loading vendors:', err);
    } finally {
      setLoadingVendors(false);
    }
  };

  const loadSizes = async () => {
    try {
      setLoadingSizes(true);
      const data = await sizesService.getAll();
      setSizes(data);
    } catch (err) {
      console.error('Error loading sizes:', err);
    } finally {
      setLoadingSizes(false);
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        categoryId: product.categoryId,
        sizeId: product.sizeId || '',
        price: product.price.toString(),
        cost: product.cost.toString(),
        stockQuantity: product.stockQuantity.toString(),
        minStockLevel: product.minStockLevel.toString(),
        reorderLevel: product.reorderLevel.toString(),
        reorderQuantity: product.reorderQuantity.toString(),
        description: product.description || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        primaryVendorId: product.primaryVendorId || '',
        isActive: product.isActive
      });
    } else {
      resetForm();
    }
  }, [product, show]);

  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      sizeId: '',
      price: '',
      cost: '',
      stockQuantity: '',
      minStockLevel: '',
      reorderLevel: '',
      reorderQuantity: '',
      description: '',
      sku: '',
      barcode: '',
      primaryVendorId: '',
      isActive: true
    });
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }

    // SKU only required for create, not update
    if (!product && !formData.sku.trim()) {
      errors.sku = 'SKU is required';
    }

    if (!formData.categoryId) {
      errors.categoryId = 'Category is required';
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      errors.price = 'Valid price is required';
    }

    const cost = parseFloat(formData.cost);
    if (isNaN(cost) || cost < 0) {
      errors.cost = 'Valid cost is required';
    }

    // Stock quantity only required for create
    if (!product) {
      const stockQuantity = parseInt(formData.stockQuantity);
      if (isNaN(stockQuantity) || stockQuantity < 0) {
        errors.stockQuantity = 'Valid stock quantity is required';
      }
    }

    if (formData.minStockLevel) {
      const minStock = parseInt(formData.minStockLevel);
      if (isNaN(minStock) || minStock < 0) {
        errors.minStockLevel = 'Invalid minimum stock level';
      }
    }

    if (!product && formData.reorderLevel) {
      const reorder = parseInt(formData.reorderLevel);
      if (isNaN(reorder) || reorder < 0) {
        errors.reorderLevel = 'Invalid reorder level';
      }
    }

    if (!product && formData.reorderQuantity) {
      const reorderQty = parseInt(formData.reorderQuantity);
      if (isNaN(reorderQty) || reorderQty < 0) {
        errors.reorderQuantity = 'Invalid reorder quantity';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Different data structure for create vs update
    // Update only accepts: name, description, size, price, cost, minStockLevel, categoryId
    // Create accepts all fields
    const productData = product ? {
      // Update data - limited fields
      name: formData.name.trim(),
      description: formData.description.trim() || '',
      sizeId: formData.sizeId || undefined,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      minStockLevel: formData.minStockLevel ? parseInt(formData.minStockLevel) : 0,
      categoryId: formData.categoryId
    } : {
      // Create data - all fields
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      sizeId: formData.sizeId || undefined,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      stockQuantity: parseInt(formData.stockQuantity),
      minStockLevel: formData.minStockLevel ? parseInt(formData.minStockLevel) : 0,
      reorderLevel: formData.reorderLevel ? parseInt(formData.reorderLevel) : 0,
      reorderQuantity: formData.reorderQuantity ? parseInt(formData.reorderQuantity) : 0,
      description: formData.description.trim() || '',
      sku: formData.sku.trim(),
      barcode: formData.barcode.trim() || '',
      primaryVendorId: formData.primaryVendorId || undefined,
      isActive: formData.isActive
    };

    onSave(productData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {product ? 'Edit Product' : 'Add New Product'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible>
              {error}
            </Alert>
          )}

          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Product Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  isInvalid={!!validationErrors.name}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Category <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  isInvalid={!!validationErrors.categoryId}
                  disabled={isLoading}
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.categoryId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Size</Form.Label>
                <Form.Select
                  value={formData.sizeId}
                  onChange={(e) => setFormData({ ...formData, sizeId: e.target.value })}
                  disabled={isLoading || loadingSizes}
                >
                  <option value="">No size</option>
                  {sizes.map(size => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </Form.Select>
                {loadingSizes && (
                  <Form.Text className="text-muted">
                    Loading sizes...
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Primary Vendor</Form.Label>
                <Form.Select
                  value={formData.primaryVendorId}
                  onChange={(e) => setFormData({ ...formData, primaryVendorId: e.target.value })}
                  disabled={isLoading || loadingVendors || !!product}
                >
                  <option value="">No vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} - {vendor.companyName}
                    </option>
                  ))}
                </Form.Select>
                {product && (
                  <Form.Text className="text-muted">
                    Vendor cannot be changed after creation
                  </Form.Text>
                )}
                {loadingVendors && (
                  <Form.Text className="text-muted">
                    Loading vendors...
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  SKU <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Product SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  isInvalid={!!validationErrors.sku}
                  disabled={isLoading || !!product}
                  readOnly={!!product}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.sku}
                </Form.Control.Feedback>
                {product && (
                  <Form.Text className="text-muted">
                    SKU cannot be changed after creation
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Barcode</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Product barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  disabled={isLoading || !!product}
                  readOnly={!!product}
                />
                {product && (
                  <Form.Text className="text-muted">
                    Barcode cannot be changed after creation
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Price <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  isInvalid={!!validationErrors.price}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Cost <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  isInvalid={!!validationErrors.cost}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.cost}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Stock Quantity <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  isInvalid={!!validationErrors.stockQuantity}
                  disabled={isLoading || !!product}
                  readOnly={!!product}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.stockQuantity}
                </Form.Control.Feedback>
                {product && (
                  <Form.Text className="text-muted">
                    Use stock management features to update quantity
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Min Stock Level</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="10"
                  value={formData.minStockLevel}
                  onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                  isInvalid={!!validationErrors.minStockLevel}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.minStockLevel}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Reorder Level</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="20"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                  isInvalid={!!validationErrors.reorderLevel}
                  disabled={isLoading || !!product}
                  readOnly={!!product}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.reorderLevel}
                </Form.Control.Feedback>
                {product && (
                  <Form.Text className="text-muted">
                    Cannot be changed after creation
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Reorder Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="50"
                  value={formData.reorderQuantity}
                  onChange={(e) => setFormData({ ...formData, reorderQuantity: e.target.value })}
                  isInvalid={!!validationErrors.reorderQuantity}
                  disabled={isLoading || !!product}
                  readOnly={!!product}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.reorderQuantity}
                </Form.Control.Feedback>
                {product && (
                  <Form.Text className="text-muted">
                    Cannot be changed after creation
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Product description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Active"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              disabled={isLoading || !!product}
            />
            {product && (
              <Form.Text className="text-muted d-block">
                Use Activate/Deactivate buttons to change product status
              </Form.Text>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              product ? 'Update Product' : 'Create Product'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProductModal;
