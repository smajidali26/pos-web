import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Tab, Nav } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchProfileByIdRequest } from '../../store/employees/employeeProfilesSlice';
import { fetchShiftsByEmployeeRequest } from '../../store/employees/shiftsSlice';
import { fetchTransactionsRequest } from '../../store/employees/commissionsSlice';
import { fetchMetricsByEmployeeRequest } from '../../store/employees/performanceSlice';
import { MetricPeriodType } from '../../services/performanceService';
import { EmployeeDetailsCard } from './EmployeeDetailsCard';
import { EditEmployeeModal } from './EditEmployeeModal';
import { AttendanceHistoryTable } from './AttendanceHistoryTable';
import { CommissionTransactionsTable } from './CommissionTransactionsTable';
import { PerformanceMetricsCard } from './PerformanceMetricsCard';
import { PerformanceTrendChart } from './PerformanceTrendChart';

export const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedProfile, isLoading } = useSelector((state: RootState) => state.employeeProfiles);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      dispatch(fetchProfileByIdRequest(id));
      dispatch(fetchShiftsByEmployeeRequest({ employeeId: id, page: 1, pageSize: 20 }));
      dispatch(fetchTransactionsRequest({ employeeId: id, page: 1, pageSize: 20 }));
      dispatch(fetchMetricsByEmployeeRequest({
        employeeId: id,
        periodType: MetricPeriodType.Monthly,
        page: 1,
        pageSize: 12
      }));
    }
  }, [id, dispatch]);

  if (isLoading && !selectedProfile) {
    return (
      <Container fluid>
        <div className="content">
          <div className="text-center p-5">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!selectedProfile) {
    return (
      <Container fluid>
        <div className="content">
          <Card>
            <Card.Body>
              <div className="text-center p-5">
                <h4>Employee not found</h4>
                <Button variant="primary" onClick={() => navigate('/employees')}>
                  Back to Employees
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="content-header">
        <div className="container-fluid">
          <Row className="mb-2">
            <Col sm={6}>
              <h1 className="m-0">
                {selectedProfile.user?.firstName} {selectedProfile.user?.lastName}
              </h1>
              <p className="text-muted mb-0">
                {selectedProfile.jobTitle || 'Employee'} - {selectedProfile.employeeCode}
              </p>
            </Col>
            <Col sm={6}>
              <div className="float-sm-right">
                <Button
                  variant="outline-secondary"
                  className="mr-2"
                  onClick={() => navigate('/employees')}
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowEditModal(true)}
                >
                  <i className="fas fa-edit mr-2"></i>
                  Edit Profile
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          <Row>
            <Col lg={4}>
              <EmployeeDetailsCard employee={selectedProfile} />
            </Col>

            <Col lg={8}>
              <Card>
                <Card.Header>
                  <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'overview')}>
                    <Nav variant="tabs" className="card-header-tabs">
                      <Nav.Item>
                        <Nav.Link eventKey="overview">Overview</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="attendance">Attendance</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="commissions">Commissions</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="performance">Performance</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Tab.Container>
                </Card.Header>
                <Card.Body>
                  <Tab.Content>
                    <Tab.Pane active={activeTab === 'overview'}>
                      <PerformanceMetricsCard employeeId={id!} />
                    </Tab.Pane>
                    <Tab.Pane active={activeTab === 'attendance'}>
                      <AttendanceHistoryTable employeeId={id!} />
                    </Tab.Pane>
                    <Tab.Pane active={activeTab === 'commissions'}>
                      <CommissionTransactionsTable employeeId={id!} />
                    </Tab.Pane>
                    <Tab.Pane active={activeTab === 'performance'}>
                      <PerformanceTrendChart employeeId={id!} />
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {selectedProfile && (
        <EditEmployeeModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          employee={selectedProfile}
        />
      )}
    </Container>
  );
};

export default EmployeeProfilePage;
