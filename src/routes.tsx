import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Favourites from "./pages/Favourites";

export default createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/favourites", element: <Favourites /> },
      { path: "/cart", element: <Cart /> }
    ]
  }
]);
