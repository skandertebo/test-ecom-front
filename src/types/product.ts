import { ProductType } from "./ProductType";
import { ProductSale } from "./productSale";

export type Product = {
  id: number;
  name: string;
  type: ProductType;
  basePrice: number;
  stockQuantity: number;
  sale: ProductSale | null;
  images: string[];
  description: string | null;
};
