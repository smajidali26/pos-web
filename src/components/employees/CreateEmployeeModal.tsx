import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { createProfileRequest } from '../../store/employees/employeeProfilesSlice';
import { EmploymentType } from '../../services/employeeProfileService';

interface CreateEmployeeModalProps {
  show: boolean;
  onHide: () => void;
}

export const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({ show, onHide }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    userId: '',
    employeeCode: '',
    hireDate: new Date().toISOString().split('T')[0],
    employmentType: EmploymentType.FullTime,
    department: '',
    jobTitle: '',
    phoneNumber: '',
    hourlyRate: 15,
    isEligibleForCommission: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createProfileRequest(formData));
    onHide();
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create Employee Profile</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Employee Code *</Form.Label>
                <Form.Control
                  type="text"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>User ID *</Form.Label>
                <Form.Control
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Employment Type *</Form.Label>
                <Form.Control
                  as="select"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                >
                  {Object.values(EmploymentType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Hire Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Hourly Rate *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Form.Check
              type="checkbox"
              name="isEligibleForCommission"
              label="Eligible for Commission"
              checked={formData.isEligibleForCommission}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Employee
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
