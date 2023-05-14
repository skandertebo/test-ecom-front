import { createBrowserRouter } from "react-router-dom";
import React from "react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";

export default createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/product", element: <h1>product</h1> }
    ]
  }
]);
