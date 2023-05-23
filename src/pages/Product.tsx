import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/appContext";
import { Product } from "../types/product";
import { Skeleton } from "@mui/material";
import { imageBaseUrl } from "../config";
import { Button } from "@material-tailwind/react";
import shouldDisplayDefaultImage from "../utils/shouldDisplayDefaultImage";
export default function ProductPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const {
    makeNotification,
    addToCart,
    addToFavorites,
    removeFromFavorites,
    favorites
  } = useAppContext();

  useEffect(() => {
    (async () => {
      const response = await axios.get(`/api/product/${id}`);
      setProduct(response.data);
    })();
  }, [id]);

  return (
    <div className="flex flex-col p-8 items-center">
      {!product ? (
        <div className="flex flex-col">
          <Skeleton variant="rectangular" width={300} height={300} />
          <Skeleton variant="text" width={170} height={40} />
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={300} height={40} />
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <img
              src={
                shouldDisplayDefaultImage(product.images)
                  ? "https://via.placeholder.com/300x300"
                  : imageBaseUrl + "/" + product.images[0]
              }
              alt={product.name}
              className="h-96 object-contain"
            />
            <div className="flex flex-col gap-1 mt-4">
              <h1 className="text-xl font-bold">{product.name}</h1>
              {product.sale && (
                <div className="flex flex-col">
                  <p className="text-lg font-bold text-red-500">
                    {product.sale.rate * 100} + %OFF!
                  </p>
                  <p className="text-lg font-bold line-through">
                    {product.basePrice}$
                  </p>
                </div>
              )}

              <p className="text-lg font-bold">
                {product.sale
                  ? (product.basePrice * (1 - product.sale.rate)).toFixed(2) +
                    "$"
                  : product.basePrice}
                $
              </p>
              <p className="text-lg break-words">
                Description: &nbsp;
                {product.description || "No description available"}
              </p>
              <div className="flex flex-wrap gap-4 items-center mt-4">
                <Button
                  className="bg-cyan-900 text-xs"
                  onClick={() => {
                    addToCart({ product, quantity: 1 });
                    makeNotification({
                      message: "Added to cart",
                      type: "success"
                    });
                  }}
                >
                  Add to cart
                </Button>
                <Button
                  className="bg-cyan-900 text-xs"
                  onClick={() => {
                    if (
                      favorites.find(
                        (favorite) => favorite.product.id === product.id
                      )
                    ) {
                      removeFromFavorites(product.id);
                      makeNotification({
                        message: "Removed from favorites",
                        type: "success"
                      });
                      return;
                    }
                    addToFavorites({
                      product
                    });
                    makeNotification({
                      message: "Added to favorites",
                      type: "success"
                    });
                  }}
                >
                  {!favorites.find(
                    (favorite) => favorite.product.id === product.id
                  )
                    ? "Add to favorites"
                    : "Remove from favorites"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
