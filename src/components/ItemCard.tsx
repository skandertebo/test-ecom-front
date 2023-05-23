import React, { useEffect, useId, useMemo } from "react";
import { Product } from "../types/product";
import shouldDisplayDefaultImage from "../utils/shouldDisplayDefaultImage";
import shoeImage from "../assets/images/shoe.png";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useAppContext } from "../context/appContext";
import { imageBaseUrl } from "../config";
import { Link } from "react-router-dom";

const ItemCard: React.FC<{ product: Product }> = ({ product }) => {
  const {
    addToCart,
    addToFavorites,
    favorites,
    removeFromFavorites,
    makeNotification
  } = useAppContext();

  const isProductInFavorites = useMemo(
    () => favorites?.findIndex((fav) => fav.product.id === product.id) !== -1,
    [favorites, product.id]
  );
  const imageId = useId();
  useEffect(() => {
    document.getElementById(imageId)?.addEventListener("error", (e) => {
      (e.target as HTMLImageElement).src = shoeImage;
    });
    return () => {
      document.getElementById(imageId)?.removeEventListener("error", (e) => {
        (e.target as HTMLImageElement).src = shoeImage;
      });
    };
  }, []);
  return (
    <div className="flex flex-col relative">
      <button
        onClick={() => {
          !isProductInFavorites
            ? addToFavorites({
                product
              })
            : removeFromFavorites(product.id);
        }}
      >
        {isProductInFavorites ? (
          <StarIconSolid className="absolute top-1 left-1 w-6 h-6 text-orange z-40" />
        ) : (
          <StarIcon className="absolute top-1 left-1 w-6 h-6 text-yellow z-40" />
        )}{" "}
      </button>
      <Link to={`/products/${product.id}`}>
        <img
          src={
            shouldDisplayDefaultImage(product.images)
              ? shoeImage
              : imageBaseUrl + "/" + product.images[0]
          }
          id={imageId}
          alt=""
          className="w-full h-40 aspect-square object-cover hover:scale-[1.05] hover:shadow-md transition-all"
        />
      </Link>
      <div className="flex flex-col justify-center">
        <Link to={`/products/${product.id}`}>
          <h1 className="text-xl font-medium hover:text-cyan-800 transition-colors">
            {product.name}
          </h1>
        </Link>
        {product.sale && (
          <h1 className="text-sm font-semibold text-red-500">
            {product.sale.rate * 100}% OFF
          </h1>
        )}
        {product.sale ? (
          <div className="flex gap-2">
            <h1 className="text-lg font-medium line-through">
              ${product.basePrice}
            </h1>
            <h1 className="text-lg font-semibold text-red-500">
              $
              {(
                product.basePrice -
                product.basePrice * product.sale.rate
              ).toFixed(2)}
            </h1>
          </div>
        ) : (
          <h1 className="text-xl font-semibold">${product.basePrice}</h1>
        )}
        <button
          className="bg-primary self-start text-white rounded-lg py-2 px-4 text-sm mt-2 hover:scale-[1.1] transition-all"
          onClick={() => {
            addToCart({
              product,
              quantity: 1
            });
            makeNotification({
              type: "success",
              message: "Added to cart"
            });
          }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
