/**
 * Brand types for type-safe IDs
 * Prevents accidentally mixing different ID types
 */
export type ProductId = string & { readonly __brand: 'ProductId' };
export type CustomerId = string & { readonly __brand: 'CustomerId' };
export type OrderId = string & { readonly __brand: 'OrderId' };
export type UserId = string & { readonly __brand: 'UserId' };
export type CategoryId = string & { readonly __brand: 'CategoryId' };
export type VendorId = string & { readonly __brand: 'VendorId' };
export type LocationId = string & { readonly __brand: 'LocationId' };
export type BatchId = string & { readonly __brand: 'BatchId' };
export type TransferId = string & { readonly __brand: 'TransferId' };

/**
 * Utility functions to create branded IDs
 */
export function createProductId(id: string): ProductId {
  return id as ProductId;
}

export function createCustomerId(id: string): CustomerId {
  return id as CustomerId;
}

export function createOrderId(id: string): OrderId {
  return id as OrderId;
}

export function createUserId(id: string): UserId {
  return id as UserId;
}

/**
 * Form submission states using discriminated union
 */
export type SubmissionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; message?: string }
  | { status: 'error'; message: string };

/**
 * Generic DTO utility types
 */

/**
 * Create DTO - excludes server-generated fields
 */
export type CreateDto<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Update DTO - makes all fields optional except ID
 */
export type UpdateDto<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>> & Pick<T, 'id'>;

/**
 * Readonly wrapper for immutable data
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Extract keys that have specific type
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Make specific properties required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
