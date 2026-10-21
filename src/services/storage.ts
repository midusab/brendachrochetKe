import { Product, Order, CartItem, CustomOrderInquiry } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { DELIVERY_ZONES } from '../data/deliveryZones';

const STORAGE_KEYS = {
  PRODUCTS: 'brenda_crochets_products_v1',
  ORDERS: 'brenda_crochets_orders_v1',
  CART: 'brenda_crochets_cart_v1',
  INQUIRIES: 'brenda_crochets_inquiries_v1',
};

// Seed initial orders so Brenda's order dashboard is functional and rich right away
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8491',
    orderNumber: 'BC-2026-8491',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    customerName: 'Amina Muthoni',
    customerPhone: '0722394851',
    customerEmail: 'amina.muthoni@gmail.com',
    deliveryZone: DELIVERY_ZONES[1], // Nairobi Metro
    deliveryAddress: 'House 14B, General Mathenge Drive, Westlands, Nairobi',
    orderNotes: 'Please ring the front gate bell on arrival.',
    items: [
      {
        id: 'bc-01-Medium-DustyRose',
        productId: 'bc-01',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedSize: 'Medium / Large',
        selectedColor: 'Dusty Rose & Cream'
      }
    ],
    subtotalKes: 4800,
    deliveryFeeKes: 300,
    totalKes: 5100,
    paymentMethod: 'mpesa_stk',
    mpesaReceiptCode: 'TL89HY92PZ',
    paymentStatus: 'paid',
    orderStatus: 'knitting',
    smsSent: true,
    emailSent: true
  },
  {
    id: 'ord-8490',
    orderNumber: 'BC-2026-8490',
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    customerName: 'Sharon Chebet',
    customerPhone: '0714902143',
    customerEmail: 'sharon.chebet@outlook.com',
    deliveryZone: DELIVERY_ZONES[3], // Rest of Kenya
    deliveryAddress: 'Section 58, Near Mercy Hospital, Nakuru Town',
    orderNotes: 'Send via Wells Fargo parcel office',
    items: [
      {
        id: 'bc-03-3-6m-PetalPink',
        productId: 'bc-03',
        product: INITIAL_PRODUCTS[2],
        quantity: 1,
        selectedSize: '3 - 6 Months',
        selectedColor: 'Petal Pink & Milk Cream'
      },
      {
        id: 'bc-05-OneSize-Pastel',
        productId: 'bc-05',
        product: INITIAL_PRODUCTS[4],
        quantity: 1,
        selectedSize: 'One Size',
        selectedColor: 'Pastel Pink & Cream Checker'
      }
    ],
    subtotalKes: 6600,
    deliveryFeeKes: 500,
    totalKes: 7100,
    paymentMethod: 'mpesa_till',
    mpesaReceiptCode: 'TK41PQ78XR',
    paymentStatus: 'paid',
    orderStatus: 'dispatched',
    smsSent: true,
    emailSent: true
  }
];

export const storage = {
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  },

  addProduct(newProduct: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const createdProduct: Product = {
      ...newProduct,
      id: `bc-custom-${Date.now()}`
    };
    const updated = [createdProduct, ...products];
    this.saveProducts(updated);
    return createdProduct;
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${randomSuffix}`,
      orderNumber: `BC-${new Date().getFullYear()}-${randomSuffix}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newOrder, ...orders];
    this.saveOrders(updated);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['orderStatus']): Order[] {
    const orders = this.getOrders().map(order => {
      if (order.id === orderId) {
        return { ...order, orderStatus: status };
      }
      return order;
    });
    this.saveOrders(orders);
    return orders;
  },

  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCart(cart: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  },

  getInquiries(): CustomOrderInquiry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveInquiry(inquiry: Omit<CustomOrderInquiry, 'id' | 'createdAt' | 'status'>): CustomOrderInquiry {
    const inquiries = this.getInquiries();
    const created: CustomOrderInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending_quote'
    };
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify([created, ...inquiries]));
    return created;
  }
};
