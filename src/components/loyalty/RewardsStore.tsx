/**
 * Rewards Store Component - Available Rewards Catalog
 */

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { useLoyalty } from '../../hooks/useLoyalty';
import { Reward, RewardType, RedeemRewardRequest } from '../../types/loyalty';
import { toast } from 'react-toastify';
import CreateRewardModal from './CreateRewardModal';

interface RewardsStoreProps {
  customerLoyaltyId?: string;
  currentPoints?: number;
  isAdminView?: boolean;
}

const RewardsStore: React.FC<RewardsStoreProps> = ({
  customerLoyaltyId,
  currentPoints = 0,
  isAdminView = false
}) => {
  const { rewards, loading, program, fetchRewards, redeemReward, fetchProgram } = useLoyalty();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    type: '' as RewardType | '',
    minPoints: '',
    maxPoints: '',
    isActive: true
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | undefined>();
  const [redeemingReward, setRedeemingReward] = useState<Reward | null>(null);
  const [showRedeemConfirm, setShowRedeemConfirm] = useState(false);

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  useEffect(() => {
    if (program) {
      fetchRewards(program.id, {
        type: filters.type || undefined,
        minPointsCost: filters.minPoints ? parseInt(filters.minPoints) : undefined,
        maxPointsCost: filters.maxPoints ? parseInt(filters.maxPoints) : undefined,
        isActive: isAdminView ? undefined : filters.isActive
      });
    }
  }, [program, filters, fetchRewards, isAdminView]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRedeem = (reward: Reward) => {
    if (!customerLoyaltyId) {
      toast.error('Customer not selected');
      return;
    }

    if (currentPoints < reward.pointsCost) {
      toast.error('Insufficient points');
      return;
    }

    setRedeemingReward(reward);
    setShowRedeemConfirm(true);
  };

  const confirmRedeem = () => {
    if (!redeemingReward || !customerLoyaltyId) return;

    const data: RedeemRewardRequest = {
      rewardId: redeemingReward.id,
      customerLoyaltyId
    };

    redeemReward(data);
    toast.success('Reward redeemed successfully');
    setShowRedeemConfirm(false);
    setRedeemingReward(null);
  };

  const handleCreateEdit = (reward?: Reward) => {
    setEditingReward(reward);
    setShowCreateModal(true);
  };

  const getRewardTypeLabel = (type: RewardType) => {
    switch (type) {
      case RewardType.DISCOUNT_PERCENTAGE: return 'Discount %';
      case RewardType.DISCOUNT_FIXED: return 'Fixed Discount';
      case RewardType.FREE_PRODUCT: return 'Free Product';
      case RewardType.FREE_SHIPPING: return 'Free Shipping';
      case RewardType.CUSTOM: return 'Custom';
      default: return type;
    }
  };

  const filteredRewards = rewards.filter(reward => {
    if (!isAdminView && !reward.isActive) return false;
    if (filters.type && reward.type !== filters.type) return false;
    if (filters.minPoints && reward.pointsCost < parseInt(filters.minPoints)) return false;
    if (filters.maxPoints && reward.pointsCost > parseInt(filters.maxPoints)) return false;
    return true;
  });

  if (loading.rewards && rewards.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Rewards Store</h2>
        <div className="d-flex gap-2">
          {isAdminView && (
            <Button variant="primary" onClick={() => handleCreateEdit()}>
              Create Reward
            </Button>
          )}
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Reward Type</Form.Label>
                <Form.Select name="type" value={filters.type} onChange={handleFilterChange}>
                  <option value="">All Types</option>
                  {Object.values(RewardType).map(type => (
                    <option key={type} value={type}>{getRewardTypeLabel(type)}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Min Points</Form.Label>
                <Form.Control
                  type="number"
                  name="minPoints"
                  value={filters.minPoints}
                  onChange={handleFilterChange}
                  placeholder="0"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Max Points</Form.Label>
                <Form.Control
                  type="number"
                  name="maxPoints"
                  value={filters.maxPoints}
                  onChange={handleFilterChange}
                  placeholder="10000"
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button variant="secondary" onClick={() => setFilters({ type: '', minPoints: '', maxPoints: '', isActive: true })}>
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Rewards Display */}
      {filteredRewards.length > 0 ? (
        viewMode === 'grid' ? (
          <Row>
            {filteredRewards.map(reward => (
              <Col md={4} key={reward.id} className="mb-4">
                <Card className="h-100">
                  {reward.imageUrl && (
                    <Card.Img variant="top" src={reward.imageUrl} style={{ height: '200px', objectFit: 'cover' }} />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title>{reward.name}</Card.Title>
                      {!reward.isActive && <Badge bg="danger">Inactive</Badge>}
                    </div>
                    <Card.Text className="flex-grow-1">{reward.description}</Card.Text>
                    <div className="mb-2">
                      <Badge bg="info" className="me-2">{getRewardTypeLabel(reward.type)}</Badge>
                      <Badge bg="primary">{reward.pointsCost} points</Badge>
                    </div>
                    {reward.type === RewardType.DISCOUNT_PERCENTAGE && (
                      <p className="mb-2"><strong>{reward.value}% Off</strong></p>
                    )}
                    {reward.type === RewardType.DISCOUNT_FIXED && (
                      <p className="mb-2"><strong>${reward.value} Off</strong></p>
                    )}
                    {reward.redemptionLimit && (
                      <small className="text-muted">
                        {reward.redemptionCount}/{reward.redemptionLimit} redeemed
                      </small>
                    )}
                    <div className="mt-auto pt-3">
                      {isAdminView ? (
                        <Button variant="outline-primary" size="sm" onClick={() => handleCreateEdit(reward)}>
                          Edit
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          disabled={!customerLoyaltyId || currentPoints < reward.pointsCost}
                          onClick={() => handleRedeem(reward)}
                        >
                          {currentPoints < reward.pointsCost ? 'Insufficient Points' : 'Redeem'}
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Card>
            <Card.Body>
              {filteredRewards.map(reward => (
                <div key={reward.id} className="border-bottom pb-3 mb-3">
                  <Row>
                    <Col md={8}>
                      <h5>
                        {reward.name}
                        {!reward.isActive && <Badge bg="danger" className="ms-2">Inactive</Badge>}
                      </h5>
                      <p className="mb-2">{reward.description}</p>
                      <Badge bg="info" className="me-2">{getRewardTypeLabel(reward.type)}</Badge>
                      <Badge bg="primary">{reward.pointsCost} points</Badge>
                    </Col>
                    <Col md={4} className="text-end">
                      {isAdminView ? (
                        <Button variant="outline-primary" size="sm" onClick={() => handleCreateEdit(reward)}>
                          Edit
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          disabled={!customerLoyaltyId || currentPoints < reward.pointsCost}
                          onClick={() => handleRedeem(reward)}
                        >
                          {currentPoints < reward.pointsCost ? 'Insufficient Points' : 'Redeem'}
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>
              ))}
            </Card.Body>
          </Card>
        )
      ) : (
        <Alert variant="info">No rewards available</Alert>
      )}

      {/* Create/Edit Reward Modal */}
      {program && (
        <CreateRewardModal
          show={showCreateModal}
          onHide={() => {
            setShowCreateModal(false);
            setEditingReward(undefined);
          }}
          programId={program.id}
          reward={editingReward}
        />
      )}

      {/* Redeem Confirmation Modal */}
      <Modal show={showRedeemConfirm} onHide={() => setShowRedeemConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Redemption</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {redeemingReward && (
            <>
              <p>Are you sure you want to redeem this reward?</p>
              <Card>
                <Card.Body>
                  <h5>{redeemingReward.name}</h5>
                  <p>{redeemingReward.description}</p>
                  <p><strong>Cost:</strong> {redeemingReward.pointsCost} points</p>
                  <p><strong>Your Balance After:</strong> {currentPoints - redeemingReward.pointsCost} points</p>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRedeemConfirm(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmRedeem} disabled={loading.redemptions}>
            {loading.redemptions ? 'Redeeming...' : 'Confirm Redemption'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RewardsStore;
