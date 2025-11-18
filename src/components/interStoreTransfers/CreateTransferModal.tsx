import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Table } from 'react-bootstrap';
import { useInterStoreTransfers } from '../../hooks/useInterStoreTransfers';
import { useStores } from '../../hooks/useStores';
import productsService, { Product } from '../../services/productsService';
import { CreateTransferItemRequest } from '../../types/interStoreTransfer';

interface CreateTransferModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface TransferItemForm extends CreateTransferItemRequest {
  product?: Product;
}

export const CreateTransferModal: React.FC<CreateTransferModalProps> = ({
  show,
  onClose,
  onSuccess
}) => {
  const { createTransfer, isLoading, error, clearErrorMessage } = useInterStoreTransfers();
  const { stores, fetchStores } = useStores();

  const [fromStoreId, setFromStoreId] = useState('');
  const [toStoreId, setToStoreId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<TransferItemForm[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (stores.length === 0) {
      fetchStores({ pageSize: 1000 });
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (show) {
      clearErrorMessage();
      setValidationErrors({});
    }
  }, [show, clearErrorMessage]);

  const loadProducts = async () => {
    try {
      const response = await productsService.getAllProducts({ pageSize: 1000, isActive: true });
      setProducts(response.items);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fromStoreId) {
      errors.fromStore = 'Source store is required';
    }

    if (!toStoreId) {
      errors.toStore = 'Destination store is required';
    }

    if (fromStoreId && toStoreId && fromStoreId === toStoreId) {
      errors.toStore = 'Destination store must be different from source store';
    }

    if (items.length === 0) {
      errors.items = 'At least one item is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddItem = () => {
    if (!selectedProductId || quantity <= 0) {
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    // Check if item already exists
    const existingIndex = items.findIndex(item => item.productId === selectedProductId);
    if (existingIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingIndex].quantity += quantity;
      setItems(updatedItems);
    } else {
      setItems([...items, {
        productId: selectedProductId,
        quantity,
        product
      }]);
    }

    setSelectedProductId('');
    setQuantity(1);
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    const updatedItems = items.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const transferData = {
      fromStoreId,
      toStoreId,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      notes: notes || undefined
    };

    createTransfer(transferData);

    // Wait a bit for the action to complete
    setTimeout(() => {
      if (!error) {
        onSuccess();
        resetForm();
      }
    }, 500);
  };

  const resetForm = () => {
    setFromStoreId('');
    setToStoreId('');
    setNotes('');
    setItems([]);
    setSelectedProductId('');
    setQuantity(1);
    setValidationErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const activeStores = stores.filter(s => s.isActive);

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Create Transfer</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>From Store <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={fromStoreId}
                  onChange={(e) => setFromStoreId(e.target.value)}
                  isInvalid={!!validationErrors.fromStore}
                >
                  <option value="">Select source store...</option>
                  {activeStores.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name} ({store.code})
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.fromStore}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>To Store <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={toStoreId}
                  onChange={(e) => setToStoreId(e.target.value)}
                  isInvalid={!!validationErrors.toStore}
                >
                  <option value="">Select destination store...</option>
                  {activeStores.filter(s => s.id !== fromStoreId).map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name} ({store.code})
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.toStore}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes about this transfer..."
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />

          <h5 className="mb-3">Add Items</h5>
          <Row className="mb-3">
            <Col md={7}>
              <Form.Group>
                <Form.Label>Product</Form.Label>
                <Form.Select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  <option value="">Select product...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Stock: {product.stockQuantity})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button
                variant="primary"
                onClick={handleAddItem}
                disabled={!selectedProductId || quantity <= 0}
                className="w-100"
              >
                <i className="bi bi-plus-lg me-1"></i>
                Add
              </Button>
            </Col>
          </Row>

          {validationErrors.items && (
            <Alert variant="danger">{validationErrors.items}</Alert>
          )}

          {items.length > 0 && (
            <>
              <h5 className="mb-3">Transfer Items ({items.length})</h5>
              <Table striped bordered size="sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th className="text-center">Available Stock</th>
                    <th style={{ width: '150px' }}>Quantity</th>
                    <th style={{ width: '80px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.product?.name}</td>
                      <td>{item.product?.sku}</td>
                      <td className="text-center">{item.product?.stockQuantity || 0}</td>
                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                          size="sm"
                        />
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Transfer'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateTransferModal;
