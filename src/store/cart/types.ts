// Cart Types
export interface Product {
  id: string | number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  categoryId?: string | number;
  categoryName?: string;
  stock?: number;
  originalPrice?: number;
}

export interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isProcessing: boolean;
  error: string | null;
}

export interface UpdateQuantityPayload {
  id: string | number;
  quantity: number;
}

export interface CheckoutPayload {
  items: CartItem[];
  total: number;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  paymentMethod?: string;
}
