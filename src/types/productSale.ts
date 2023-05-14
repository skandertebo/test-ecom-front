import { Product } from "./product";

export type ProductSale = {
  id: number;
  rate: number;
  expireAt: number | null; // timestamp
  products?: Product[];
  expired: boolean;
};
