import React, { useState, useEffect, useRef } from 'react';
import { Form, ListGroup, Badge } from 'react-bootstrap';
import { useCustomers } from '../../hooks/useCustomers';
import { Customer } from '../../services/customersService';

interface CustomerSearchProps {
  onSelect: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({ onSelect, selectedCustomer }) => {
  const { searchResults, searchCustomers, clearSearchResults, isLoading } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 2) {
      searchCustomers(value);
      setShowDropdown(true);
    } else {
      clearSearchResults();
      setShowDropdown(false);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    onSelect(customer);
    setSearchTerm(`${customer.firstName} ${customer.lastName}`);
    setShowDropdown(false);
  };

  const handleGuestCheckout = () => {
    onSelect(null);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  return (
    <div ref={searchRef} className="position-relative">
      <Form.Group className="mb-3">
        <Form.Label>Customer</Form.Label>
        <Form.Control
          type="text"
          placeholder="Search customer by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) setShowDropdown(true);
          }}
        />
        {selectedCustomer && (
          <div className="mt-2 p-2 bg-light rounded border">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{selectedCustomer.firstName} {selectedCustomer.lastName}</strong>
                <div className="text-muted small">{selectedCustomer.email}</div>
                <div className="text-muted small">{formatPhoneNumber(selectedCustomer.phone)}</div>
              </div>
              <div className="text-end">
                <Badge bg="warning" text="dark">
                  {selectedCustomer.loyaltyPoints || 0} pts
                </Badge>
                <button
                  className="btn btn-sm btn-link text-danger p-0 ms-2"
                  onClick={handleGuestCheckout}
                  type="button"
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </Form.Group>

      {showDropdown && (
        <ListGroup className="position-absolute w-100 shadow-lg" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
          {isLoading ? (
            <ListGroup.Item>
              <div className="text-center py-2">
                <span className="spinner-border spinner-border-sm me-2" />
                Searching...
              </div>
            </ListGroup.Item>
          ) : searchResults.length === 0 ? (
            <ListGroup.Item>
              <div className="text-center text-muted py-2">
                No customers found
              </div>
            </ListGroup.Item>
          ) : (
            <>
              <ListGroup.Item
                action
                onClick={handleGuestCheckout}
                className="bg-light"
              >
                <i className="bi bi-person me-2"></i>
                <strong>Guest Checkout</strong> (No customer)
              </ListGroup.Item>
              {searchResults.map((customer) => (
                <ListGroup.Item
                  key={customer.id}
                  action
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{customer.firstName} {customer.lastName}</strong>
                      <div className="text-muted small">{customer.email}</div>
                      <div className="text-muted small">{formatPhoneNumber(customer.phone)}</div>
                    </div>
                    <Badge bg="warning" text="dark">
                      {customer.loyaltyPoints || 0} pts
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </>
          )}
        </ListGroup>
      )}
    </div>
  );
};

export default CustomerSearch;
