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
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <h2 className="text-xl font-black text-black uppercase tracking-tight">Shipping Address</h2>

      <form onSubmit={onSubmitHandler} className="space-y-6">

        {/* Country Field */}
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-bold text-black uppercase tracking-wide">
            Country / Region
          </label>
          <input
            id="country"
            type="text"
            placeholder="Country / Region"
            value="Pakistan"
            disabled
            className="w-full px-4 py-3 bg-gray-100 border-b-2 border-gray-300 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-bold text-black uppercase tracking-wide">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={address.fullName.split(' ')[0] || ''}
              onChange={(e) => setAddress(prev => ({
                ...prev,
                fullName: e.target.value + ' ' + (prev.fullName.split(' ')[1] || '')
              }))}
              required
              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-colors duration-300 placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-bold text-black uppercase tracking-wide">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={address.fullName.split(' ')[1] || ''}
              onChange={(e) => setAddress(prev => ({
                ...prev,
                fullName: (prev.fullName.split(' ')[0] || '') + ' ' + e.target.value
              }))}
              required
              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-colors duration-300 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Address Field */}
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-bold text-black uppercase tracking-wide">
            Street Address
          </label>
          <input
            id="address"
            type="text"
            placeholder="Enter your street address"
            value={address.area}
            onChange={(e) => setAddress(prev => ({ ...prev, area: e.target.value }))}
            required
            className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-colors duration-300 placeholder-gray-400"
          />
        </div>

        {/* City and Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-bold text-black uppercase tracking-wide">
              City
            </label>
            <input
              id="city"
              type="text"
              placeholder="Enter your city"
              value={address.city}
              onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
              required
              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-colors duration-300 placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="postalCode" className="text-sm font-bold text-black uppercase tracking-wide">
              Postal Code
            </label>
            <input
              id="postalCode"
              type="text"
              placeholder="Enter postal code"
              value={address.pincode}
              onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value }))}
              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-colors duration-300 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-bold text-black uppercase tracking-wide">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={address.phoneNumber}
            onChange={(e) => setAddress(prev => ({ ...prev, phoneNumber: e.target.value }))}
            required
            className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-colors duration-300 placeholder-gray-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase hover:bg-red-500 transition-all duration-300 transform hover:scale-105"
        >
          Save Address
        </button>
      </form>
    </div>
  );
};

export default CheckoutAddress;
