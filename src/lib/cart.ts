// Small cart utility using localStorage
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

const CART_KEY = 'cart';

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY) || '[]';
    return JSON.parse(raw) as CartItem[];
  } catch (_err) {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // notify subscribers
    try { notifyCartSubscribers(); } catch { /* swallow */ }
  } catch {
    // ignore
  }
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.quantity = (existing.quantity || 0) + (item.quantity || 1);
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

// --- simple in-memory pub/sub so UI can react to cart changes in the same tab ---
type CartChangeCallback = (cart: CartItem[]) => void;
const cartSubscribers = new Set<CartChangeCallback>();

function notifyCartSubscribers() {
  const cart = getCart();
  cartSubscribers.forEach(cb => {
    try { cb(cart); } catch { /* ignore subscriber errors */ }
  });
}

export function subscribeCart(cb: CartChangeCallback) {
  cartSubscribers.add(cb);
  // call immediately with current state
  try { cb(getCart()); } catch {}
  return () => { cartSubscribers.delete(cb); };
}

export function getCartCount() {
  return getCart().reduce((s, it) => s + (it.quantity || 0), 0);
}

// Fetch carts for a user from dummyjson and return the most recent cart (or null)
export async function fetchUserCarts(userId: number) {
  const res = await fetch(`https://dummyjson.com/carts/user/${userId}`);
  if (!res.ok) return null;
  const data = await res.json();
  // dummyjson returns { carts: [...] }
  const carts = data?.carts || [];
  if (!Array.isArray(carts) || carts.length === 0) return null;
  // pick the cart with highest id (most recent)
  carts.sort((a: { id?: number }, b: { id?: number }) => (b.id || 0) - (a.id || 0));
  return carts[0];
}

// Merge a remote cart (shape from dummyjson cart object) into local cart by summing quantities
export function mergeServerCart(remoteCart: { products?: Array<{ id: number; quantity?: number; title?: string; name?: string; price?: number; thumbnail?: string; image?: string; }> } | null) {
  if (!remoteCart || !Array.isArray(remoteCart.products)) return;
  const local = getCart();
  const localMap = new Map<string, CartItem>();
  local.forEach(it => localMap.set(it.id, { ...it }));

  remoteCart.products.forEach((p) => {
    const id = String(p.id);
    const qty = Number(p.quantity || 0);
    const name = (p.title as string) || (p.name as string) || `Product ${id}`;
    const price = Number(p.price || 0);
    const image = (p.thumbnail as string) || (p.image as string) || undefined;
    if (localMap.has(id)) {
      const existing = localMap.get(id)!;
      existing.quantity = (existing.quantity || 0) + qty;
    } else {
      localMap.set(id, { id, name, price, image, quantity: qty });
    }
  });

  const merged = Array.from(localMap.values());
  saveCart(merged);
}

export async function mergeServerCartFromUser(userId: number) {
  try {
    const cart = await fetchUserCarts(userId);
    if (cart) {
      mergeServerCart(cart);
      return cart;
    }
  } catch (_e) {
    // ignore errors
  }
  return null;
}

// Try to sync a client cart to the dummyjson carts/add endpoint.
// Returns the remote cart response or throws on failure.
export async function syncCartToServer(userId: number, token: string | null) {
  const cart = getCart();
  if (!cart || cart.length === 0) return null;
  const products = cart.map(c => ({ id: Number(c.id), quantity: c.quantity }));
  const res = await fetch('https://dummyjson.com/carts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, products }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to sync cart: ${res.status} ${text}`);
  }
  return res.json();
}

export function updateQuantity(id: string, quantity: number) {
  const cart = getCart();
  const item = cart.find(c => c.id === id);
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      const idx = cart.findIndex(c => c.id === id);
      if (idx >= 0) cart.splice(idx, 1);
    }
    saveCart(cart);
  }
}

export function clearCart() {
  try {
    localStorage.removeItem(CART_KEY);
  } catch {
    // ignore
  }
}
