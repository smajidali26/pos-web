import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, InputGroup } from 'react-bootstrap';
import { useStores } from '../../hooks/useStores';
import { StoreModal } from './StoreModal';
import { Store, StoreType } from '../../types/store';
import Pagination from '../common/Pagination';
import { useNavigate } from 'react-router-dom';

export const Stores: React.FC = () => {
  const navigate = useNavigate();
  const {
    stores,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    isLoading,
    error,
    fetchStores,
    createStore,
    updateStore,
    activateStore,
    deactivateStore,
    clearErrorMessage,
    changePage
  } = useStores();

  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | StoreType>('all');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    if (stores.length === 0 && !isLoading) {
      fetchStores();
    }
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => clearErrorMessage(), 5000);
    }
  }, [error, clearErrorMessage]);

  const handleAddStore = () => {
    setEditingStore(null);
    setShowModal(true);
  };

  const handleEditStore = (store: Store) => {
    setEditingStore(store);
    setShowModal(true);
  };

  const handleToggleActive = async (store: Store) => {
    if (store.isActive) {
      if (window.confirm(`Are you sure you want to deactivate ${store.name}?`)) {
        deactivateStore(store.id);
      }
    } else {
      activateStore(store.id);
    }
  };

  const handleSaveStore = (storeData: unknown) => {
    if (editingStore) {
      updateStore(editingStore.id, storeData as any);
    } else {
      createStore(storeData as any);
    }
    setShowModal(false);
    setEditingStore(null);

    setTimeout(() => {
      fetchStores({ page: currentPage, pageSize });
    }, 500);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= 2 || value.length === 0) {
      const isActive = filterActive === 'all' ? undefined : filterActive === 'active';
      const storeType = filterType === 'all' ? undefined : filterType;
      fetchStores({
        page: 1,
        pageSize,
        searchTerm: value || undefined,
        isActive,
        storeType
      });
    }
  };

  const handleFilterTypeChange = (type: 'all' | StoreType) => {
    setFilterType(type);
    const isActive = filterActive === 'all' ? undefined : filterActive === 'active';
    const storeType = type === 'all' ? undefined : type;
    fetchStores({
      page: 1,
      pageSize,
      searchTerm: searchTerm || undefined,
      isActive,
      storeType
    });
  };

  const handleFilterActiveChange = (filter: 'all' | 'active' | 'inactive') => {
    setFilterActive(filter);
    const isActive = filter === 'all' ? undefined : filter === 'active';
    const storeType = filterType === 'all' ? undefined : filterType;
    fetchStores({
      page: 1,
      pageSize,
      searchTerm: searchTerm || undefined,
      isActive,
      storeType
    });
  };

  const handlePageChange = (page: number) => {
    changePage(page);
  };

  const handleViewHierarchy = () => {
    navigate('/stores/hierarchy');
  };

  const handleViewInventory = (storeId: string) => {
    navigate(`/stores/${storeId}/inventory`);
  };

  const handleViewDashboard = (storeId: string) => {
    navigate(`/stores/${storeId}`);
  };

  const getStoreTypeBadge = (type: StoreType) => {
    const variants: Record<StoreType, string> = {
      [StoreType.WAREHOUSE]: 'primary',
      [StoreType.RETAIL]: 'success',
      [StoreType.BRANCH]: 'info',
      [StoreType.OUTLET]: 'warning'
    };
    return <Badge bg={variants[type]}>{type}</Badge>;
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Store Management</h2>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </Col>
        </Row>
      )}

      <Row className="mb-3">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={3}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search stores..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Form.Select
                    value={filterType}
                    onChange={(e) => handleFilterTypeChange(e.target.value as 'all' | StoreType)}
                  >
                    <option value="all">All Types</option>
                    <option value={StoreType.WAREHOUSE}>Warehouse</option>
                    <option value={StoreType.RETAIL}>Retail</option>
                    <option value={StoreType.BRANCH}>Branch</option>
                    <option value={StoreType.OUTLET}>Outlet</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select
                    value={filterActive}
                    onChange={(e) => handleFilterActiveChange(e.target.value as 'all' | 'active' | 'inactive')}
                  >
                    <option value="all">All Stores</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </Form.Select>
                </Col>
                <Col md={5} className="text-end">
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    onClick={handleViewHierarchy}
                  >
                    <i className="bi bi-diagram-3 me-2"></i>
                    View Hierarchy
                  </Button>
                  <Button variant="primary" onClick={handleAddStore}>
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Store
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Manager</th>
                    <th>Parent Store</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : stores.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center">
                        No stores found
                      </td>
                    </tr>
                  ) : (
                    stores.map((store) => (
                      <tr key={store.id}>
                        <td>{store.code}</td>
                        <td>{store.name}</td>
                        <td>{getStoreTypeBadge(store.storeType)}</td>
                        <td>{`${store.city}, ${store.state}`}</td>
                        <td>{store.managerName || 'Not Assigned'}</td>
                        <td>{store.parentStoreName || '-'}</td>
                        <td>
                          <Badge bg={store.isActive ? 'success' : 'danger'}>
                            {store.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-1"
                            onClick={() => handleViewDashboard(store.id)}
                            title="View Dashboard"
                          >
                            <i className="bi bi-bar-chart"></i>
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleViewInventory(store.id)}
                            title="View Inventory"
                          >
                            <i className="bi bi-box-seam"></i>
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleEditStore(store)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant={store.isActive ? 'outline-warning' : 'outline-success'}
                            size="sm"
                            onClick={() => handleToggleActive(store)}
                            title={store.isActive ? 'Deactivate' : 'Activate'}
                          >
                            <i className={`bi bi-${store.isActive ? 'pause' : 'play'}-circle`}></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {showModal && (
        <StoreModal
          show={showModal}
          store={editingStore}
          onClose={() => {
            setShowModal(false);
            setEditingStore(null);
          }}
          onSave={handleSaveStore}
        />
      )}
    </Container>
  );
};

export default Stores;
