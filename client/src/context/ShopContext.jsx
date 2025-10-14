import { createContext, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const countdownInterval = useRef(null);
  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const logoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
    setCountdown(null);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    toast.warning("Session expired. Please log in again.");
    navigate("/login");
  };

  const startLogoutTimer = (jwtToken) => {
    const decoded = decodeToken(jwtToken);
    if (!decoded?.exp) return;
    const timeout = decoded.exp * 1000 - Date.now();
    if (timeout <= 0) {
      logoutUser();
      return;
    }
    if (logoutTimer) clearTimeout(logoutTimer);
    const timer = setTimeout(logoutUser, timeout);
    setLogoutTimer(timer);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    setCountdown(Math.floor(timeout / 1000));
    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchUserCart = async (jwtToken) => {
    if (!jwtToken) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/cart/get`,
        { userId: decodeToken(jwtToken).id },
        { headers: { token: jwtToken } }
      );
      if (res.data.success) setCartItems(res.data.cartData);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      startLogoutTimer(storedToken);
      fetchUserCart(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) startLogoutTimer(token);
  }, [token]);

  const addToCart = async (itemId, size) => {
    if (!size) return;
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(
          `${serverUrl}/api/cart/add`,
          { userId: decodeToken(token).id, itemId, size },
          { headers: { token } }
        );
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
    } else {
      cartData[itemId][size] = quantity;
    }
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(
          `${serverUrl}/api/cart/update`,
          { userId: decodeToken(token).id, itemId, size, quantity },
          { headers: { token } }
        );
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce(
      (total, sizes) => total + Object.values(sizes).reduce((sum, qty) => sum + qty, 0),
      0
    );
  };

  const getCartAmount = () => {
    let total = 0;
    for (const items in cartItems) {
      const product = products.find((p) => p._id === items);
      if (!product) continue;
      for (const size in cartItems[items]) {
        total += product.price * cartItems[items][size];
      }
    }
    return total;
  };

  const getproductsData = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/product/list`);
      if (res.data.success) setProducts(res.data.products);
      else toast.error(res.data.message);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getproductsData();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    serverUrl,
    token,
    setToken,
    countdown,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;