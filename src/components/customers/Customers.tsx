import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, InputGroup } from 'react-bootstrap';
import { useCustomers } from '../../hooks/useCustomers';
import { CustomerModal } from './CustomerModal';
import { Customer } from '../../services/customersService';
import Pagination from '../common/Pagination';
import { formatCurrency } from '../../utils/currency';

export const Customers: React.FC = () => {
  const {
    customers,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    isLoading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    clearSearchResults,
    clearErrorMessage,
    changePage
  } = useCustomers();

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    if (customers.length === 0 && !isLoading) {
      fetchCustomers();
    }
  }, []);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete {formatCurrency(customer.firstName} {formatCurrency(customer.lastName}?`)) {
      deleteCustomer(customer.id);
    }
  };

  const handleSaveCustomer = (customerData: any) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
    } else {
      createCustomer(customerData);
    }
    setShowModal(false);
    setEditingCustomer(null);

    // Refresh list after save
    setTimeout(() => {
      fetchCustomers({ page: currentPage, pageSize });
    }, 500);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= 2) {
      searchCustomers(value);
    } else if (value.length === 0) {
      clearSearchResults();
      fetchCustomers();
    }
  };

  const handleFilterChange = (filter: 'all' | 'active' | 'inactive') => {
    setFilterActive(filter);
    const isActive = filter === 'all' ? undefined : filter === 'active';
    fetchCustomers({ page: 1, pageSize, isActive });
  };

  const handlePageChange = (page: number) => {
    changePage(page);
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `({formatCurrency(match[1]}) {formatCurrency(match[2]}-{formatCurrency(match[3]}`;
    }
    return phone;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Customer Management</h2>
          <p className="text-muted">Manage your customer database and loyalty program</p>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search customers by name, email, or phone..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
            </Col>

            <Col md={4}>
              <div className="btn-group" role="group">
                <Button
                  variant={filterActive === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => handleFilterChange('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterActive === 'active' ? 'success' : 'outline-success'}
                  onClick={() => handleFilterChange('active')}
                  size="sm"
                >
                  Active
                </Button>
                <Button
                  variant={filterActive === 'inactive' ? 'secondary' : 'outline-secondary'}
                  onClick={() => handleFilterChange('inactive')}
                  size="sm"
                >
                  Inactive
                </Button>
              </div>
            </Col>

            <Col md={4} className="text-end">
              <Button variant="primary" onClick={handleAddCustomer}>
                <i className="bi bi-plus-circle me-2"></i>
                Add Customer
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={clearErrorMessage}
            aria-label="Close"
          ></button>
        </div>
      )}

      <Card>
        <Card.Body>
          {isLoading && customers.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading customers...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people display-1 text-muted"></i>
              <h4 className="mt-3">No Customers Found</h4>
              <p className="text-muted">
                {searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first customer'}
              </p>
              {!searchTerm && (
                <Button variant="primary" onClick={handleAddCustomer}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Your First Customer
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Loyalty Points</th>
                      <th>Total Purchases</th>
                      <th>Member Since</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td>
                          <strong>{customer.firstName} {customer.lastName}</strong>
                        </td>
                        <td>{customer.email}</td>
                        <td>{formatPhoneNumber(customer.phone)}</td>
                        <td>
                          <Badge bg="warning" text="dark">
                            {customer.loyaltyPoints || 0} pts
                          </Badge>
                        </td>
                        <td>{formatCurrency((customer.totalPurchases || 0))}</td>
                        <td>{formatDate(customer.createdAt)}</td>
                        <td>
                          <Badge bg={customer.isActive ? 'success' : 'secondary'}>
                            {customer.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteCustomer(customer)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-3">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                  <div className="text-center text-muted mt-2">
                    Showing {customers.length} of {totalCount} customers
                  </div>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <CustomerModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
        customer={editingCustomer}
        isLoading={isLoading}
        error={error}
      />
    </Container>
  );
};

export default Customers;
