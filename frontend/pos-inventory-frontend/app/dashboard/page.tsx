import React from 'react';
import { Montserrat } from 'next/font/google';
import SalesChart from '../salescharts';

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
});

export default function Dashboardpage() {
  return (
    <div className='space-y-3 bg-gray-100'>
      {/* Header */}
      <div>
        <h1
          className={`text-4xl text-black font-extrabold mb-4 ${montserrat.className}`}
        >
          Dashboard
        </h1>
        <p className={`text-gray-500 mt-1 ${montserrat.className}`}>
          Detailed reports in sales performance, inventory, and customer
          behaviour
        </p>
      </div>

      {/* The Filter Option */}
      <div>
        <select
          className={`border rounded px-3 py-2 text-lg mt-10 text-black bg-white shadow-md ${montserrat.className}`}
        >
          <option className='text-black text-xl'>Today</option>
          <option className='text-black text-xl'>Last 7 days</option>
          <option className='text-black text-xl'>Last 30 days</option>
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
                <div className='w-12 h-12 bg-gray-300 rounded' />
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
