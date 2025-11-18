// Inter-Store Transfer Types

export enum TransferStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  IN_TRANSIT = 'InTransit',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface TransferItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  availableStock?: number;
}

export interface InterStoreTransfer {
  id: string;
  transferNumber: string;
  fromStoreId: string;
  fromStoreName: string;
  toStoreId: string;
  toStoreName: string;
  status: TransferStatus;
  items: TransferItem[];
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  notes?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  createdBy: string;
  createdByName: string;
  approvedBy?: string;
  approvedByName?: string;
  shippedBy?: string;
  shippedByName?: string;
  receivedBy?: string;
  receivedByName?: string;
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  shippedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface CreateTransferRequest {
  fromStoreId: string;
  toStoreId: string;
  items: CreateTransferItemRequest[];
  notes?: string;
}

export interface CreateTransferItemRequest {
  productId: string;
  quantity: number;
}

export interface UpdateTransferRequest {
  items: CreateTransferItemRequest[];
  notes?: string;
}

export interface SubmitTransferRequest {
  notes?: string;
}

export interface ApproveTransferRequest {
  notes?: string;
}

export interface RejectTransferRequest {
  reason: string;
}

export interface ShipTransferRequest {
  notes?: string;
}

export interface CompleteTransferRequest {
  notes?: string;
}

export interface CancelTransferRequest {
  reason: string;
}

export interface TransfersListResponse {
  items: InterStoreTransfer[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TransfersQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: TransferStatus;
  fromStoreId?: string;
  toStoreId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface TransferTimeline {
  status: TransferStatus;
  timestamp: string;
  performedBy?: string;
  performedByName?: string;
  notes?: string;
}
