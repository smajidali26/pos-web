import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import usersService, { ResetPasswordRequest } from '../../services/usersService';
import { toast } from 'react-toastify';

interface User {
  id: string;
  username: string;
  fullName: string;
}

interface ResetPasswordModalProps {
  show: boolean;
  user: User;
  onClose: () => void;
  onPasswordReset: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  show,
  user,
  onClose,
  onPasswordReset
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const request: ResetPasswordRequest = {
        userId: user.id,
        newPassword,
        confirmPassword
      };

      await usersService.resetPassword(request);

      toast.success(`Password reset successfully for ${user.username}!`);
      handleReset();
      onPasswordReset();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-key me-2"></i>
          Reset Password
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Alert variant="info">
            <i className="bi bi-info-circle me-2"></i>
            You are resetting the password for user: <strong>{user.fullName}</strong> ({user.username})
          </Alert>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
            <Form.Text className="text-muted">
              Must be at least 6 characters with uppercase, lowercase, and number
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </Form.Group>

          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <small>
              This will reset the password without requiring the current password.
              The user will be able to login with the new password immediately.
            </small>
          </Alert>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Resetting...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Reset Password
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
