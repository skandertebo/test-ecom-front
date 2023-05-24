/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography } from "@material-tailwind/react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { FormEventHandler, useEffect, useReducer, useState } from "react";
import { ProductType } from "../types/productType";
import { useAppContext } from "../context/appContext";
import { apiBaseUrl } from "../config";

const initialState = {
  name: "",
  description: "",
  basePrice: 0,
  type: "",
  stockQuantity: 0,
  images: []
};

const reducer = (state: any, action: any) => {
  const formEl = document.getElementById("add-product-form") as HTMLFormElement;
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload };
    case "description":
      return { ...state, description: action.payload };
    case "basePrice":
      if (isNaN(action.payload) || parseFloat(action.payload) < 0) return state;
      return { ...state, basePrice: action.payload };
    case "type":
      return { ...state, type: action.payload };
    case "stockQuantity":
      if (isNaN(action.payload) || parseInt(action.payload) < 0) return state;
      return { ...state, stockQuantity: action.payload };
    case "images":
      return { ...state, images: [...state.images, action.payload] };
    case "reset":
      formEl?.reset();
      return initialState;
    default:
      return state;
  }
};

export default function AddProduct() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [categories, setCategories] = useState<ProductType[] | undefined>(
    undefined
  );
  const { enableWaiting, disableWaiting, makeNotification } = useAppContext();
  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    enableWaiting();
    try {
      const form = document.getElementById(
        "add-product-form"
      ) as HTMLFormElement;
      const formData = new FormData(form);
      formData.delete("images");
      if (state.images.length === 1) {
        formData.append("image", state.images[0]);
      } else {
        for (const image of state.images) {
          formData.append("images[]", image);
        }
      }
      await axios.post(form.action, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      dispatch({ type: "reset" });
      makeNotification({
        type: "success",
        message: "Product added successfully"
      });
    } catch (err) {
      makeNotification({
        type: "error",
        message: "Error adding product"
      });
    } finally {
      disableWaiting();
    }
  };

  useEffect(() => {
    async function getCategories() {
      const res = await axios.get(apiBaseUrl + "type");
      setCategories(res.data);
    }
    getCategories();
  }, []);

  if (!categories) {
    return (
      <CircularProgress className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    );
  }
  return (
    <div className="w-full flex flex-col items-center">
      <header className="text-center px-12 py-6">
        <Typography className="text-xl font-bold">Add Product</Typography>
      </header>
      <div className="flex flex-col p-8 border border-primary rounded-md">
        <form
          id="add-product-form"
          className="flex flex-col gap-6"
          action={apiBaseUrl + "product"}
          method="post"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="border border-gray-400 rounded-md p-2"
              value={state.name}
              onChange={(e) =>
                dispatch({ type: "name", payload: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              className="border border-gray-400 rounded-md p-2"
              value={state.description}
              onChange={(e) =>
                dispatch({ type: "description", payload: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="basePrice">Base Price</label>
            <input
              type="number"
              name="basePrice"
              id="basePrice"
              className="border border-gray-400 rounded-md p-2"
              value={state.basePrice}
              onChange={(e) =>
                dispatch({ type: "basePrice", payload: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="type">Type</label>
            <select
              name="type"
              id="type"
              className="border border-gray-400 rounded-md p-2"
              value={state.type}
              onChange={(e) =>
                dispatch({ type: "type", payload: e.target.value })
              }
            >
              {categories &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="stockQuantity">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              id="stockQuantity"
              className="border border-gray-400 rounded-md p-2"
              value={state.stockQuantity}
              onChange={(e) =>
                dispatch({ type: "stockQuantity", payload: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="images">Image</label>
            <input
              type="file"
              name="images"
              id="images"
              multiple
              accept="image/*"
              className="border border-gray-400 rounded-md p-2"
              onChange={(e) => {
                e.target.files &&
                  dispatch({ type: "images", payload: e.target.files[0] });
              }}
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white rounded-md p-2"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
