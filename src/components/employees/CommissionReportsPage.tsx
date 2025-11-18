import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Tab, Nav } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchCommissionsRequest, fetchPendingCommissionsRequest } from '../../store/employees/commissionsSlice';
import { CommissionRulesTable } from './CommissionRulesTable';
import { CreateCommissionModal } from './CreateCommissionModal';
import { CommissionTransactionsTable } from './CommissionTransactionsTable';
import { CommissionStatus } from '../../services/commissionService';

export const CommissionReportsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { commissions, pendingTransactions, isLoading } = useSelector(
    (state: RootState) => state.commissions
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    dispatch(fetchCommissionsRequest({ page: 1, pageSize: 20 }));
    dispatch(fetchPendingCommissionsRequest({}));
  }, [dispatch]);

  const handleDateFilter = () => {
    // Filter logic would be implemented here
    console.log('Filtering from', startDate, 'to', endDate);
  };

  const stats = [
    {
      title: 'Active Rules',
      value: commissions.filter(c => c.isActive).length,
      icon: 'fas fa-check-circle',
      color: 'success'
    },
    {
      title: 'Pending Approval',
      value: pendingTransactions.length,
      icon: 'fas fa-clock',
      color: 'warning'
    },
    {
      title: 'Total Pending',
      value: `$${pendingTransactions.reduce((sum, t) => sum + t.commissionAmount, 0).toFixed(2)}`,
      icon: 'fas fa-dollar-sign',
      color: 'info'
    },
    {
      title: 'Total Rules',
      value: commissions.length,
      icon: 'fas fa-list',
      color: 'primary'
    }
  ];

  return (
    <Container fluid>
      <div className="content-header">
        <div className="container-fluid">
          <Row className="mb-2">
            <Col sm={6}>
              <h1 className="m-0">Commission Reports</h1>
            </Col>
            <Col sm={6}>
              <div className="float-sm-right">
                <Button
                  variant="primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Create Commission Rule
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

          {/* Filters */}
          <Card className="mb-4">
            <Card.Body>
              <Form>
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>&nbsp;</Form.Label>
                      <div>
                        <Button
                          variant="primary"
                          onClick={handleDateFilter}
                          className="mr-2"
                        >
                          Apply Filter
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            setStartDate('');
                            setEndDate('');
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* Tabs */}
          <Card>
            <Card.Header>
              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'rules')}>
                <Nav variant="tabs" className="card-header-tabs">
                  <Nav.Item>
                    <Nav.Link eventKey="rules">Commission Rules</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="pending">
                      Pending Approvals
                      {pendingTransactions.length > 0 && (
                        <span className="badge badge-warning ml-2">
                          {pendingTransactions.length}
                        </span>
                      )}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="all">All Transactions</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Tab.Container>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane active={activeTab === 'rules'}>
                  <CommissionRulesTable />
                </Tab.Pane>
                <Tab.Pane active={activeTab === 'pending'}>
                  {pendingTransactions.length > 0 ? (
                    <div>
                      <p className="text-muted mb-3">
                        {pendingTransactions.length} commission(s) pending approval
                      </p>
                      {/* Pending transactions list would go here */}
                    </div>
                  ) : (
                    <div className="text-center text-muted p-5">
                      <i className="fas fa-check-circle fa-3x mb-3"></i>
                      <p>No pending commissions</p>
                    </div>
                  )}
                </Tab.Pane>
                <Tab.Pane active={activeTab === 'all'}>
                  <p className="text-muted mb-3">All commission transactions</p>
                  {/* All transactions table would go here */}
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </div>
      </div>

      <CreateCommissionModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
      />
    </Container>
  );
};

export default CommissionReportsPage;
