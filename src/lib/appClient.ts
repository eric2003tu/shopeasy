// Minimal API client for dummyjson.com products

export interface ApiProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
  // Extended/optional fields that may appear in some product documents
  sku?: string;
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Array<{ rating: number; comment: string; date: string; reviewerName?: string; reviewerEmail?: string }>;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  tags?: string[];
  meta?: Record<string, any>;
}

export interface ListProductsResponse {
  products: ApiProduct[];
  total: number;
  skip: number;
  limit: number;
}

const BASE = 'https://dummyjson.com';

export async function fetchProducts(limit = 30, skip = 0): Promise<ListProductsResponse> {
  const res = await fetch(`${BASE}/products?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

export async function fetchProductById(id: number): Promise<ApiProduct> {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch product ${id}: ${res.status}`);
  return res.json();
}

// Fetch current authenticated user using access token
export async function fetchCurrentUser(accessToken: string): Promise<AuthUser> {
  const res = await fetch(`${BASE}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    // include cookies in case server sets/relies on them
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch current user: ${res.status} ${text}`);
  }
  return res.json();
}

// --- Auth helpers using dummyjson's auth endpoints ---
export interface AuthUser {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  image?: string;
}
export interface LoginResponse {
  id?: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  image?: string;
  accessToken?: string; // JWT
  refreshToken?: string;
}

export async function login(username: string, password: string, expiresInMins = 30): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins }),
    // include cookies in response (dummyjson sets cookies)
    // credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed: ${res.status} ${text}`);
  }
  // Response shape from dummyjson includes user fields + accessToken/refreshToken
  return res.json();
}

export async function signup(payload: { firstName?: string; lastName?: string; username: string; email?: string; password: string; }): Promise<AuthUser> {
  // dummyjson supports creating users via /users/add
  const res = await fetch(`${BASE}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Signup failed: ${res.status} ${text}`);
  }
  return res.json();
}

export function logout(): void {
  // client-side cleanup only; dummyjson has no server logout endpoint
  try {
    localStorage.removeItem('shopeasy_token');
    localStorage.removeItem('shopeasy_user');
  } catch (e) {
    // ignore
  }
}
