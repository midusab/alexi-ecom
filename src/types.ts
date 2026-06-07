export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  image: string;
  features: string[];
  specs: {
    screen: string;
    processor: string;
    ram: string;
    storage: string;
    battery: string;
    camera: string;
  };
  reviews?: Review[];
  videoUrl?: string;
  isFeatured?: boolean;
  isOffer?: boolean;
  offerText?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: { id: string; name: string; quantity: number; price: number; image?: string; brand?: string }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  location?: string;
  orders: Order[];
  notifications: Notification[];
}
