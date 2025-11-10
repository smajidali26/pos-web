import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import usersService from '../../services/usersService';
import { toast } from 'react-toastify';
import { CreateUserModal } from './CreateUserModal';
import { ResetPasswordModal } from './ResetPasswordModal';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: number;
  roleName: string;
  isActive: boolean;
  lastLoginDate?: string;
  createdAt: string;
}

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersService.getAllUsers();
      setUsers(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: User) => {
    try {
      await usersService.toggleUserStatus(user.id, !user.isActive);
      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setShowResetPasswordModal(true);
  };

  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleUserCreated = () => {
    setShowCreateModal(false);
    fetchUsers();
  };

  const handlePasswordReset = () => {
    setShowResetPasswordModal(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'owner':
        return 'danger';
      case 'manager':
        return 'primary';
      case 'cashier':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="bi bi-people me-2"></i>
            User Management
          </h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleCreateUser}>
            <i className="bi bi-person-plus me-2"></i>
            Create New User
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={getRoleBadgeVariant(user.roleName)}>
                          {user.roleName}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={user.isActive ? 'success' : 'danger'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        {user.lastLoginDate
                          ? new Date(user.lastLoginDate).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant={user.isActive ? 'warning' : 'success'}
                          className="me-2"
                          onClick={() => handleToggleStatus(user)}
                        >
                          <i className={`bi bi-${user.isActive ? 'x-circle' : 'check-circle'} me-1`}></i>
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleResetPassword(user)}
                        >
                          <i className="bi bi-key me-1"></i>
                          Reset Password
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <CreateUserModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={handleUserCreated}
      />

      {selectedUser && (
        <ResetPasswordModal
          show={showResetPasswordModal}
          user={selectedUser}
          onClose={() => {
            setShowResetPasswordModal(false);
            setSelectedUser(null);
          }}
          onPasswordReset={handlePasswordReset}
        />
      )}
    </Container>
  );
};
