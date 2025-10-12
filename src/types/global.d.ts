interface ShopeasyProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category?: string;
  stock?: number;
  featured?: boolean;
}

declare global {
  interface Window {
    __SHOPEASY_DEFAULT_PRODUCTS?: ShopeasyProduct[];
  }
}

export {};
declare global {
  interface Window {
    __SHOPEASY_DEFAULT_PRODUCTS?: import('../components/small/UplaodedProducts').Product[];
  }
}

export {};
