import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useStores } from '../../hooks/useStores';
import { StoreHierarchyNode, StoreType } from '../../types/store';
import { useNavigate } from 'react-router-dom';

export const StoreHierarchy: React.FC = () => {
  const navigate = useNavigate();
  const { storeHierarchy, isLoading, error, fetchStoreHierarchy } = useStores();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchStoreHierarchy();
  }, [fetchStoreHierarchy]);

  const toggleNode = (storeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storeId)) {
        newSet.delete(storeId);
      } else {
        newSet.add(storeId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (nodes: StoreHierarchyNode[]) => {
      nodes.forEach(node => {
        allIds.add(node.store.id);
        if (node.children.length > 0) {
          collectIds(node.children);
        }
      });
    };
    collectIds(storeHierarchy);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
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

  const renderNode = (node: StoreHierarchyNode) => {
    const isExpanded = expandedNodes.has(node.store.id);
    const hasChildren = node.children.length > 0;
    const indentLevel = node.level * 30;

    return (
      <div key={node.store.id}>
        <div
          className="hierarchy-node p-3 mb-2 border rounded"
          style={{
            marginLeft: `${indentLevel}px`,
            backgroundColor: node.store.isActive ? '#fff' : '#f8f9fa'
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              {hasChildren && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 me-2"
                  onClick={() => toggleNode(node.store.id)}
                >
                  <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                </Button>
              )}
              {!hasChildren && <span className="me-2" style={{ width: '28px', display: 'inline-block' }}></span>}

              <div>
                <h6 className="mb-1">
                  <i className="bi bi-shop me-2"></i>
                  {node.store.name} ({node.store.code})
                  {!node.store.isActive && (
                    <Badge bg="danger" className="ms-2">Inactive</Badge>
                  )}
                </h6>
                <div className="text-muted small">
                  {getStoreTypeBadge(node.store.storeType)}
                  <span className="ms-2">{node.store.city}, {node.store.state}</span>
                  {node.store.managerName && (
                    <span className="ms-2">
                      <i className="bi bi-person-badge"></i> {node.store.managerName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-1"
                onClick={() => navigate(`/stores/${node.store.id}`)}
              >
                <i className="bi bi-bar-chart me-1"></i>
                Dashboard
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigate(`/stores/${node.store.id}/inventory`)}
              >
                <i className="bi bi-box-seam me-1"></i>
                Inventory
              </Button>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Store Hierarchy</h2>
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
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Button variant="outline-secondary" size="sm" className="me-2" onClick={expandAll}>
                    <i className="bi bi-arrows-expand me-1"></i>
                    Expand All
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={collapseAll}>
                    <i className="bi bi-arrows-collapse me-1"></i>
                    Collapse All
                  </Button>
                </div>
                <Button variant="outline-primary" onClick={() => navigate('/stores')}>
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Stores
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : storeHierarchy.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  No stores found
                </div>
              ) : (
                <div>
                  {storeHierarchy.map(node => renderNode(node))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StoreHierarchy;
