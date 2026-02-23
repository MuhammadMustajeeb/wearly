"use client";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const CheckoutAddress = ({ selectedAddress, setSelectedAddress }) => {
  const { getToken } = useAppContext();

  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    pincode: "",
    area: "",
    city: "",
    state: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/user/add-address",
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setSelectedAddress(data.newAddress);
        setAddress({ fullName: "", phoneNumber: "", pincode: "", area: "", city: "", state: "" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
  <h2 className="text-xl font-semibold">Delivery</h2>

  <form onSubmit={onSubmitHandler} className="space-y-4">

    <input
      type="text"
      placeholder="Country / Region"
      value="Pakistan"
      disabled
      className="w-full p-4 border rounded-lg bg-gray-100"
    />

    <div className="flex gap-4">
      <input
        type="text"
        placeholder="First name"
        required
        className="flex-1 p-4 border rounded-lg focus:ring-2 focus:ring-black outline-none"
      />
      <input
        type="text"
        placeholder="Last name"
        required
        className="flex-1 p-4 border rounded-lg focus:ring-2 focus:ring-black outline-none"
      />
    </div>

    <input
      type="text"
      placeholder="Address"
      required
      className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-black outline-none"
    />

    <div className="flex gap-4">
      <input
        type="text"
        placeholder="City"
        required
        className="flex-1 p-4 border rounded-lg focus:ring-2 focus:ring-black outline-none"
      />
      <input
        type="text"
        placeholder="Postal code (optional)"
        className="flex-1 p-4 border rounded-lg focus:ring-2 focus:ring-black outline-none"
      />
    </div>

    <input
      type="text"
      placeholder="Phone"
      required
      className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-black outline-none"
    />

    <button
      type="submit"
      className="w-full py-4 bg-black text-white rounded-lg font-medium hover:opacity-90 transition"
    >
      Save Address
    </button>
  </form>
</div>

  );
};

export default CheckoutAddress;
