import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchShiftsByDateRangeRequest } from '../../store/employees/shiftsSlice';
import { ShiftCalendar } from './ShiftCalendar';
import { CreateShiftModal } from './CreateShiftModal';
import { ShiftCard } from './ShiftCard';

export const ShiftSchedulePage: React.FC = () => {
  const dispatch = useDispatch();
  const { shifts, isLoading } = useSelector((state: RootState) => state.shifts);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    dispatch(fetchShiftsByDateRangeRequest({
      startDate: startOfMonth.toISOString(),
      endDate: endOfMonth.toISOString()
    }));
  }, [dispatch, selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Container fluid>
      <div className="content-header">
        <div className="container-fluid">
          <Row className="mb-2">
            <Col sm={6}>
              <h1 className="m-0">Shift Schedule</h1>
            </Col>
            <Col sm={6}>
              <div className="float-sm-right">
                <ButtonGroup className="mr-2">
                  <Button
                    variant={viewMode === 'calendar' ? 'primary' : 'outline-secondary'}
                    onClick={() => setViewMode('calendar')}
                  >
                    <i className="fas fa-calendar-alt mr-2"></i>
                    Calendar
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="fas fa-list mr-2"></i>
                    List
                  </Button>
                </ButtonGroup>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Create Shift
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="card-title mb-0">{monthName}</h3>
                <ButtonGroup>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handlePreviousMonth}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleToday}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleNextMonth}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </Button>
                </ButtonGroup>
              </div>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="text-center p-5">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : viewMode === 'calendar' ? (
                <ShiftCalendar
                  shifts={shifts}
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                />
              ) : (
                <Row>
                  {shifts.map((shift) => (
                    <Col md={6} lg={4} key={shift.id} className="mb-3">
                      <ShiftCard shift={shift} />
                    </Col>
                  ))}
                  {shifts.length === 0 && (
                    <Col>
                      <div className="text-center text-muted p-5">
                        <i className="fas fa-calendar-times fa-3x mb-3"></i>
                        <p>No shifts scheduled for this period</p>
                      </div>
                    </Col>
                  )}
                </Row>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      <CreateShiftModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
      />
    </Container>
  );
};

export default ShiftSchedulePage;
