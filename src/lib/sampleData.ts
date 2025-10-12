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

export const sampleProducts: SampleProduct[] = [
  { id: 'p1', name: 'Premium Running Shoes', description: 'Comfortable and durable running shoes', price: 89.99, images: ['/shoes.jpg'], category: 'Footwear', stock: 24, funded: false, completed: false },
  { id: 'p2', name: 'Designer Handbag', description: 'Stylish handbag for every occasion', price: 199.99, images: ['/bag.jpg'], category: 'Accessories', stock: 12, funded: false, completed: false },
  { id: 'p3', name: 'Smart Watch Pro', description: 'Advanced smartwatch with health tracking', price: 249.99, images: ['/watch.jpg'], category: 'Electronics', stock: 6, funded: false, completed: false },
  { id: 'p4', name: 'Trail Runner Shoes', description: 'Grip and comfort for outdoor runs', price: 99.99, images: ['/shoes.jpg'], category: 'Footwear', stock: 18, funded: true, completed: false },
  { id: 'p5', name: 'Everyday Tote Bag', description: 'Spacious tote for daily essentials', price: 59.99, images: ['/bag.jpg'], category: 'Accessories', stock: 30, funded: false, completed: false },
  { id: 'p6', name: 'Fitness Smartband', description: 'Lightweight band for activity tracking', price: 69.99, images: ['/watch.jpg'], category: 'Electronics', stock: 40, funded: false, completed: true },
  { id: 'p7', name: 'Classic Sneakers', description: 'Timeless style and comfort', price: 79.99, images: ['/shoes.jpg'], category: 'Footwear', stock: 15, funded: false, completed: false },
  { id: 'p8', name: 'Evening Clutch', description: 'Elegant clutch for nights out', price: 89.99, images: ['/bag.jpg'], category: 'Accessories', stock: 8, funded: false, completed: false },
  { id: 'p9', name: 'Sportwatch X', description: 'Durable sports watch with GPS', price: 179.99, images: ['/watch.jpg'], category: 'Electronics', stock: 10, funded: true, completed: false },
  { id: 'p10', name: 'Comfort Running Shoes', description: 'Cushioned soles for long runs', price: 95.0, images: ['/shoes.jpg'], category: 'Footwear', stock: 20, funded: false, completed: false },
  { id: 'p11', name: 'Leather Shoulder Bag', description: 'Premium leather for everyday use', price: 229.99, images: ['/bag.jpg'], category: 'Accessories', stock: 5, funded: false, completed: false },
  { id: 'p12', name: 'Hybrid Smartwatch', description: 'Smart features with classic look', price: 199.99, images: ['/watch.jpg'], category: 'Electronics', stock: 14, funded: false, completed: false },
];

export const sampleUsers: SampleUser[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', organisation: organizations[0] },
  { id: 'u2', name: 'Bob Mwangi', email: 'bob@example.com', role: 'manager', organisation: organizations[1] },
  { id: 'u3', name: 'Clara Nshimiyimana', email: 'clara@example.com', role: 'user', organisation: organizations[2] },
  { id: 'u4', name: 'David Uwimana', email: 'david@example.com', role: 'user', organisation: organizations[3] },
  { id: 'u5', name: 'Eve Mukasa', email: 'eve@example.com', role: 'user', organisation: organizations[4] },
  { id: 'u6', name: 'Frank Ntege', email: 'frank@example.com', role: 'manager', organisation: organizations[5] },
  { id: 'u7', name: 'Grace Karungi', email: 'grace@example.com', role: 'user', organisation: organizations[6] },
  { id: 'u8', name: 'Harrison Kamanzi', email: 'harrison@example.com', role: 'user', organisation: organizations[0] },
];

const data = {
  organizations,
  sampleProducts,
  sampleUsers,
};

export default data;

