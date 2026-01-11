import React from 'react';
import { Montserrat } from 'next/font/google';
import SalesChart from '../../salescharts';

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
});

export default function AnalyticsPage() {
  return (
    <div className='space-y-3 bg-gray-100'>
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
      <div>
        <select
          className={`border rounded px-3 py-2 text-lg mt-10 text-black bg-white shadow-md ${montserrat.className}`}
        >
          <option className='text-black text-xl'>Date: Today</option>
          <option className='text-black text-xl'>Date: Last 7 days</option>
          <option className='text-black text-xl'>Date: Last 30 days</option>
        </select>
      </div>

      {/* STATS */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-20 mt-10'>
        {[
          { change: '+5.2%', positive: true },
          { change: '+5.2%', positive: true },
          { change: '-5.2%', positive: false },
          { change: '+5.2%', positive: true },
        ].map((item, i) => (
          <div key={i} className='bg-white p-8 rounded-sm shadow-md'>
            <p className={`text-gray-500 text-lg ${montserrat.className}`}>
              Total revenue
            </p>
            <h2 className={`text-2xl text-black font-bold mt-5 `}>
              $124,530.90
            </h2>
            <p
              className={`mt-4 text-md font-bold ${
                item.positive ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {item.change}
            </p>
          </div>
        ))}
      </div>
      {/* Bottom section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-14'>
        {/* Sales over time  */}
        <div className='lg:col-span-2 bg-white p-6 rounded-md'>
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
          <p className={`text-md text-gray-500 mt-1 ${montserrat.className}`}>
            Last 30 Days{' '}
            <span
              className={`text-green-600 font-bold text-md ${montserrat.className}`}
            >
              +5.2%
            </span>
            <SalesChart />
          </p>
          {/* Chart placeholder */}
        </div>
        {/* Top selling product */}
        <div className='bg-white p-6 rounded-md'>
          <h3
            className={`text-lg font-semibold mb-4 text-black ${montserrat.className}`}
          >
            Top selling Products
          </h3>

          <div className='space-y-4'>
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-gray-300 rounded'></div>
                <div className='flex-1'>
                  <p
                    className={`text-sm font-medium text-black ${montserrat.className}`}
                  >
                    Top selling Products
                  </p>
                  <p
                    className={`text-xs text-gray-500 mt-2 ${montserrat.className}`}
                  >
                    Top selling Products
                  </p>
                </div>
                <p className='font-semibold text-2xl text-black'>$40.90</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
