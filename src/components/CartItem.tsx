import { ICartItem, useAppContext } from "../context/appContext";
import shouldDisplayDefaultImage from "../utils/shouldDisplayDefaultImage";
import shoeImage from "../assets/images/shoe.png";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useCallback, useEffect, useState } from "react";
import useId from "@mui/material/utils/useId";
import { imageBaseUrl } from "../config";
export default function CartItem(item: ICartItem): JSX.Element {
  const { editQuantity, removeFromCart } = useAppContext();
  const [quantityInput, setQuantityInput] = useState(item.quantity);

  const imageId = useId() as string;
  const handleImageError = useCallback((e: ErrorEvent) => {
    const imageTarget = e.target as HTMLImageElement;
    imageTarget.src = shoeImage;
  }, []);

  useEffect(() => {
    document
      .getElementById(imageId)
      ?.addEventListener("error", handleImageError);
    return () => {
      document
        .getElementById(imageId)
        ?.removeEventListener("error", handleImageError);
    };
  }, []);

  return (
    <div className="flex flex-col w-full gap-4 relative">
      <button
        onClick={() => {
          removeFromCart(item.product.id);
        }}
        className="absolute top-2 right-2"
      >
        <TrashIcon className="top-1 right-1 w-6 h-6 text-primary" />
      </button>

      <div className="flex gap-2 items-center">
        <div className="flex flex-col w-[120px]">
          <h1 className="text-lg font-semibold">Name: {item.product.name}</h1>
          <h1 className="text-lg font-semibold">
            Price: {item.product.basePrice}
          </h1>
          <div className="flex items-center">
            <h1 className="text-sm font-semibold">Quantity:</h1>
            <input
              type="number"
              className="w-14 px-2 h-8 border border-gray-300 rounded-md ml-2"
              value={quantityInput}
              onChange={(e) => {
                if (e.target.value === "")
                  return setQuantityInput((prev) => prev);
                if (parseInt(e.target.value) <= 0)
                  return setQuantityInput((prev) => prev);
                setQuantityInput(parseInt(e.target.value));
                editQuantity(item.product.id, parseInt(e.target.value));
              }}
            />
          </div>
        </div>
        <img
          src={
            shouldDisplayDefaultImage(item.product.images[0])
              ? shoeImage
              : imageBaseUrl + "/" + item.product.images[0]
          }
          alt="product"
          className="h-48 aspect-square"
          id={imageId}
        />
      </div>
    </div>
  );
}
