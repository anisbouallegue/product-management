export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  discount?: number;
  stock: number;
  media: {
    images: string[];  // URLs
    model3d?: string;  // URL
  };
  variants: Variant[];
  tags: string[];
  rating: number;
  reviews: Review[];
  businessId: number;
  promoted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Variant {
  id: number;
  name: string;
  price?: number;
  stock?: number;
}


export interface Review {
  id: number;
  userId: number;
  rating: number;
  comment: string;
  helpfulVotes: number;
  photoUrls?: string[];
  createdAt: Date;
}