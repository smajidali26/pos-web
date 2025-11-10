import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface CategoryModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (category: any) => void;
  category?: Category | null;
  isLoading?: boolean;
  error?: string | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  show,
  onClose,
  onSave,
  category,
  isLoading = false,
  error = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        isActive: category.isActive
      });
    } else {
      resetForm();
    }
  }, [category, show]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Different data for create vs update
    // Update only accepts: name, description, parentCategoryId
    // Create accepts: name, description, isActive, parentCategoryId
    const categoryData = category ? {
      // Update data - limited fields
      name: formData.name.trim(),
      description: formData.description.trim() || ''
    } : {
      // Create data - all fields
      name: formData.name.trim(),
      description: formData.description.trim() || '',
      isActive: formData.isActive
    };

    onSave(categoryData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {category ? 'Edit Category' : 'Add New Category'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible>
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>
              Category Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              isInvalid={!!validationErrors.name}
              disabled={isLoading}
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Category description (optional)"
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
              disabled={isLoading || !!category}
            />
            {category && (
              <Form.Text className="text-muted d-block">
                Category status cannot be changed after creation
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
              category ? 'Update Category' : 'Create Category'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