// Additional sample sets for admin pages
export const sampleRefunds: SampleRefund[] = [
  { id: 'r1', orderId: 'o1001', productId: 'p3', productName: 'Smart Watch Pro', userId: 'u3', userName: 'Clara Nshimiyimana', amount: 249.99, reason: 'Defective screen', status: 'pending', createdAt: '2025-09-20' },
  { id: 'r2', orderId: 'o1002', productId: 'p5', productName: 'Everyday Tote Bag', userId: 'u5', userName: 'Eve Mukasa', amount: 59.99, reason: 'Wrong colour', status: 'approved', createdAt: '2025-08-18' },
  { id: 'r3', orderId: 'o1003', productId: 'p1', productName: 'Premium Running Shoes', userId: 'u2', userName: 'Bob Mwangi', amount: 89.99, reason: 'Too small', status: 'rejected', createdAt: '2025-07-30' },
  { id: 'r4', orderId: 'o1004', productId: 'p9', productName: 'Sportwatch X', userId: 'u6', userName: 'Frank Ntege', amount: 179.99, reason: 'Battery issue', status: 'pending', createdAt: '2025-10-01' },
  { id: 'r5', orderId: 'o1005', productId: 'p11', productName: 'Leather Shoulder Bag', userId: 'u7', userName: 'Grace Karungi', amount: 229.99, reason: 'Arrived late', status: 'pending', createdAt: '2025-10-05' },
];

export const sampleComments: SampleComment[] = [
  { id: 'c1', productId: 'p1', productName: 'Premium Running Shoes', userId: 'u1', userName: 'Alice Johnson', rating: 5, comment: 'Excellent shoes, very comfortable for long runs.', status: 'published', createdAt: '2025-06-12' },
  { id: 'c2', productId: 'p2', productName: 'Designer Handbag', userId: 'u4', userName: 'David Uwimana', rating: 4, comment: 'Stylish and practical.', status: 'published', createdAt: '2025-07-01' },
  { id: 'c3', productId: 'p3', productName: 'Smart Watch Pro', userId: 'u8', userName: 'Harrison Kamanzi', rating: 3, comment: 'Good features but battery could be better.', status: 'pending', createdAt: '2025-09-02' },
  { id: 'c4', productId: 'p4', productName: 'Trail Runner Shoes', userId: 'u2', userName: 'Bob Mwangi', rating: 5, comment: 'Great traction on trails.', status: 'published', createdAt: '2025-08-20' },
  { id: 'c5', productId: 'p6', productName: 'Fitness Smartband', userId: 'u5', userName: 'Eve Mukasa', rating: 2, comment: 'Unreliable heart-rate readings.', status: 'hidden', createdAt: '2025-07-15' },
  { id: 'c6', productId: 'p7', productName: 'Classic Sneakers', userId: 'u3', userName: 'Clara Nshimiyimana', rating: 4, comment: 'Comfortable and clean design.', status: 'published', createdAt: '2025-09-10' },
  { id: 'c7', productId: 'p8', productName: 'Evening Clutch', userId: 'u6', userName: 'Frank Ntege', rating: 5, comment: 'Perfect for nights out.', status: 'published', createdAt: '2025-10-03' },
  { id: 'c8', productId: 'p10', productName: 'Comfort Running Shoes', userId: 'u7', userName: 'Grace Karungi', rating: 4, comment: 'Good cushioning, light weight.', status: 'pending', createdAt: '2025-10-07' },
];

export const samplePayments: SamplePayment[] = [
  { id: 'pay1', orderId: 'o1001', transactionId: 'txn_1A2B3C', userId: 'u3', userName: 'Clara Nshimiyimana', gateway: 'Stripe', amount: 249.99, status: 'completed', createdAt: '2025-09-20', items: [ { productId: 'p3', productName: 'Smart Watch Pro', quantity: 1, price: 249.99 } ] },
  { id: 'pay2', orderId: 'o1002', transactionId: 'txn_4D5E6F', userId: 'u5', userName: 'Eve Mukasa', gateway: 'PayPal', amount: 59.99, status: 'completed', createdAt: '2025-08-18', items: [ { productId: 'p5', productName: 'Everyday Tote Bag', quantity: 1, price: 59.99 } ] },
  { id: 'pay3', orderId: 'o1003', transactionId: 'txn_7G8H9I', userId: 'u2', userName: 'Bob Mwangi', gateway: 'M-Pesa', amount: 179.98, status: 'failed', createdAt: '2025-07-30', items: [ { productId: 'p1', productName: 'Premium Running Shoes', quantity: 2, price: 89.99 } ] },
  { id: 'pay4', orderId: 'o1004', transactionId: 'txn_0J1K2L', userId: 'u6', userName: 'Frank Ntege', gateway: 'Stripe', amount: 179.99, status: 'pending', createdAt: '2025-10-01', items: [ { productId: 'p9', productName: 'Sportwatch X', quantity: 1, price: 179.99 } ] },
  { id: 'pay5', orderId: 'o1005', transactionId: 'txn_3M4N5O', userId: 'u7', userName: 'Grace Karungi', gateway: 'Manual', amount: 459.98, status: 'refunded', createdAt: '2025-10-05', items: [ { productId: 'p11', productName: 'Leather Shoulder Bag', quantity: 2, price: 229.99 } ] },
  { id: 'pay6', orderId: 'o1006', transactionId: 'txn_6P7Q8R', userId: 'u1', userName: 'Alice Johnson', gateway: 'Stripe', amount: 95.00, status: 'completed', createdAt: '2025-10-08', items: [ { productId: 'p10', productName: 'Comfort Running Shoes', quantity: 1, price: 95.00 } ] },
];

