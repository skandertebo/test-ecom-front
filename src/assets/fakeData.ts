import { Product } from "../types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "pc",
    type: {
      id: 1,
      name: "electronics"
    },
    basePrice: 4500,
    stockQuantity: 10,
    sale: null,
    images: [],
    description: null
  },
  {
    id: 2,
    name: "pc",
    type: {
      id: 1,
      name: "electronics"
    },
    basePrice: 4500,
    stockQuantity: 10,
    sale: null,
    images: [],
    description: null
  },
  {
    id: 3,
    name: "iphone20",
    type: {
      id: 1,
      name: "electronics"
    },
    basePrice: 4500,
    stockQuantity: 10,
    sale: {
      id: 1,
      rate: 0.1,
      expireAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      expired: false
    },
    images: [],
    description: null
  }
];
