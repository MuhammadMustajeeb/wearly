import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const {
    products,
    currency,
    router,
    getToken,
    user,
    cartItems,
    setCartItems,
    getAdjustedPrice,
  } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");


  // ✅ Compute total amount based on adjusted prices
  const getAdjustedCartAmount = () => {
  let total = 0;

  Object.keys(cartItems).forEach((key) => {
    const [productId, size, color] = key.split(":");
    const qty = cartItems[key];
    const product = products.find((p) => p._id === productId);

    if (!product || qty <= 0) return;

    const price = getAdjustedPrice(product, size, color);
    total += price * qty;
  });

  return total;
};


  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
  try {
    if (!selectedAddress) return toast.error("Please select an address");

    let cartItemsArray = Object.keys(cartItems).map((key) => {
      const [productId, size, color] = key.split(":");
      const qty = cartItems[key];
      const product = products.find((p) => p._id === productId);
      const price = getAdjustedPrice(product, size, color);

      return {
        product: productId,
        quantity: qty,
        size,
        color,
        price, // ✅ include price for each item
      };
    });

    cartItemsArray = cartItemsArray.filter((item) => item.quantity > 0);

    if (cartItemsArray.length === 0) return toast.error("Cart is empty");

    const token = await getToken();

    const { data } = await axios.post(
      "/api/order/create",
      {
        address: selectedAddress._id,
        items: cartItemsArray,
        paymentMethod,
        shippingFee: 100, // ✅ include shipping fee
        amount: getAdjustedCartAmount() + 100, // ✅ include total with shipping
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.success) {
      toast.success(data.message);
      setCartItems({});
      router.push("/order-placed");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  useEffect(() => {
    if (user) fetchUserAddresses();
  }, [user]);

  // ✅ Totals
  const itemCount = Object.values(cartItems).reduce((a, b) => a + b, 0);
  const cartAmount = getAdjustedCartAmount();
  const shippingFee = 100;
  const totalAmount = cartAmount + shippingFee;

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />

      <div className="space-y-6">
        {/* Address Selection */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city},{" "}
                    {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Promo Code */}
        {/* <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-[#d6c4b6] text-white px-9 py-2 hover:bg-[#e2d3c7]">
              Apply
            </button>
          </div>
        </div> */}

        <hr className="border-gray-500/30 my-5" />

        {/* Totals */}
        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {itemCount}</p>
            <p className="text-gray-800">
              {currency}
              {cartAmount}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">
              {currency}
              {shippingFee}
            </p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {totalAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Payment method */}
<hr className="border-gray-500/30 my-5" />

<div>
  <label className="text-base font-medium uppercase text-gray-600 block mb-2">
    Payment Method
  </label>
  <div className="flex flex-col gap-2">
    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="COD"
        checked={paymentMethod === "COD"}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      Cash on Delivery
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="paymentMethod"
        value="BANKTRANSFER" // ✅ uppercase to match backend
        checked={paymentMethod === "BANKTRANSFER"}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      Bank Transfer
    </label>

    {paymentMethod === "BANKTRANSFER" && (
      <div className="mt-3 p-3 border border-gray-300 bg-gray-50 rounded-md text-sm">
        <p className="font-semibold mb-1">Bank Account Details</p>
        <p>Meezan Bank</p>
        <p>Account Title: SOBAN ZAHID MEMON</p>
        <p>Account No: 01040109328838</p>
        <p>IBAN: PK61MEZN0001040109328838</p>
        <p className="text-xs text-gray-600 mt-2">
          After sending payment, please upload your receipt or contact support to verify.
        </p>
      </div>
    )}

    {/* <label className="flex items-center gap-2">
      <input
        type="radio"
        value="JAZZCASH"
        checked={paymentMethod === "JAZZCASH"}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      JazzCash (Coming soon)
    </label> */}
  </div>
</div>


      <button
        onClick={createOrder}
        className="w-full bg-[#d6c4b6] text-white py-3 mt-5 hover:bg-[#e2d3c7]"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
