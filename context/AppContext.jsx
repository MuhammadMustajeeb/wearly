'use client'

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";    
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Create context
export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();

    // Auth
    const { user } = useUser();
    const { getToken } = useAuth();

    // State
    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [cartItems, setCartItems] = useState({});

    // Fetch products
    const fetchProductData = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) setProducts(data.products);
            else toast.error(data.message);
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Fetch user data
    const fetchUserData = async () => {
        try {
            if (user?.publicMetadata?.role === 'seller') setIsSeller(true);

            const token = await getToken();
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setUserData(data.user);
                setCartItems(data.user.cartItems || {});
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Helper to build composite key: productId:size:color
    const makeItemKey = (productId, size, color) => {
        const safeSize = size ?? 'NOSIZE';
        const safeColor = color ?? 'NOCOLOR';
        return `${productId}:${safeSize}:${safeColor}`;
    };

    // Add to cart
    const addToCart = async (productId, size, color) => {
        if (!productId) return;
        if (!size) { toast.error("Please select a size."); return; }
        if (!color) { toast.error("Please select a color."); return; }

        const key = makeItemKey(productId, size, color);
        const cartData = structuredClone(cartItems);

        cartData[key] = (cartData[key] || 0) + 1;
        setCartItems(cartData);

        if (user) {
            try {
                const token = await getToken();
                await axios.post("/api/cart/update", { cartData }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Item added to cart");
            } catch (err) {
                toast.error(err.message || "Failed to update cart");
            }
        }
    };

    // Update quantity
    const updateCartQuantity = async (itemKey, quantity) => {
        const cartData = structuredClone(cartItems);

        if (quantity === 0) delete cartData[itemKey];
        else cartData[itemKey] = quantity;

        setCartItems(cartData);

        if (user) {
            try {
                const token = await getToken();
                await axios.post("/api/cart/update", { cartData }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Cart updated");
            } catch (err) {
                toast.error(err.message || "Failed to update cart");
            }
        }
    };

    // Get total cart count
    const getCartCount = () => {
        return Object.values(cartItems).reduce((sum, qty) => sum + (qty > 0 ? qty : 0), 0);
    };

    // Get total cart amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemKey in cartItems) {
            const [productId] = itemKey.split(":"); // always first segment
            const qty = cartItems[itemKey];
            const itemInfo = products.find(p => p._id === productId);
            if (itemInfo && qty > 0) totalAmount += itemInfo.offerPrice * qty;
        }
        return Math.floor(totalAmount * 100) / 100;
    };

    const getAdjustedPrice = (product, size) => {
  if (!product) return 0;
  let price = product.offerPrice || 0;

  if (product.category?.toLowerCase() === "graphic") {
    if (size === "L") price = Math.round(price * 1.2105);
    else if (size === "XL") price = Math.round(price * 1.2);
  }

  return price;
};


    // Effects
    useEffect(() => { fetchProductData(); }, []);
    useEffect(() => { if (user) fetchUserData(); }, [user]);

    // Context value
    const value = {
        user, getToken,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount, getAdjustedPrice
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