// Carts and Checkouts for admin/demo use
export interface SampleCartItem {
  productId?: string;
  productName: string;
  quantity: number;
  price?: number;
}

export interface SampleCart {
  id: string;
  userId?: string;
  guestEmail?: string;
  items: SampleCartItem[];
  subtotal: number;
  total: number;
  status: 'active' | 'abandoned' | 'converted';
  updatedAt: string;
}

export interface SampleCheckout {
  id: string;
  cartId?: string;
  userId?: string;
  email?: string;
  items: SampleCartItem[];
  total: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export const sampleCarts: SampleCart[] = [
  { id: 'cart1', userId: 'u3', items: [{ productId: 'p3', productName: 'Smart Watch Pro', quantity: 1, price: 249.99 }], subtotal: 249.99, total: 249.99, status: 'active', updatedAt: '2025-10-10' },
  { id: 'cart2', guestEmail: 'guest1@example.com', items: [{ productId: 'p2', productName: 'Designer Handbag', quantity: 1, price: 199.99 }, { productId: 'p5', productName: 'Everyday Tote Bag', quantity: 1, price: 59.99 }], subtotal: 259.98, total: 259.98, status: 'abandoned', updatedAt: '2025-10-05' },
  { id: 'cart3', userId: 'u5', items: [{ productId: 'p6', productName: 'Fitness Smartband', quantity: 2, price: 69.99 }], subtotal: 139.98, total: 139.98, status: 'active', updatedAt: '2025-10-09' },
  { id: 'cart4', guestEmail: 'shopper@example.net', items: [{ productId: 'p1', productName: 'Premium Running Shoes', quantity: 1, price: 89.99 }, { productId: 'p7', productName: 'Classic Sneakers', quantity: 1, price: 79.99 }], subtotal: 169.98, total: 169.98, status: 'abandoned', updatedAt: '2025-09-30' },
  { id: 'cart5', userId: 'u2', items: [{ productId: 'p9', productName: 'Sportwatch X', quantity: 1, price: 179.99 }], subtotal: 179.99, total: 179.99, status: 'converted', updatedAt: '2025-10-01' },
  { id: 'cart6', userId: 'u1', items: [{ productId: 'p10', productName: 'Comfort Running Shoes', quantity: 1, price: 95.0 }, { productId: 'p8', productName: 'Evening Clutch', quantity: 1, price: 89.99 }], subtotal: 184.99, total: 184.99, status: 'active', updatedAt: '2025-10-11' },
  { id: 'cart7', guestEmail: 'visitor2@example.org', items: [{ productId: 'p11', productName: 'Leather Shoulder Bag', quantity: 1, price: 229.99 }], subtotal: 229.99, total: 229.99, status: 'abandoned', updatedAt: '2025-10-06' },
  { id: 'cart8', userId: 'u7', items: [{ productId: 'p12', productName: 'Hybrid Smartwatch', quantity: 1, price: 199.99 }, { productId: 'p4', productName: 'Trail Runner Shoes', quantity: 1, price: 99.99 }], subtotal: 299.98, total: 299.98, status: 'active', updatedAt: '2025-10-12' },
  { id: 'cart9', userId: 'u4', items: [{ productId: 'p5', productName: 'Everyday Tote Bag', quantity: 3, price: 59.99 }], subtotal: 179.97, total: 179.97, status: 'converted', updatedAt: '2025-10-02' },
  { id: 'cart10', guestEmail: 'anonymous@example.com', items: [{ productId: 'p1', productName: 'Premium Running Shoes', quantity: 2, price: 89.99 }], subtotal: 179.98, total: 179.98, status: 'abandoned', updatedAt: '2025-09-28' },
  { id: 'cart11', userId: 'u6', items: [{ productId: 'p2', productName: 'Designer Handbag', quantity: 1, price: 199.99 }, { productId: 'p12', productName: 'Hybrid Smartwatch', quantity: 1, price: 199.99 }], subtotal: 399.98, total: 399.98, status: 'active', updatedAt: '2025-10-07' },
  { id: 'cart12', guestEmail: 'guest3@example.com', items: [{ productId: 'p3', productName: 'Smart Watch Pro', quantity: 1, price: 249.99 }, { productId: 'p11', productName: 'Leather Shoulder Bag', quantity: 1, price: 229.99 }], subtotal: 479.98, total: 479.98, status: 'abandoned', updatedAt: '2025-10-03' },
];

export const sampleCheckouts: SampleCheckout[] = [
  {
    id: 'co1',
    cartId: 'cart1',
    userId: 'u3',
    items: [{ productId: 'p3', productName: 'Smart Watch Pro', quantity: 1, price: 249.99 }],
    total: 249.99,
    paymentStatus: 'pending',
    createdAt: '2025-10-10',
  },
  {
    id: 'co2',
    cartId: 'cart2',
    email: 'guest1@example.com',
    items: [{ productId: 'p2', productName: 'Designer Handbag', quantity: 1, price: 199.99 }],
    total: 199.99,
    paymentStatus: 'completed',
    createdAt: '2025-10-05',
  },
  {
    id: 'co3',
    cartId: 'cart3',
    userId: 'u5',
    items: [{ productId: 'p6', productName: 'Fitness Smartband', quantity: 2, price: 69.99 }],
    total: 139.98,
    paymentStatus: 'completed',
    createdAt: '2025-10-09',
  },
  {
    id: 'co4',
    cartId: 'cart4',
    email: 'shopper@example.net',
    items: [{ productId: 'p1', productName: 'Premium Running Shoes', quantity: 1, price: 89.99 }],
    total: 89.99,
    paymentStatus: 'failed',
    createdAt: '2025-09-30',
  },
  {
    id: 'co5',
    cartId: 'cart5',
    userId: 'u2',
    items: [{ productId: 'p9', productName: 'Sportwatch X', quantity: 1, price: 179.99 }],
    total: 179.99,
    paymentStatus: 'pending',
    createdAt: '2025-10-01',
  },
  {
    id: 'co6',
    cartId: 'cart6',
    userId: 'u1',
    items: [{ productId: 'p10', productName: 'Comfort Running Shoes', quantity: 1, price: 95.0 }],
    total: 95.0,
    paymentStatus: 'completed',
    createdAt: '2025-10-11',
  },
  {
    id: 'co7',
    cartId: 'cart7',
    email: 'visitor2@example.org',
    items: [{ productId: 'p11', productName: 'Leather Shoulder Bag', quantity: 1, price: 229.99 }],
    total: 229.99,
    paymentStatus: 'completed',
    createdAt: '2025-10-06',
  },
  {
    id: 'co8',
    cartId: 'cart8',
    userId: 'u7',
    items: [{ productId: 'p12', productName: 'Hybrid Smartwatch', quantity: 1, price: 199.99 }],
    total: 199.99,
    paymentStatus: 'pending',
    createdAt: '2025-10-12',
  },
  {
    id: 'co9',
    cartId: 'cart9',
    userId: 'u4',
    items: [{ productId: 'p5', productName: 'Everyday Tote Bag', quantity: 3, price: 59.99 }],
    total: 179.97,
    paymentStatus: 'completed',
    createdAt: '2025-10-02',
  },
  {
    id: 'co10',
    cartId: 'cart10',
    email: 'anonymous@example.com',
    items: [{ productId: 'p1', productName: 'Premium Running Shoes', quantity: 2, price: 89.99 }],
    total: 179.98,
    paymentStatus: 'failed',
    createdAt: '2025-09-28',
  }
  ,
  {
    id: 'co11',
    cartId: 'cart11',
    userId: 'u6',
    items: [{ productId: 'p2', productName: 'Designer Handbag', quantity: 1, price: 199.99 }, { productId: 'p12', productName: 'Hybrid Smartwatch', quantity: 1, price: 199.99 }],
    total: 399.98,
    paymentStatus: 'completed',
    createdAt: '2025-10-07',
  },
  {
    id: 'co12',
    cartId: 'cart12',
    email: 'guest3@example.com',
    items: [{ productId: 'p3', productName: 'Smart Watch Pro', quantity: 1, price: 249.99 }, { productId: 'p11', productName: 'Leather Shoulder Bag', quantity: 1, price: 229.99 }],
    total: 479.98,
    paymentStatus: 'pending',
    createdAt: '2025-10-03',
  }
];
