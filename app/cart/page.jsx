'use client'
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

// Optional: map color names to hex codes if needed
const colorMap = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  blue: "#0000FF",
  green: "#00FF00",
  // add more mappings as needed
};

const Cart = () => {
  const { products, router, cartItems, updateCartQuantity, getCartCount } = useAppContext();

  return (
    <>
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-[#d6c4b6]">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} Items</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Product Details
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Price
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Quantity
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Subtotal
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(cartItems).map((itemKey) => {
                  // itemKey format: productId:size:color
                  const [productId, size, color] = itemKey.split(":");
                  const product = products.find((p) => p._id === productId);
                  const qty = cartItems[itemKey];

                  if (!product || qty <= 0) return null;

                  // resolve color for swatch
                  const displayColor = color && color !== "NOCOLOR" ? (colorMap[color] || color) : null;

                  return (
                    <tr key={itemKey}>
                      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                            <Image
                              src={product.image[0]}
                              alt={product.name}
                              className="w-16 h-auto object-cover mix-blend-multiply"
                              width={1280}
                              height={720}
                            />
                          </div>
                          <button
                            className="md:hidden text-xs text-[#d6c4b6] mt-1"
                            onClick={() => updateCartQuantity(itemKey, 0)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="text-sm hidden md:block">
                          <p className="text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Size: <span className="font-medium">{size}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                            Color: <span className="font-medium">{color !== "NOCOLOR" ? color : "—"}</span>
                            {displayColor && (
                              <span
                                className="w-5 h-5 rounded-full border"
                                style={{ backgroundColor: displayColor }}
                              />
                            )}
                          </p>
                          <button
                            className="text-xs text-[#d6c4b6] mt-1"
                            onClick={() => updateCartQuantity(itemKey, 0)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>

                      <td className="py-4 md:px-4 px-1 text-gray-600">Rs.{product.offerPrice}</td>

                      <td className="py-4 md:px-4 px-1">
                        <div className="flex items-center md:gap-2 gap-1">
                          <button onClick={() => updateCartQuantity(itemKey, qty - 1)}>
                            <Image src={assets.decrease_arrow} alt="decrease" className="w-4 h-4" />
                          </button>
                          <input
                            onChange={(e) => updateCartQuantity(itemKey, Number(e.target.value))}
                            type="number"
                            value={qty}
                            className="w-8 border text-center appearance-none"
                          />
                          <button onClick={() => updateCartQuantity(itemKey, qty + 1)}>
                            <Image src={assets.increase_arrow} alt="increase" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        Rs.{(product.offerPrice * qty).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => router.push('/all-products')}
            className="group flex items-center mt-6 gap-2 text-[#d6c4b6]"
          >
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>

        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
