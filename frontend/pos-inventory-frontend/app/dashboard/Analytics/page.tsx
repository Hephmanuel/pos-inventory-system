'use client';
import React from 'react';
import { Montserrat } from 'next/font/google';
import SalesChart from '../../Cardcomponent/salesovertimecharts';
import { useState, useEffect } from 'react';
import { baseURL } from '../../constant';
import ProductMix from '@/app/Cardcomponent/ProductMix';
import InventoryHealth from '@/app/Cardcomponent/InventoryHealth';
import SalesPerformanceCard from '@/app/Cardcomponent/SalesPeformanceCard';

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
});

export default function AnalyticsPage() {
  const [topProduct, setTopProduct] = useState<any>(null);
  const [loadingCards, setLoadingCards] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className='space-y-3 '>
      {/* Header */}
      <div className='flex justify-between'>
        <div>
          <h1
            className={`text-4xl text-black font-extrabold mb-4 ${montserrat.className}`}
          >
            Reporting & Analytics
          </h1>
          <p className={`text-gray-500 mt-1 ${montserrat.className}`}>
            Detailed reports in sales performance, inventory, and customer
            behaviour
          </p>
        </div>
        <div className='flex items-center gap-3'>
          {/* Print Button */}
          <button className='w-10 h-10 flex items-center justify-center rounded-md border border-black bg-white hover:bg-gray-100 text-black'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-printer-icon lucide-printer'
            >
              <path d='M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' />
              <path d='M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6' />
              <rect x='6' y='14' width='12' height='8' rx='1' />
            </svg>
          </button>

          {/* Export Button */}
          <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-download-icon lucide-download'
            >
              <path d='M12 15V3' />
              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
              <path d='m7 10 5 5 5-5' />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* The Filter Option */}
      <div className='flex items-center gap-4 mt-10'></div>

      {/* STATS */}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-10'>
        {/* CARD 1 — Pie chart */}
        <div className='md:col-span-2  p-6 rounded-lg'>
          <ProductMix />
        </div>

        {/* CARD 2 — ITEMS SOLD */}
        <div className=' p-6 bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 rounded-lg shadow-lg'>
          <InventoryHealth />
        </div>
      </div>
      {/* Bottom section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-14'>
        {/* Sales over time  */}
        <div className='lg:col-span-2 bg-white p-6 shadow-lg rounded-lg'>
          <p
            className={`text-black font-bold text-md  ${montserrat.className}`}
          >
            Sales over time
          </p>
          <h2
            className={`text-3xl text-black font-extrabold mt-2 ${montserrat.className}`}
          >
            $124,530
          </h2>
          <div className={`text-md text-gray-500 mt-1 ${montserrat.className}`}>
            Last 30 Days{' '}
            <span
              className={`text-green-600 font-bold text-md ${montserrat.className}`}
            >
              +5.2%
            </span>
          </div>
          {/* Chart placeholder */}
        </div>
        {/* Top selling product */}
        <div className='p-6 bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 rounded-lg shadow-lg  '>
          <SalesPerformanceCard />
        </div>
      </div>
    </div>
  );
}
