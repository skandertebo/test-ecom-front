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
export interface IAppContext {
  cart: ICartItem[];
  addToCart: (item: ICartItem) => void;
  removeFromCart: (id: number) => void;
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
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [favorites, setFavorites] = useState<IFavorite[]>([]);
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
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCart(JSON.parse(cart));
    }
    const favorites = localStorage.getItem("favorites");
    if (favorites) {
      setFavorites(JSON.parse(favorites));
    }
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
