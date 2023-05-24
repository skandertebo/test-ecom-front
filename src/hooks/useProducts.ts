import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { ProductType } from "../types/productType";
import { Product } from "../types/product";
import { useAppContext } from "../context/appContext";
import { apiBaseUrl } from "../config";
export default function useProducts() {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const limitRef = useRef<number>(10);
  const limit = limitRef.current;
  const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);
  const [categories, setCategories] = useState<ProductType[] | undefined>(
    undefined
  );
  const { makeNotification } = useAppContext();
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("-1");
  useEffect(() => {
    const fetchProducts = async () => {
      setIsRefetching(true);
      const params: {
        page: number;
        limit: number;
        type?: string;
      } = {
        page,
        limit
      };
      if (selectedCategory !== "-1") params["type"] = selectedCategory;
      try {
        const res = await axios.get(apiBaseUrl + "product", {
          params
        });
        if (res.data.length < limit) setHasReachedEnd(true);
        setProducts((prev) => {
          if (!prev) return res.data;
          for (let i = 0; i < res.data.length; i++) {
            if (prev.find((product) => product.id === res.data[i].id)) continue;
            prev.push(res.data[i]);
          }
          return [...prev];
        });
      } catch (err) {
        makeNotification({
          type: "error",
          message: "Error fetching products"
        });
      } finally {
        setIsRefetching(false);
      }
    };
    const fetchCategories = async () => {
      const res = await axios.get(apiBaseUrl + "type");
      setCategories(res.data);
    };
    fetchCategories();
    fetchProducts();
  }, [page, limit, selectedCategory]);

  return {
    products,
    page,
    setPage,
    limit,
    hasReachedEnd,
    categories,
    selectedCategory,
    setSelectedCategory,
    setProducts,
    setHasReachedEnd,
    isRefetching
  };
}
