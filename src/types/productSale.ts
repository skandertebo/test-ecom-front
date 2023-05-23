import { Product } from "./product";

export type ProductSale = {
  id: number;
  rate: number;
  expireDate: number | string | null; // timestamp
  products?: Product[];
  expired: boolean;
  name: string;
};
