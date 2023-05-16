import { Typography } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import logo from "../assets/images/Shoppie.png";
import { ShoppingCartIcon } from "@heroicons/react/20/solid";
import useViewport from "../hooks/useViewport";
import { Bars3Icon } from "@heroicons/react/24/outline";

const navtopRoutes = [
  {
    path: "/",
    name: "Home"
  },
  {
    path: "/favourites",
    name: "Favourites"
  }
];

const breakpoint = 390;

export default function Navtop() {
  const path = useLocation().pathname;
  const { width } = useViewport();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="w-screen px-4 md:px-24 py-4 bg-primary flex justify-between">
      {width > breakpoint ? (
        <>
          <div className="flex gap-4 items-center">
            <img src={logo} alt="logo" className="h-8 me-6" />
            <NavRoutes currentPath={path} />
          </div>
          <div className="flex items-center">
            <Link
              to={"/cart"}
              className="flex bg-orange py-2 px-4 gap-4 rounded-md items-center"
            >
              <ShoppingCartIcon className="h-4 w-4 text-white" />
              <Typography className="text-white text-sm">Cart</Typography>
            </Link>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col gap-8">
          <div className="flex gap-4 items-center justify-between w-full">
            <img src={logo} alt="logo" className="h-8 me-6" />
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <button className="flex bg-orange py-[6px] px-[10px] gap-4 rounded-md items-center">
                  <ShoppingCartIcon className="h-4 w-4 text-white" />
                  <Typography className="text-white text-xs">Cart</Typography>
                </button>
              </div>
              <Bars3Icon
                className="h-6 w-6 text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>
          </div>
          {isMenuOpen && (
            <div className="flex flex-col gap-4">
              <NavRoutes currentPath={path} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const NavRoutes: React.FC<{ currentPath: string }> = ({ currentPath }) => {
  return (
    <>
      {navtopRoutes.map((route) => {
        const pathColorClassName =
          currentPath === route.path ? "text-white" : "text-gray";
        return (
          <Link to={route.path} key={route.path}>
            <Typography className={pathColorClassName + " font-semibold"}>
              {route.name}
            </Typography>
          </Link>
        );
      })}
    </>
  );
};
