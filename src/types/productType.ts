import { Product } from "./product";

export type ProductType = {
  id: number;
  name: string;
  products?: Product[];
};
