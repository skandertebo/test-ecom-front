import { useAppContext } from "../context/appContext";
import CartItem from "../components/CartItem";
import { Button, Typography } from "@material-tailwind/react";
import { Divider } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
export default function Cart(): JSX.Element {
  const { cart } = useAppContext();
  return (
    <div className="flex flex-col w-screen items-center gap-4 md:pt-8">
      <Typography className="text-2xl font-bold">Cart</Typography>
      <div className="flex flex-col items-center gap-8 max-h-[70vh] md:max-h-[70vh] shadow-lg rounded-md md:px-8 py-12 overflow-y-auto">
        {cart.length > 0 ? (
          cart.map((item) => (
            <React.Fragment key={item.product.id}>
              <CartItem {...item} />
              <Divider
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#000000",
                  marginTop: "10px",
                  marginBottom: "10px"
                }}
              />
            </React.Fragment>
          ))
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Typography className="text-2xl font-bold">
              Cart is empty
            </Typography>
            <Link to={"/"}>
              <Typography className="font-bold text-light-blue-400">
                Continue Shopping
              </Typography>
            </Link>
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className="flex gap-2">
          <Button className="bg-cyan-800">Checkout</Button>
          <Link to={"/"}>
            <Button color="green">Continue Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
