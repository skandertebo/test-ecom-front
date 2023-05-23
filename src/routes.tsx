import { Navigate, createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Favourites from "./pages/Favourites";
import AdminLayout from "./layouts/AdminLayout";
import AdminProductsPage from "./pages/AdminProductPage";
import AddProduct from "./pages/AddProduct";
import AdminTypesPage from "./pages/AdminTypesPage";
import AdminSalesPage from "./pages/AdminSalesPage";
import ProductPage from "./pages/Product";

export default createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "products/:id",
        element: <ProductPage />
      },
      { path: "/favourites", element: <Favourites /> },
      { path: "/cart", element: <Cart /> }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "products", element: <AdminProductsPage /> },
      {
        path: "",
        element: <Navigate to="/admin/products" />
      },
      {
        path: "products/create",
        element: <AddProduct />
      },
      {
        path: "categories",
        element: <AdminTypesPage />
      },
      {
        path: "sales",
        element: <AdminSalesPage />
      }
    ]
  }
]);
