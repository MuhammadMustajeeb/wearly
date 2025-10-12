'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const AddProduct = () => {
  const { getToken } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('plain');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  const [availableColors, setAvailableColors] = useState([]); // start empty
  const colorOptions = ['black', 'white', 'navy', 'red', 'green', 'beige', '#d6c4b6'];

  const toggleColor = (c) => {
    setAvailableColors(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);

    // append selected colors only
    availableColors.forEach(c => formData.append('colors[]', c));

    for (let i = 0; i < files.length; i++) {
      if (files[i]) formData.append('images', files[i]);
    }

    try {
      const token = await getToken();
      const { data } = await axios.post('/api/product/add', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message);
        setFiles([]);
        setName('');
        setDescription('');
        setCategory('plain');
        setPrice('');
        setOfferPrice('');
        setAvailableColors([]);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">

        {/* Product Images */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  type="file"
                  id={`image${index}`}
                  hidden
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                />
                <Image
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  className="max-w-24 cursor-pointer"
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Name, Description, Category, Price, OfferPrice */}
        <div className="flex flex-col gap-1 max-w-md">
          <label>Product Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label>Product Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} required
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" />
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
              <option value="plain">Plain</option>
              <option value="bold">Bold</option>
              <option value="graphic">Graphic</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label>Product Price</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label>Offer Price</label>
            <input type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} required
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
          </div>
        </div>

        {/* Available Colors */}
        <div className="flex flex-col gap-2 max-w-md">
          <label>Available Colors</label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {colorOptions.map(c => (
              <button key={c} type="button"
                onClick={() => toggleColor(c)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center ${availableColors.includes(c) ? 'ring-2 ring-offset-1' : ''}`}
                style={{ background: c }}
                title={c} />
            ))}
          </div>
          <p className="text-sm text-gray-500">Select which colors customers can choose.</p>
        </div>

        <button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">ADD</button>
      </form>
    </div>
  );
};

export default AddProduct;
