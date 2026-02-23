"use client";
import React from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
// import { Trash2 } from "lucide-react";

const CartItemsDrawer = () => {
  const {
    products,
    cartItems,
    updateCartQuantity,
    getAdjustedPrice,
  } = useAppContext();

  return (
    <div className="space-y-8">
      {Object.keys(cartItems).map((itemKey) => {
        const [productId, size, color] = itemKey.split(":");
        const product = products.find((p) => p._id === productId);
        const qty = cartItems[itemKey];

        if (!product || qty <= 0) return null;

        return (
          <div key={itemKey} className="flex gap-4 border-b pb-6">
            
            {/* Product Image */}
            <Image
              src={product.image[0]}
              alt={product.name}
              width={110}
              height={140}
              className="object-cover"
            />

            {/* Right Content */}
            <div className="flex-1 flex flex-col justify-between">

              {/* Top: Name + Price */}
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-sm">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Rs.{product.offerPrice}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {size}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => updateCartQuantity(itemKey, 0)}
                  className="text-gray-500 hover:text-black"
                >
                  {/* <Trash2 size={18} /> */}
                </button>
              </div>

              {/* Quantity Box */}
              <div className="mt-4">
                <div className="flex items-center justify-between border border-black px-4 py-2 w-[160px]">
                  <button
                    onClick={() =>
                      updateCartQuantity(itemKey, qty - 1)
                    }
                    className="text-lg"
                  >
                    –
                  </button>

                  <span>{qty}</span>

                  <button
                    onClick={() =>
                      updateCartQuantity(itemKey, qty + 1)
                    }
                    className="text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItemsDrawer;
