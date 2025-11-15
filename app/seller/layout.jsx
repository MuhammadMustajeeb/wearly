'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import WhatsappButton from '@/components/WhatsappButton'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        {children}
        <WhatsappButton />
      </div>
    </div>
  )
}

export default Layout