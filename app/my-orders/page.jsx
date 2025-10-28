'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders.reverse()); // latest first
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
      <div className="space-y-5">
        <h2 className="text-lg font-medium mt-6">My Orders</h2>

        {loading ? (
          <Loading />
        ) : (
          <div className="max-w-5xl border-t border-gray-300 text-sm">
            {orders.length === 0 ? (
              <p className="p-6 text-gray-600">You have no orders yet.</p>
            ) : (
              orders.map((order, idx) => (
                <div
                  key={order._id ?? idx}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
                >
                  {/* Left: Order items */}
                  <div className="flex-1">
                    <p className="font-medium mb-3">Order #{order._id ?? idx}</p>

                    <div className="space-y-3">
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        order.items.map((item, i) => {
                          const product = item.product || {};
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-4 bg-white p-3 rounded"
                            >
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={product.image?.[0] || assets.box_icon}
                                  alt={product.name || "product"}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1">
                                <p className="text-gray-800 font-medium">
                                  {product.name || "Product"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Qty: <span className="font-medium">{item.quantity}</span> •
                                  Size: <span className="font-medium">{item.size || "—"}</span>
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <span
                                    className="w-4 h-4 rounded-full border"
                                    style={{
                                      backgroundColor: item.color || "#fff",
                                      border:
                                        item.color === "#fff" ||
                                        item.color?.toLowerCase() === "white"
                                          ? "1px solid #ccc"
                                          : "none",
                                    }}
                                  ></span>
                                  <span className="text-xs text-gray-500">
                                    {item.color || "—"}
                                  </span>
                                </div>
                                {/* <p className="text-sm text-gray-600 mt-1">
                                  Price: {currency}{item.price}
                                </p> */}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-600">No items in this order.</p>
                      )}
                    </div>
                  </div>

                  {/* Middle: Shipping info */}
                  <div className="min-w-[220px]">
                    <p className="font-medium">{order.address?.fullName || "—"}</p>
                    <p className="text-sm text-gray-600 mt-1">{order.address?.area || "—"}</p>
                    <p className="text-sm text-gray-600">
                      {order.address?.city || "—"}, {order.address?.state || "—"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{order.address?.phoneNumber || "—"}</p>
                  </div>

                  {/* Right: Summary */}
<div className="flex flex-col items-end justify-between">
  <p className="text-sm text-gray-600">
    Shipping Fee: {currency}{order.shippingFee ?? 0}
  </p>

  <p className="text-sm text-gray-600">
    Subtotal: {currency}{(order.amount ?? 0) - (order.shippingFee ?? 0)}
  </p>

  <p className="font-semibold text-lg mt-1">
    Total: {currency}{order.amount ?? 0}
  </p>

  <div className="text-right text-sm mt-2">
    <p>Method: {order.paymentMethod || "—"}</p>
    <p>Date: {order.date ? new Date(order.date).toLocaleDateString() : "—"}</p>
    <p>Payment: {order.paymentStatus || "—"}</p>
    <p>Status: {order.orderStatus || "—"}</p>
  </div>
</div>

                  
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
