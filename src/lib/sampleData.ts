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

export interface SampleComment {
  id: string;
  productId: string;
  productName?: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'published' | 'pending' | 'hidden';
  createdAt: string;
}

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
export const sampleRefunds: SampleRefund[] = [
  { id: 'r1', orderId: 'o1001', productId: 'p3', productName: 'Smart Watch Pro', userId: 'u3', userName: 'Clara Nshimiyimana', amount: 249.99, reason: 'Defective screen', status: 'pending', createdAt: '2025-09-20' },
  { id: 'r2', orderId: 'o1002', productId: 'p5', productName: 'Everyday Tote Bag', userId: 'u5', userName: 'Eve Mukasa', amount: 59.99, reason: 'Wrong colour', status: 'approved', createdAt: '2025-08-18' },
  { id: 'r3', orderId: 'o1003', productId: 'p1', productName: 'Premium Running Shoes', userId: 'u2', userName: 'Bob Mwangi', amount: 89.99, reason: 'Too small', status: 'rejected', createdAt: '2025-07-30' },
  { id: 'r4', orderId: 'o1004', productId: 'p9', productName: 'Sportwatch X', userId: 'u6', userName: 'Frank Ntege', amount: 179.99, reason: 'Battery issue', status: 'pending', createdAt: '2025-10-01' },
  { id: 'r5', orderId: 'o1005', productId: 'p11', productName: 'Leather Shoulder Bag', userId: 'u7', userName: 'Grace Karungi', amount: 229.99, reason: 'Arrived late', status: 'pending', createdAt: '2025-10-05' },
];

export const sampleComments: SampleComment[] = [
];

// Testimonials removed — optional UI components should handle absence of testimonials gracefully

export const samplePayments: SamplePayment[] = [
  { id: 'pay1', orderId: 'o1001', transactionId: 'txn_1A2B3C', userId: 'u3', userName: 'Clara Nshimiyimana', gateway: 'Stripe', amount: 249.99, status: 'completed', createdAt: '2025-09-20', items: [ { productId: 'p3', productName: 'Smart Watch Pro', quantity: 1, price: 249.99 } ] },
  { id: 'pay2', orderId: 'o1002', transactionId: 'txn_4D5E6F', userId: 'u5', userName: 'Eve Mukasa', gateway: 'PayPal', amount: 59.99, status: 'completed', createdAt: '2025-08-18', items: [ { productId: 'p5', productName: 'Everyday Tote Bag', quantity: 1, price: 59.99 } ] },
  { id: 'pay3', orderId: 'o1003', transactionId: 'txn_7G8H9I', userId: 'u2', userName: 'Bob Mwangi', gateway: 'M-Pesa', amount: 179.98, status: 'failed', createdAt: '2025-07-30', items: [ { productId: 'p1', productName: 'Premium Running Shoes', quantity: 2, price: 89.99 } ] },
  { id: 'pay4', orderId: 'o1004', transactionId: 'txn_0J1K2L', userId: 'u6', userName: 'Frank Ntege', gateway: 'Stripe', amount: 179.99, status: 'pending', createdAt: '2025-10-01', items: [ { productId: 'p9', productName: 'Sportwatch X', quantity: 1, price: 179.99 } ] },
  { id: 'pay5', orderId: 'o1005', transactionId: 'txn_3M4N5O', userId: 'u7', userName: 'Grace Karungi', gateway: 'Manual', amount: 459.98, status: 'refunded', createdAt: '2025-10-05', items: [ { productId: 'p11', productName: 'Leather Shoulder Bag', quantity: 2, price: 229.99 } ] },
  { id: 'pay6', orderId: 'o1006', transactionId: 'txn_6P7Q8R', userId: 'u1', userName: 'Alice Johnson', gateway: 'Stripe', amount: 95.00, status: 'completed', createdAt: '2025-10-08', items: [ { productId: 'p10', productName: 'Comfort Running Shoes', quantity: 1, price: 95.00 } ] },
];

// Carts and Checkouts for admin/demo use
// Carts, Checkouts and related sample data removed per user request
