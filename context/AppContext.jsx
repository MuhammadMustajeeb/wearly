'use client'
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";    
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    //auth
    const { user } = useUser();
    // connect API from api/user/data/route.js
    const { getToken } = useAuth();

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})

    const fetchProductData = async () => {
        try {
            // call API
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = 
    async () => {
        // seller access to dashboard
        try {
            if (user.publicMetadata.role == 'seller') {
            setIsSeller(true)
        }

        // call api for fetching user data
        const token = await getToken()

        const { data } = await axios.get('/api/user/data', {
            headers: {
                Authorization: `Bearer ${token}`}
        })

        if (data.success) {
            setUserData(data.user)
            setCartItems(data.user.cartItems)
        } else {
            toast.error(data.message)
        }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // AppContext.js — inside your provider

// helper to build key
const makeItemKey = (productId, size) => `${productId}:${size || 'NOSIZE'}`;

// addToCart now accepts (productId, size)
const addToCart = async (productId, size = null) => {
  // sanity
  if (!productId) return;
  if (!size) {
    toast.error("Please select a size.");
    return;
  }

  let cartData = structuredClone(cartItems);

  const key = makeItemKey(productId, size);

  if (cartData[key]) {
    cartData[key] += 1;
  } else {
    cartData[key] = 1;
  }

  setCartItems(cartData);

  // persist to DB if logged in
  if (user) {
    try {
      const token = await getToken();
      await axios.post("/api/cart/update", { cartData }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Item added to cart");
    } catch (error) {
      toast.error(error.message || "Failed to update cart");
    }
  }
};

// updateCartQuantity(itemKey, quantity) // itemKey = productId:size
const updateCartQuantity = async (itemKey, quantity) => {
  let cartData = structuredClone(cartItems);
  if (quantity === 0) {
    delete cartData[itemKey];
  } else {
    cartData[itemKey] = quantity;
  }
  setCartItems(cartData);

  if (user) {
    try {
      const token = await getToken();
      await axios.post("/api/cart/update", { cartData }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Cart updated");
    } catch (error) {
      toast.error(error.message || "Failed to update cart");
    }
  }
};

// getCartCount: sum quantities across item keys
const getCartCount = () => {
  let totalCount = 0;
  for (const itemKey in cartItems) {
    const qty = cartItems[itemKey];
    if (qty > 0) totalCount += qty;
  }
  return totalCount;
};

// getCartAmount: need to resolve productId from key and sum
const getCartAmount = () => {
  let totalAmount = 0;
  for (const itemKey in cartItems) {
    const [productId] = itemKey.split(":");
    const qty = cartItems[itemKey];
    const itemInfo = products.find((product) => product._id === productId);
    if (itemInfo && qty > 0) {
      totalAmount += itemInfo.offerPrice * qty;
    }
  }
  return Math.floor(totalAmount * 100) / 100;
};


    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
        }
    }, [user])

    const value = {
        user, getToken,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}