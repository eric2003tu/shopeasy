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
  } catch (err) {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
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
