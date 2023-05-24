import { Button, Typography } from "@material-tailwind/react";
import useProducts from "../hooks/useProducts";
import { CircularProgress, Skeleton } from "@mui/material";
import shouldDisplayDefaultImage from "../utils/shouldDisplayDefaultImage";
import { apiBaseUrl, imageBaseUrl } from "../config";
import { useEffect, useState } from "react";
import { Product } from "../types/product";
import { TrashIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/appContext";
import { ProductSale } from "../types/productSale";

type ProductData = Partial<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in keyof Product]: any;
}>;
export default function AdminProductPage() {
  const { products, page, setPage, hasReachedEnd, setProducts, isRefetching } =
    useProducts();

  const [pendingToDelete, setPendingToDelete] = useState<Product | null>(null);
  const { enableWaiting, disableWaiting, makeNotification } = useAppContext();

  const [sales, setSales] = useState<ProductSale[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const response = await axios.get(apiBaseUrl + "sale");
      setSales(response.data);
    })();
  }, []);

  const deleteProduct = async (id: number) => {
    enableWaiting();
    await axios.delete(`/api/product/${id}`);
    setProducts((prev) => prev && prev.filter((product) => product.id !== id));
    setPendingToDelete(null);
    makeNotification({
      type: "success",
      message: "Product deleted successfully"
    });
  };

  const handleEditProduct = async (product: Product, newData: ProductData) => {
    try {
      enableWaiting();
      await axios.put(`/api/product/${product.id}`, {
        ...newData
      });
      setProducts(
        (prev) =>
          prev &&
          prev.map((prevProduct) =>
            prevProduct.id === product.id ? product : prevProduct
          )
      );
      makeNotification({
        type: "success",
        message: "Product edited successfully"
      });
    } catch (e) {
      makeNotification({
        type: "error",
        message: "Error editing Product"
      });
    } finally {
      disableWaiting();
    }
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <header className="w-full text-center py-12">
          <Typography variant="h3" className="text-2xl font-bold">
            Admin Product Page
          </Typography>
        </header>
        <div className="flex flex-col gap-4 w-full px-2 md:px-12 py-8">
          <div className="flex flex-col items-center md:items-start gap-4 w-full">
            <Link to="/admin/products/create">
              <Button className="bg-cyan-900 px-4">Create Product</Button>
            </Link>
          </div>
          <div className="flex justify-center md:justify-start flex-wrap gap-6 w-full">
            {products ? (
              products.map((product) => (
                <ProductItem
                  product={product}
                  key={product.id}
                  onDelete={(product) => setPendingToDelete(product)}
                  sales={sales}
                  onEditProduct={handleEditProduct}
                />
              ))
            ) : (
              <CircularProgress
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              />
            )}
          </div>
          {isRefetching ? (
            <div className="flex flex-col items-center gap-2">
              <Skeleton variant="text" width={100} />
            </div>
          ) : (
            !hasReachedEnd &&
            products && (
              <div className="flex justify-center">
                <button
                  onClick={() => setPage(page + 1)}
                  className="text-cyan-800"
                >
                  Load More
                </button>
              </div>
            )
          )}
        </div>
      </div>
      {pendingToDelete && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="flex flex-col gap-4 p-4 bg-white rounded-md">
            <Typography variant="h5">
              Are you sure you want to delete this product?
            </Typography>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-green-500 rounded-md text-white"
                onClick={() => {
                  setPendingToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary rounded-md text-white"
                onClick={() => {
                  deleteProduct(pendingToDelete.id).finally(() => {
                    setPendingToDelete(null);
                    disableWaiting();
                  });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProductItem({
  product,
  onDelete,
  sales,
  onEditProduct
}: {
  product: Product;
  onDelete: (product: Product) => void;
  sales?: ProductSale[] | undefined;
  onEditProduct?: (
    product: Product,
    editedFields: ProductData
  ) => void | Promise<void>;
}) {
  const [editedFields, setEditedFields] = useState<ProductData>({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditedFieldsChange = (name: keyof Product, value: any) => {
    if (name === "sale" && value === "") {
      setEditedFields((prev) => {
        delete prev.sale;
        return prev;
      });
    }
    if (product[name] === value) {
      setEditedFields((prev) => {
        delete prev[name];
        return prev;
      });
    }
    setEditedFields((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setEditedFields({});
  };

  return (
    <div
      className="flex flex-col gap-2 relative shadow-lg p-4 border border-primary rounded-md bg-secondary"
      key={product.id}
    >
      <div className="absolute top-2 right-2">
        <TrashIcon
          className="w-6 h-6 cursor-pointer"
          onClick={() => onDelete(product)}
        />
      </div>
      <img
        src={
          shouldDisplayDefaultImage(product.images)
            ? "https://via.placeholder.com/300x300"
            : imageBaseUrl + "/" + product.images[0]
        }
        alt={product.name}
        className="w-48 h-48 object-contain"
      />
      <div className="flex flex-col gap-1 w-min">
        <Typography variant="h6">{product.name}</Typography>
        {product.description && (
          <Typography className="break-words">
            {product.description.length > 20
              ? product.description.slice(0, 40) + "..."
              : product.description}
          </Typography>
        )}
        <Typography className="font-bold">{product.basePrice}$</Typography>
        <Typography>{product.type.name}</Typography>
        <div className="flex flex-wrap gap-2 items-center">
          <Typography>Sale:</Typography>
          {sales ? (
            <select
              className="px-2 py-1 rounded-md border border-primary"
              value={editedFields.sale || product.sale?.id || ""}
              onChange={(e) => {
                handleEditedFieldsChange("sale", e.target.value);
              }}
            >
              <option value="">None</option>
              {sales.map((sale, idx) => (
                <option key={idx} value={sale.id}>
                  {sale.name + "-" + sale.rate * 100 + "%"}
                </option>
              ))}
            </select>
          ) : (
            <CircularProgress size={20} />
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          className="bg-cyan-900 px-4"
          onClick={() => {
            handleReset();
          }}
          disabled={Object.keys(editedFields).length === 0}
        >
          Reset
        </Button>
        <Button
          className="bg-primary px-4"
          onClick={() => {
            onEditProduct?.(product, editedFields);
          }}
          disabled={Object.keys(editedFields).length === 0}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
