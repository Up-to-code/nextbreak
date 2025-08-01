// types/product.ts
export interface Product {
    name: string;
    price: number;
    originalPrice: number;
    description: string;
    details: {
      dimensions: string;
      materials: string;
      weight: string;
      care: string;
      assembly: string;
      warranty: string;
    };
    features: string[];
    colors: Array<{
      id: string;
      name: string;
      hex: string;
    }>;
    materials: Array<{
      id: string;
      name: string;
    }>;
    reviews: Array<{
      rating: number;
      name: string;
      comment: string;
      date: string;
    }>;
  }
  
  export interface RelatedProduct {
    name: string;
    price: number;
  }
  