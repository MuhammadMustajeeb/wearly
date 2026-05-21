'use client'
import React from 'react'
import { useAppContext } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { assets } from '@/assets/assets'

const SellerPage = () => {
  const { isSeller } = useAppContext()
  const router = useRouter()

  if (!isSeller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You need seller access to view this page.</p>
        </div>
      </div>
    )
  }

  const sellerOptions = [
    {
      title: 'Add Product',
      description: 'Upload new products to your store',
      icon: assets.upload_area,
      href: '/seller/add-product'
    },
    {
      title: 'Product List',
      description: 'View and manage your products',
      icon: assets.box_icon,
      href: '/seller/product-list'
    },
    {
      title: 'Orders',
      description: 'Manage customer orders',
      icon: assets.box_icon,
      href: '/seller/orders'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold tracking-widest uppercase">Seller Portal</h1>
          <p className="text-gray-300 mt-2">Manage your business efficiently</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellerOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => router.push(option.href)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-black transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-black group-hover:scale-110 transition-all duration-300">
                <Image
                  src={option.icon}
                  alt={option.title}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-bold text-black mb-2">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>

              {/* Arrow */}
              <div className="flex justify-end mt-4">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SellerPage
