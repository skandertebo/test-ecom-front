import { Select, Option } from "@material-tailwind/react";
import axios from "axios";
import ItemCard from "./ItemCard";
import { useEffect, useRef, useState } from "react";
import { Product } from "../types/product";
import { Skeleton } from "@mui/material";
import { ProductType } from "../types/ProductType";
export default function CatalogueSection(): JSX.Element {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const limitRef = useRef<number>(10);
  const limit = limitRef.current;
  const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);
  const [categories, setCategories] = useState<ProductType[] | undefined>(
    undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("-1");
  useEffect(() => {
    const fetchProducts = async () => {
      const params: {
        page: number;
        limit: number;
        type?: string;
      } = {
        page,
        limit
      };
      if (selectedCategory !== "-1") params["type"] = selectedCategory;
      const res = await axios.get("/api/product", {
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
    };
    const fetchCategories = async () => {
      const res = await axios.get("/api/type");
      setCategories(res.data);
    };
    fetchCategories();
    fetchProducts();
  }, [page, limit, selectedCategory]);

  return (
    <div
      id="catalogueSection"
      className="py-24 px-8 lg:px-0 flex flex-col gap-8 items-center w-full lg:w-[80%] max-w-[900px] mx-auto"
    >
      <div className="flex flex-col w-full">
        <h1 className="text-4xl font-bold">Catalogue</h1>
        <h1 className="text-2xl font-medium">Check out our latest products</h1>
      </div>
      <div className="flex p-2 border rounded-lg w-full border-blue-gray-600">
        <div className="">
          {categories ? (
            <Select
              label="Category"
              value="-1"
              onChange={(val) => {
                val && setSelectedCategory(val);
                setPage(1);
                setProducts(undefined);
                setHasReachedEnd(false);
              }}
            >
              {[{ id: "-1", name: "all" }, ...categories].map((category) => (
                <Option value={category.id.toString()} key={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          ) : (
            <Skeleton variant="rectangular" width={200} height={40} />
          )}
        </div>
      </div>
      <div className="flex flex-wrap justify-center xs:justify-start w-full gap-x-16 gap-y-8 max-h-3/4">
        {!products
          ? Array(20)
              .fill(0)
              .map((_, idx) => (
                <div className="flex flex-col gap-2" key={idx}>
                  <Skeleton variant="rounded" width={210} height={160} />{" "}
                  <div className="flex flex-col gap-1">
                    <Skeleton
                      variant="text"
                      width={100}
                      sx={{ fontSize: "0.8rem" }}
                    />
                    <Skeleton
                      variant="text"
                      width={100}
                      sx={{ fontSize: "0.8rem" }}
                    />
                  </div>
                </div>
              ))
          : products.map((product, idx) => (
              <ItemCard product={product} key={idx} />
            ))}
      </div>
      {products?.length === 0 && (
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">No products found</h1>
          {selectedCategory !== "-1" && (
            <h1 className="text-lg font-medium">
              Try changing the category or check back later
            </h1>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {!hasReachedEnd && (
          <button
            onClick={() => setPage(page + 1)}
            className="border-none text-sm text-cyan-800"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
