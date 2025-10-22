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
