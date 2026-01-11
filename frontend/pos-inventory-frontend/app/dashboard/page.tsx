'use client';

import React, { useEffect, useState } from 'react';
import { Montserrat } from 'next/font/google';
import { baseURL } from '@/app/constant';
import SalesChart from '../salescharts';

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
});

export default function Dashboardpage() {
  // 📅 default = today
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);

  // 💰 Fetch daily sales summary
  useEffect(() => {
    async function fetchDailySummary() {
      setLoading(true);

      try {
        const res = await fetch(
          `${baseURL}/reports/sales-summary?date=${selectedDate}`
        );

        const data = await res.json();

        console.log('Daily sales summary:', data);

        setDailyRevenue(data.dailyRevenue ?? 0);
        setTotalSales(data.totalSales ?? 0);
      } catch (error) {
        console.error('Failed to fetch daily sales summary', error);
        setDailyRevenue(0);
        setTotalSales(0);
      } finally {
        setLoading(false);
      }
    }

    fetchDailySummary();
  }, [selectedDate]);

  // ₦ formatter (safe)
  const formatNaira = (amount: number) =>
    `₦${amount.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
    })}`;

  return (
    <div className='space-y-8 bg-gray-100 p-6'>
      {/* HEADER */}
      <div>
        <h1 className={`text-4xl font-extrabold ${montserrat.className}`}>
          Dashboard
        </h1>
        <p className={`text-gray-500 mt-1 ${montserrat.className}`}>
          Daily sales performance
        </p>
      </div>

      {/* 📅 CALENDAR */}
      <div>
        <label className='block text-sm text-gray-600 mb-1'>Select date</label>
        <input
          type='date'
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className='border px-4 py-2 rounded bg-white shadow-sm'
        />
      </div>

      {/* 🔝 TOP CARDS */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* TOTAL SALES */}
        <div className='bg-white p-8 rounded-sm shadow-md'>
          <p className={`text-gray-500 text-lg ${montserrat.className}`}>
            Total Sales (That Day)
          </p>
          <div className='text-blue-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='40'
              height='40'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-hand-coins-icon lucide-hand-coins'
            >
              <path d='M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17' />
              <path d='m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9' />
              <path d='m2 16 6 6' />
              <circle cx='16' cy='9' r='2.9' />
              <circle cx='6' cy='5' r='3' />
            </svg>
          </div>
          <h2 className='text-3xl font-bold mt-4 text-black'>
            {loading ? '—' : totalSales}
          </h2>
        </div>

        {/* DAILY REVENUE */}
        <div className='bg-white p-8 rounded-sm shadow-md'>
          <p className={`text-gray500 text-lg ${montserrat.className}`}>
            Daily Revenue
          </p>
          <div className='text-blue-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='size-10'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z'
              />
            </svg>
          </div>

          <h2 className='text-3xl font-bold mt-4 text-black'>
            {loading ? '—' : formatNaira(dailyRevenue)}
          </h2>
        </div>
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
