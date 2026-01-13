'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import { baseURL } from '@/app/constant';

type Summary = {
  date: string;
  dailyRevenue: number;
  totalSales: number;
  total_items_sold: number;
  total_transactions: number;
};

export default function SalesPerformanceCard() {
  const [data, setData] = useState<Summary | null>(null);
  const [displayRevenue, setDisplayRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchingRef = useRef(false); // prevent overlapping calls

  function toMMDDYYYY(d: Date) {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  async function load() {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      const today = new Date();
      const date = toMMDDYYYY(today);

      const res = await fetch(`${baseURL}/reports/daily-summary?date=${date}`);
      const json = await res.json();

      setData(json);
    } catch (err) {
      console.error('Failed to load sales summary', err);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }

  // Initial load + auto refresh
  useEffect(() => {
    load();

    const interval = setInterval(load, 30000); // ⏱ every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Smooth counting animation
  useEffect(() => {
    if (!data) return;

    const controls = animate(0, data.dailyRevenue, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate(value) {
        setDisplayRevenue(Math.floor(value));
      },
    });

    return () => controls.stop();
  }, [data]);

  if (loading) {
    return (
      <div className='bg-white rounded-md p-6 shadow animate-pulse h-50' />
    );
  }

  const revenue = data?.dailyRevenue ?? 0;
  const sales = data?.totalSales ?? 0;
  const items = data?.total_items_sold ?? 0;
  const tx = data?.total_transactions ?? 0;

  const dateLabel = new Date(data!.date).toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isZero = revenue === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white rounded-xl shadow-lg p-6 space-y-4 relative overflow-hidden'
    >
      {/* Subtle gradient glow */}
      <div className='absolute inset-0 bg-linear-to-br from-blue-50 via-transparent to-red-50 opacity-40' />

      <div className='relative z-10'>
        <div className='flex justify-between items-start'>
          <div>
            <p className='text-gray-500 text-sm'>Sales Performance</p>
            <p className='text-gray-400 text-xs'>{dateLabel}</p>
          </div>

          <div className='text-blue-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='26'
              height='26'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M3 3v18h18' />
              <path d='M19 9l-5 5-4-4-3 3' />
            </svg>
          </div>
        </div>

        {/* Revenue */}
        <div className='mt-6'>
          <motion.h2
            key={displayRevenue}
            className={`text-4xl font-bold ${
              isZero ? 'text-gray-400' : 'text-blue-600'
            }`}
          >
            ₦{displayRevenue.toLocaleString()}
          </motion.h2>
          <p className='text-sm text-gray-500 mt-1'>Revenue</p>
        </div>

        <div className='border-t border-gray-200 my-4' />

        {/* Stats */}
        <div className='flex justify-between text-sm'>
          <div className='text-center'>
            <p className='font-semibold text-gray-800'>{sales}</p>
            <p className='text-gray-500'>Sales</p>
          </div>

          <div className='text-center'>
            <p className='font-semibold text-gray-800'>{items}</p>
            <p className='text-gray-500'>Items</p>
          </div>

          <div className='text-center'>
            <p className='font-semibold text-gray-800'>{tx}</p>
            <p className='text-gray-500'>Transactions</p>
          </div>
        </div>

        {isZero && (
          <p className='mt-4 text-sm text-red-500'>
            No sales recorded for this day
          </p>
        )}
      </div>
    </motion.div>
  );
}
