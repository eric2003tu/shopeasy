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
