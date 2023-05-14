import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes.tsx";
import { AppContextProvider } from "./context/appContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider>
      <RouterProvider router={routes} />
    </AppContextProvider>
  </React.StrictMode>
);
