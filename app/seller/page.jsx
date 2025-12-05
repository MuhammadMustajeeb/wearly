'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const AddProduct = () => {
  const { getToken } = useAppContext();

  const [files, setFiles] = useState([]); // generic product images
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('plain');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  const [availableColors, setAvailableColors] = useState([]); // start empty
  const colorOptions = ['black', 'white', '#bd6a7c', '#59251c', '#a6072e', '#ebd3b2', '#BEBEBE', '#0e43ad', '#c8a2c8', '#36454f', '#800000', '#084C41'];

  // colorFiles: { colorKey: File[] }
  const [colorFiles, setColorFiles] = useState({});

  const toggleColor = (c) => {
    setAvailableColors(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );

    // if unselecting color, optionally remove its files
    setColorFiles(prev => {
      if (prev[c]) {
        const copy = { ...prev };
        delete copy[c];
        return copy;
      }
      return prev;
    });
  };

  const handleGenericFileChange = (index, file) => {
    const updated = [...files];
    updated[index] = file;
    setFiles(updated);
  };

  const handleColorFileAdd = (color, file) => {
    if (!file) return;
    setColorFiles(prev => {
      const arr = prev[color] ? [...prev[color]] : [];
      arr.push(file);
      return { ...prev, [color]: arr };
    });
  };

  const handleColorFileRemove = (color, idx) => {
    setColorFiles(prev => {
      const arr = prev[color] ? [...prev[color]] : [];
      arr.splice(idx, 1);
      if (arr.length === 0) {
        const copy = { ...prev }; delete copy[color]; return copy;
      }
      return { ...prev, [color]: arr };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !offerPrice) {
      return toast.error("Please fill required fields");
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);

    // selected colors
    availableColors.forEach(c => formData.append('colors[]', c));

    // append generic images
    for (let i = 0; i < files.length; i++) {
      if (files[i]) formData.append('images', files[i]);
    }

    // append per-color files as imagesByColor[color]
    Object.entries(colorFiles).forEach(([color, farr]) => {
      (farr || []).forEach((file) => {
        formData.append(`imagesByColor[${color}]`, file);
      });
    });

    try {
      const token = await getToken();
      const { data } = await axios.post('/api/product/add', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message || "Product added");
        // reset
        setFiles([]);
        setName('');
        setDescription('');
        setCategory('plain');
        setPrice('');
        setOfferPrice('');
        setAvailableColors([]);
        setColorFiles({});
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (error) {
      toast.error(error?.message || "Server error");
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-xl">

        {/* Generic Product Images */}
        <div>
          <p className="text-base font-medium">Product Images (generic)</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  type="file"
                  id={`image${index}`}
                  hidden
                  accept="image/*"
                  onChange={(e) => handleGenericFileChange(index, e.target.files?.[0])}
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
          <p className="text-sm text-gray-500 mt-2">These images will be used if no per-color images are provided.</p>
        </div>

        {/* Name, Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} required
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" />
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
              <option value="plain">Plain</option>
              <option value="bold">Bold</option>
              <option value="graphic">Graphic</option>
              <option value="offers">Offer / Combo Pack</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Product Price</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Offer Price</label>
            <input type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} required
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
          </div>
        </div>

        {/* Available Colors */}
        <div className="flex flex-col gap-2 max-w-md">
          <label className="text-base font-medium">Available Colors</label>
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

        {/* Per-color image uploads */}
        {availableColors.length > 0 && (
          <div className="flex flex-col gap-2 max-w-md">
            <label className="text-base font-medium">Upload images per color (optional)</label>
            <p className="text-sm text-gray-500 mb-2">
              Add images specific to a color so product page will show accurate photos for that color.
            </p>

            {availableColors.map((c) => (
              <div key={c} className="border p-3 rounded mb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border" style={{ background: c }} />
                    <div className="text-sm">{c}</div>
                  </div>

                  <label className="text-xs px-3 py-1 bg-gray-100 rounded cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleColorFileAdd(c, e.target.files?.[0])}
                    />
                    Upload image
                  </label>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {(colorFiles[c] || []).map((file, idx) => (
                    <div key={idx} className="relative">
                      <img src={URL.createObjectURL(file)} alt={file.name} className="w-24 h-24 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleColorFileRemove(c, idx)}
                        className="absolute top-0 right-0 bg-white rounded-full p-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">ADD</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
