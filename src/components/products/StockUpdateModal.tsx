import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface Product {
  id: string;
  name: string;
  stockQuantity: number;
  sku: string;
}

interface StockUpdateModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (newQuantity: number, reason?: string) => void;
  product: Product | null;
  isLoading?: boolean;
  error?: string | null;
}

export const StockUpdateModal: React.FC<StockUpdateModalProps> = ({
  show,
  onClose,
  onSave,
  product,
  isLoading = false,
  error = null
}) => {
  const [newQuantity, setNewQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (product && show) {
      setNewQuantity(product.stockQuantity.toString());
      setReason('');
      setValidationError(null);
    }
  }, [product, show]);

  const handleClose = () => {
    setNewQuantity('');
    setReason('');
    setValidationError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 0) {
      setValidationError('Please enter a valid quantity (0 or greater)');
      return;
    }

    setValidationError(null);
    onSave(quantity, reason.trim() || undefined);
  };

  if (!product) return null;

  const difference = parseInt(newQuantity) - product.stockQuantity;
  const isIncrease = difference > 0;
  const isDecrease = difference < 0;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Stock - {product.name}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible>
              {error}
            </Alert>
          )}

          <div className="mb-3 p-3 bg-light rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">SKU:</span>
              <strong>{product.sku}</strong>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">Current Stock:</span>
              <strong className="text-primary">{product.stockQuantity} units</strong>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>
              New Stock Quantity <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              isInvalid={!!validationError}
              disabled={isLoading}
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              {validationError}
            </Form.Control.Feedback>
          </Form.Group>

          {!isNaN(parseInt(newQuantity)) && difference !== 0 && (
            <Alert variant={isIncrease ? 'success' : 'warning'} className="mb-3">
              <div className="d-flex align-items-center">
                <i className={`bi ${isIncrease ? 'bi-arrow-up-circle' : 'bi-arrow-down-circle'} me-2`}></i>
                <span>
                  {isIncrease ? 'Increase' : 'Decrease'} of <strong>{Math.abs(difference)} units</strong>
                </span>
              </div>
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Reason (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="e.g., Stock received, Inventory adjustment, Damaged goods..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
            />
            <Form.Text className="text-muted">
              Adding a reason helps track stock changes
            </Form.Text>
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
                Updating...
              </>
            ) : (
              'Update Stock'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StockUpdateModal;
