import { ProductSale } from "./productSale";
import { ProductType } from "./productType";

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
