import React, { useEffect, useState } from 'react';
import { SmallBox } from './SmallBox';
import stockAlertsService from '../../services/stockAlertsService';
import stockTransfersService from '../../services/stockTransfersService';
import batchesService from '../../services/batchesService';

export const InventoryWidgets: React.FC = () => {
  const [alertsCount, setAlertsCount] = useState(0);
  const [criticalAlertsCount, setCriticalAlertsCount] = useState(0);
  const [pendingTransfersCount, setPendingTransfersCount] = useState(0);
  const [expiringBatchesCount, setExpiringBatchesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventoryMetrics();
  }, []);

  const loadInventoryMetrics = async () => {
    try {
      setLoading(true);

      // Load all metrics in parallel
      const [alertsSummary, transfersStats, expiringBatches] = await Promise.all([
        stockAlertsService.getDashboardSummary().catch(() => ({
          totalActiveAlerts: 0,
          criticalAlerts: 0
        })),
        stockTransfersService.getStatistics().catch(() => ({
          pendingCount: 0
        })),
        batchesService.getExpiring(30).catch(() => [])
      ]);

      setAlertsCount(alertsSummary.totalActiveAlerts || 0);
      setCriticalAlertsCount(alertsSummary.criticalAlerts || 0);
      setPendingTransfersCount(transfersStats.pendingCount || 0);
      setExpiringBatchesCount(expiringBatches?.length || 0);
    } catch (err) {
      console.error('Failed to load inventory metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="row mb-3">
        <div className="col-12">
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row mb-3">
      <div className="col-lg-3 col-6">
        <SmallBox
          title={criticalAlertsCount}
          subtitle="Critical Alerts"
          icon="bi-exclamation-triangle"
          bgColor="bg-danger"
          link="/inventory/alerts"
          linkText="View Alerts"
        />
      </div>
      <div className="col-lg-3 col-6">
        <SmallBox
          title={alertsCount}
          subtitle="Active Stock Alerts"
          icon="bi-bell"
          bgColor="bg-warning"
          link="/inventory/alerts"
          linkText="View All"
        />
      </div>
      <div className="col-lg-3 col-6">
        <SmallBox
          title={pendingTransfersCount}
          subtitle="Pending Transfers"
          icon="bi-arrow-left-right"
          bgColor="bg-info"
          link="/inventory/transfers"
          linkText="View Transfers"
        />
      </div>
      <div className="col-lg-3 col-6">
        <SmallBox
          title={expiringBatchesCount}
          subtitle="Expiring Soon (30 days)"
          icon="bi-calendar-x"
          bgColor="bg-primary"
          link="/inventory/batches"
          linkText="View Batches"
        />
      </div>
    </div>
  );
};
