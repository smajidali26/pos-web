import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { createShiftRequest } from '../../store/employees/shiftsSlice';

interface CreateShiftModalProps {
  show: boolean;
  onHide: () => void;
}

export const CreateShiftModal: React.FC<CreateShiftModalProps> = ({ show, onHide }) => {
  const dispatch = useDispatch();

  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    employeeProfileId: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
    scheduledBreakMinutes: 30,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createShiftRequest(formData));
    onHide();
    setFormData({
      employeeProfileId: '',
      scheduledStartTime: '',
      scheduledEndTime: '',
      scheduledBreakMinutes: 30,
      notes: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create Shift</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Employee ID *</Form.Label>
            <Form.Control
              type="text"
              name="employeeProfileId"
              value={formData.employeeProfileId}
              onChange={handleChange}
              required
              placeholder="Enter employee profile ID"
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Start Time *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="scheduledStartTime"
                  value={formData.scheduledStartTime}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>End Time *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="scheduledEndTime"
                  value={formData.scheduledEndTime}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Form.Label>Break Duration (minutes) *</Form.Label>
            <Form.Control
              type="number"
              name="scheduledBreakMinutes"
              value={formData.scheduledBreakMinutes}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Shift
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
