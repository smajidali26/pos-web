import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import type { Size } from '../../services/sizesService';

interface SizeModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => Promise<void>;
  size?: Size | null;
  isLoading?: boolean;
  error?: string | null;
}

const SizeModal: React.FC<SizeModalProps> = ({
  show,
  onClose,
  onSave,
  size,
  isLoading = false,
  error = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (show) {
      if (size) {
        // Edit mode
        setFormData({
          name: size.name,
          description: size.description
        });
      } else {
        // Create mode
        setFormData({
          name: '',
          description: ''
        });
      }
      setValidated(false);
    }
  }, [show, size]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    try {
      await onSave(formData);
    } catch (err) {
      // Error handled by parent component
      console.error('Error saving size:', err);
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={!isLoading}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton={!isLoading}>
          <Modal.Title>
            {size ? 'Edit Size' : 'Add New Size'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Size Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Small, Medium, Large, 1L, 500ml, XL"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isLoading}
              maxLength={100}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a size name.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Optional description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
              maxLength={500}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              size ? 'Update Size' : 'Create Size'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SizeModal;
