export interface SampleProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category?: string;
  stock?: number;
  funded?: boolean;
  completed?: boolean;
}

export interface SampleUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  organisation?: string;
}

export interface SampleRefund {
  id: string;
  orderId: string;
  productId?: string;
  productName?: string;
  userId: string;
  userName: string;
  amount: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface SamplePayment {
  id: string;
  orderId: string;
  transactionId: string;
  userId: string;
  userName: string;
  gateway: 'Stripe' | 'PayPal' | 'M-Pesa' | 'Manual';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  items?: Array<{ productId?: string; productName?: string; quantity: number; price?: number }>;
  createdAt: string;
}

// SampleComment removed per user request; comments are sourced from the backend (dummyjson)

export const organizations = [
  'Western Province Org 1',
  'Western Province Org 2',
  'Western Province Org 3',
  'Western Province Org 4',
  'Western Province Org 5',
  'Western Province Org 6',
  'Western Province Org 7',
];

// sampleProducts removed — admin/product UI now sources products from dummyjson
export const sampleHeroSlides: { id: string; image: string; title: string; subtitle?: string }[] = [];

// Sample users removed: admin UI now relies on live dummyjson users (no local sample users)

// Additional sample sets for admin pages
// Carts, Checkouts and related sample data removed per user request

export const sampleRefunds: SampleRefund[] = [
  { id: 'r1', orderId: 'o1001', productId: 'p3', productName: 'Smart Watch Pro', userId: 'u3', userName: 'Clara Nshimiyimana', amount: 249.99, reason: 'Defective screen', status: 'pending', createdAt: '2025-09-20' },
  { id: 'r2', orderId: 'o1002', productId: 'p5', productName: 'Everyday Tote Bag', userId: 'u5', userName: 'Eve Mukasa', amount: 59.99, reason: 'Wrong colour', status: 'approved', createdAt: '2025-08-18' },
  { id: 'r3', orderId: 'o1003', productId: 'p1', productName: 'Premium Running Shoes', userId: 'u2', userName: 'Bob Mwangi', amount: 89.99, reason: 'Too small', status: 'rejected', createdAt: '2025-07-30' },
  { id: 'r4', orderId: 'o1004', productId: 'p9', productName: 'Sportwatch X', userId: 'u6', userName: 'Frank Ntege', amount: 179.99, reason: 'Battery issue', status: 'pending', createdAt: '2025-10-01' },
  { id: 'r5', orderId: 'o1005', productId: 'p11', productName: 'Leather Shoulder Bag', userId: 'u7', userName: 'Grace Karungi', amount: 229.99, reason: 'Arrived late', status: 'pending', createdAt: '2025-10-05' },
];

// Small sample payments dataset used only for admin demos and charts (kept minimal)
export const samplePayments: SamplePayment[] = [
  {
    id: 'pay_1',
    orderId: 'o1001',
    transactionId: 'txn_abc123',
    userId: 'u3',
    userName: 'Clara Nshimiyimana',
    gateway: 'Stripe',
    amount: 249.99,
    status: 'completed',
    items: [{ productId: 'p3', productName: 'Smart Watch Pro', quantity: 1, price: 249.99 }],
    createdAt: '2025-09-20'
  },
  {
    id: 'pay_2',
    orderId: 'o1002',
    transactionId: 'txn_def456',
    userId: 'u5',
    userName: 'Eve Mukasa',
    gateway: 'PayPal',
    amount: 59.99,
    status: 'completed',
    items: [{ productId: 'p5', productName: 'Everyday Tote Bag', quantity: 1, price: 59.99 }],
    createdAt: '2025-08-18'
  },
  {
    id: 'pay_3',
    orderId: 'o1003',
    transactionId: 'txn_xyz789',
    userId: 'u2',
    userName: 'Bob Mwangi',
    gateway: 'M-Pesa',
    amount: 89.99,
    status: 'failed',
    items: [{ productId: 'p1', productName: 'Premium Running Shoes', quantity: 1, price: 89.99 }],
    createdAt: '2025-07-30'
  }
];

// Sample orders for shop/orders page (user order tracking demo)
export interface SampleOrderItem {
  productId?: string;
  productName: string;
  quantity: number;
  price?: number;
}

export interface SampleOrder {
  id: string;
  userId?: string;
  items: SampleOrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  trackingNumber?: string;
}

export const sampleOrders: SampleOrder[] = [
  // Processing (pending) orders - 2 items
  { 
    id: 'o1001', 
    userId: 'u1', 
    items: [{ productId: 'p1', productName: 'Premium Running Shoes', quantity: 1, price: 89.99 }], 
    total: 89.99, 
    status: 'pending', 
    createdAt: '2025-10-25' 
  },
  { 
    id: 'o1002', 
    userId: 'u1', 
    items: [
      { productId: 'p2', productName: 'Wireless Earbuds', quantity: 1, price: 79.99 },
      { productId: 'p3', productName: 'Phone Case', quantity: 2, price: 15.99 }
    ], 
    total: 111.97, 
    status: 'pending', 
    createdAt: '2025-10-24' 
  },

  // Confirmed orders - 2 items
  { 
    id: 'o1003', 
    userId: 'u1', 
    items: [{ productId: 'p4', productName: 'Gaming Mouse', quantity: 1, price: 49.99 }], 
    total: 49.99, 
    status: 'confirmed', 
    createdAt: '2025-10-22' 
  },
  { 
    id: 'o1004', 
    userId: 'u1', 
    items: [
      { productId: 'p5', productName: 'Mechanical Keyboard', quantity: 1, price: 129.99 },
      { productId: 'p6', productName: 'Mouse Pad', quantity: 1, price: 19.99 }
    ], 
    total: 149.98, 
    status: 'confirmed', 
    createdAt: '2025-10-20' 
  },

  // Shipped orders - 2 items
  { 
    id: 'o1005', 
    userId: 'u1', 
    items: [{ productId: 'p7', productName: 'Laptop Backpack', quantity: 1, price: 59.99 }], 
    total: 59.99, 
    status: 'shipped', 
    createdAt: '2025-10-18', 
    trackingNumber: 'TRK75001' 
  },
  { 
    id: 'o1006', 
    userId: 'u1', 
    items: [
      { productId: 'p8', productName: 'Smart Watch', quantity: 1, price: 199.99 },
      { productId: 'p9', productName: 'Screen Protector', quantity: 1, price: 12.99 }
    ], 
    total: 212.98, 
    status: 'shipped', 
    createdAt: '2025-10-15', 
    trackingNumber: 'TRK75002' 
  },

  // Delivered orders - 2 items
  { 
    id: 'o1007', 
    userId: 'u1', 
    items: [{ productId: 'p10', productName: 'Bluetooth Speaker', quantity: 1, price: 89.99 }], 
    total: 89.99, 
    status: 'delivered', 
    createdAt: '2025-10-10', 
    trackingNumber: 'TRK75003' 
  },
  { 
    id: 'o1008', 
    userId: 'u1', 
    items: [
      { productId: 'p11', productName: 'Tablet', quantity: 1, price: 329.99 },
      { productId: 'p12', productName: 'Tablet Case', quantity: 1, price: 24.99 },
      { productId: 'p13', productName: 'Screen Cleaner', quantity: 1, price: 9.99 }
    ], 
    total: 364.97, 
    status: 'delivered', 
    createdAt: '2025-10-05', 
    trackingNumber: 'TRK75004' 
  },

  // Cancelled orders - 1 item
  { 
    id: 'o1009', 
    userId: 'u1', 
    items: [{ productId: 'p14', productName: 'Gaming Headset', quantity: 1, price: 149.99 }], 
    total: 149.99, 
    status: 'cancelled', 
    createdAt: '2025-10-01' 
  }
];
