import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Tab, Nav } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchProfilesRequest } from '../../store/employees/employeeProfilesSlice';
import { fetchActiveShiftsRequest } from '../../store/employees/shiftsSlice';
import { EmploymentStatus } from '../../services/employeeProfileService';
import { EmployeeList } from './EmployeeList';
import { CreateEmployeeModal } from './CreateEmployeeModal';
import { ClockInOutWidget } from './ClockInOutWidget';
import { LeaderboardWidget } from './LeaderboardWidget';

export const EmployeeManagementPage: React.FC = () => {
  const dispatch = useDispatch();
  const { profiles, totalCount, isLoading } = useSelector((state: RootState) => state.employeeProfiles);
  const { activeShifts } = useSelector((state: RootState) => state.shifts);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    dispatch(fetchProfilesRequest({ status: EmploymentStatus.Active }));
    dispatch(fetchActiveShiftsRequest({}));
  }, [dispatch]);

  const handleFilterChange = (status: string) => {
    setSelectedTab(status);
    if (status === 'all') {
      dispatch(fetchProfilesRequest({}));
    } else {
      dispatch(fetchProfilesRequest({ status: status as EmploymentStatus }));
    }
  };

  const stats = [
    {
      title: 'Total Employees',
      value: totalCount,
      icon: 'fas fa-users',
      color: 'primary'
    },
    {
      title: 'Active Now',
      value: activeShifts.length,
      icon: 'fas fa-clock',
      color: 'success'
    },
    {
      title: 'On Leave',
      value: profiles.filter(p => p.status === EmploymentStatus.OnLeave).length,
      icon: 'fas fa-calendar-times',
      color: 'warning'
    },
    {
      title: 'Suspended',
      value: profiles.filter(p => p.status === EmploymentStatus.Suspended).length,
      icon: 'fas fa-ban',
      color: 'danger'
    }
  ];

  return (
    <Container fluid>
      <div className="content-header">
        <div className="container-fluid">
          <Row className="mb-2">
            <Col sm={6}>
              <h1 className="m-0">Employee Management</h1>
            </Col>
            <Col sm={6}>
              <div className="float-sm-right">
                <Button
                  variant="primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Employee
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          {/* Statistics Cards */}
          <Row className="mb-4">
            {stats.map((stat, index) => (
              <Col lg={3} md={6} key={index}>
                <Card className={`bg-${stat.color} text-white`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-uppercase small">{stat.title}</div>
                        <div className="h2 mb-0">{stat.value}</div>
                      </div>
                      <div>
                        <i className={`${stat.icon} fa-3x opacity-50`}></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Row>
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <Tab.Container activeKey={selectedTab} onSelect={(k) => handleFilterChange(k || 'all')}>
                    <Nav variant="tabs" className="card-header-tabs">
                      <Nav.Item>
                        <Nav.Link eventKey="all">All Employees</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey={EmploymentStatus.Active}>Active</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey={EmploymentStatus.OnLeave}>On Leave</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey={EmploymentStatus.Suspended}>Suspended</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Tab.Container>
                </Card.Header>
                <Card.Body>
                  <EmployeeList />
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <ClockInOutWidget />
              <LeaderboardWidget />
            </Col>
          </Row>
        </div>
      </div>

      <CreateEmployeeModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
      />
    </Container>
  );
};

export default EmployeeManagementPage;
