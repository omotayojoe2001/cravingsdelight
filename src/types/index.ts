export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  sizes?: { [key: string]: number };
  category: 'rice' | 'soup' | 'sides' | 'special';
  image?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  customizationNote?: string;
  spiceLevel: 'Mild' | 'Medium' | 'Hot';
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'PayPal' | 'Stripe';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

export interface CateringRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  eventDate?: string;
  eventLocation: string;
  numberOfGuests: number;
  requirements: string;
  submittedAt: Date;
  responseSentAt?: Date;
}

export interface Review {
  id: string;
  customerName?: string;
  rating?: number;
  reviewText: string;
  submittedAt: Date;
}
