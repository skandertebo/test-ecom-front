import { Select, Option } from "@material-tailwind/react";
import ItemCard from "./ItemCard";
import { Skeleton } from "@mui/material";
import useProducts from "../hooks/useProducts";
export default function CatalogueSection(): JSX.Element {
  const {
    categories,
    products,
    selectedCategory,
    setSelectedCategory,
    page,
    setPage,
    hasReachedEnd,
    isRefetching,
    setHasReachedEnd,
    setProducts
  } = useProducts();

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
        {isRefetching ? (
          <div className="flex flex-col items-center gap-2">
            <Skeleton variant="text" width={100} />
          </div>
        ) : (
          !hasReachedEnd && (
            <button
              onClick={() => setPage(page + 1)}
              className="border-none text-sm text-cyan-800"
            >
              Load More
            </button>
          )
        )}
      </div>
    </div>
  );
}
