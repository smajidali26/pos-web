import apiClient from './apiClient';

export interface Vendor {
  id: string;
  name: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId: string;
  website: string;
  type: string;
  typeName: string;
  status: string;
  statusName: string;
  paymentTerms: string;
  paymentTermsName: string;
  creditLimit: number;
  currentBalance: number;
  lastOrderDate?: string;
  notes: string;
  isActive: boolean;
  productCount: number;
  purchaseOrderCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateVendorRequest {
  name: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId?: string;
  website?: string;
  type: string;
  paymentTerms: string;
  creditLimit: number;
  notes?: string;
}

export interface UpdateVendorRequest {
  name: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId?: string;
  website?: string;
  type: string;
  paymentTerms: string;
  creditLimit: number;
  notes?: string;
}

export const vendorsService = {
  // Get all vendors
  getAll: async (includeInactive: boolean = false): Promise<Vendor[]> => {
    const response = await apiClient.get<Vendor[]>(`/api/vendors?includeInactive=${includeInactive}`);
    return response.data;
  },

  // Get vendor by ID
  getById: async (id: string): Promise<Vendor> => {
    const response = await apiClient.get<Vendor>(`/api/vendors/${id}`);
    return response.data;
  },

  // Search vendors
  search: async (searchTerm: string): Promise<Vendor[]> => {
    const response = await apiClient.get<Vendor[]>(`/api/vendors/search?searchTerm=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  // Create vendor
  create: async (vendor: CreateVendorRequest): Promise<Vendor> => {
    const response = await apiClient.post<Vendor>('/api/vendors', vendor);
    return response.data;
  },

  // Update vendor
  update: async (id: string, vendor: UpdateVendorRequest): Promise<Vendor> => {
    const response = await apiClient.put<Vendor>(`/api/vendors/${id}`, vendor);
    return response.data;
  },

  // Activate vendor
  activate: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/vendors/${id}/activate`);
  },

  // Deactivate vendor
  deactivate: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/vendors/${id}/deactivate`);
  },
};

export default vendorsService;
