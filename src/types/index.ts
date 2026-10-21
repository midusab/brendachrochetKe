export type ProductCategory = 
  | 'all'
  | 'sweaters'
  | 'dresses'
  | 'tops'
  | 'children'
  | 'accessories'
  | 'bespoke';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  priceKes: number;
  originalPriceKes?: number;
  image: string;
  description: string;
  material: string;
  leadTime: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured?: boolean;
  rating: number;
  reviewsCount: number;
  careGuide: string;
  stitchType?: string;
}

export interface CartItem {
  id: string; // unique item id = product.id + size + color
  productId: string;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  feeKes: number;
  estimatedDays: string;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryZone: DeliveryZone;
  deliveryAddress: string;
  orderNotes?: string;
  items: CartItem[];
  subtotalKes: number;
  deliveryFeeKes: number;
  totalKes: number;
  paymentMethod: 'mpesa_stk' | 'mpesa_till';
  mpesaReceiptCode: string;
  paymentStatus: 'paid' | 'pending';
  orderStatus: 'received' | 'knitting' | 'dispatched' | 'delivered';
  smsSent: boolean;
  emailSent: boolean;
}

export interface CustomOrderInquiry {
  id: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  garmentType: string;
  yarnMaterial: string;
  preferredColors: string;
  measurements: {
    bustOrChest?: string;
    waist?: string;
    hips?: string;
    length?: string;
    babyAge?: string;
  };
  notes: string;
  status: 'pending_quote' | 'deposit_paid' | 'in_progress' | 'completed';
}
