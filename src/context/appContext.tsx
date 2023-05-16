import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback
} from "react";
import { createPortal } from "react-dom";
import { Product } from "../types/product";
import React from "react";
import { Notification as NotificationType } from "../types";
import { Alert } from "@material-tailwind/react";
import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
export interface IAppContext {
  cart: ICartItem[];
  addToCart: (item: ICartItem) => void;
  removeFromCart: (id: number) => void;
  editQuantity: (id: number, number: number) => void;
  clearCart: () => void;
  favorites: IFavorite[];
  addToFavorites: (item: IFavorite) => void;
  removeFromFavorites: (id: number) => void;
  clearFavorites: () => void;
  makeNotification: (props: NotificationType) => void;
  enableWaiting: () => void;
  disableWaiting: () => void;
}

export interface ICartItem {
  product: Product;
  quantity: number;
}

export interface IFavorite {
  product: Product;
}

const AppContext = createContext<IAppContext>({} as IAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  const [cart, setCart] = useState<ICartItem[]>(
    localStorage.getItem("cart")
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        JSON.parse(localStorage.getItem("cart")!)
      : []
  );
  const [favorites, setFavorites] = useState<IFavorite[]>(
    localStorage.getItem("favorites")
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        JSON.parse(localStorage.getItem("favorites")!)
      : []
  );
  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );
  const [waiting, setWaiting] = useState<boolean>(false);
  const makeNotification = useCallback<(arg0: NotificationType) => void>(
    ({ message, type, duration = 4000 }: NotificationType) => {
      setNotification({ message, type, duration });
      setTimeout(() => {
        setNotification(null);
      }, duration);
    },
    [setNotification]
  );
  useEffect(() => {
    function getCartFromLocalStorage(
      callback?: (cart: ICartItem[] | undefined) => void
    ) {
      const cart = localStorage.getItem("cart");
      if (cart) {
        const cartAsJson = JSON.parse(cart) as ICartItem[];
        const productIds = cartAsJson.map((item) => item.product.id);
        const idsString = productIds.join(",");
        if (productIds.length === 0) {
          return;
        }
        axios
          .get("api/product/getInMass", {
            params: {
              ids: idsString
            }
          })
          .then(() => {
            callback && callback(cartAsJson);
          })
          .catch((err) => {
            if (err.response.status === 404) {
              localStorage.removeItem("cart");
              setCart([]);
            }
          });
      }
      const favorites = localStorage.getItem("favorites");
      if (favorites) {
        setFavorites(JSON.parse(favorites));
      }
    }
    getCartFromLocalStorage();
    window.addEventListener("storage", () => getCartFromLocalStorage());

    return () => {
      window.removeEventListener("storage", () => getCartFromLocalStorage());
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (item: ICartItem) => {
    const index = cart.findIndex(
      (cartItem) => cartItem.product.id === item.product.id
    );
    if (index === -1) {
      setCart([...cart, item]);
    } else {
      const newCart = [...cart];
      newCart[index].quantity += item.quantity;
      setCart(newCart);
    }
  };

  const removeFromCart = (id: number) => {
    const newCart = cart.filter((item) => item.product.id !== id);
    setCart(newCart);
  };

  const editQuantity = (id: number, quantity: number) => {
    const index = cart.findIndex((item) => item.product.id === id);
    if (index !== -1) {
      const newCart = [...cart];
      newCart[index].quantity = quantity;
      setCart(newCart);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToFavorites = (item: IFavorite) => {
    const index = favorites.findIndex(
      (favoriteItem) => favoriteItem.product.id === item.product.id
    );
    if (index === -1) {
      setFavorites([...favorites, item]);
    }
  };

  const removeFromFavorites = (id: number) => {
    const newFavorites = favorites.filter((item) => item.product.id !== id);
    setFavorites(newFavorites);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };
  const enableWaiting = useCallback(() => {
    setWaiting(true);
  }, [setWaiting]);

  const disableWaiting = useCallback(() => {
    setWaiting(false);
  }, [setWaiting]);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        editQuantity,
        clearCart,
        favorites,
        addToFavorites,
        removeFromFavorites,
        clearFavorites,
        makeNotification,
        enableWaiting,
        disableWaiting
      }}
    >
      {notification &&
        createPortal(
          <NotificationComponent {...notification} />,
          document.body
        )}
      {waiting &&
        createPortal(
          <Backdrop
            open={waiting}
            style={{
              zIndex: 999
            }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>,
          document.body
        )}
      {children}
    </AppContext.Provider>
  );
};

const NotificationComponent: React.FC<NotificationType> = ({
  message,
  type
}) => {
  return (
    <div className="fixed bottom-10 left-5 z-50">
      <Alert color={notificationColors[type]} style={{ width: "fit-content" }}>
        {message}
      </Alert>
    </div>
  );
};

const notificationColors: {
  [key: string]: "green" | "red" | "blue";
} = {
  success: "green",
  error: "red",
  info: "blue"
};
