'use client';

import { useEffect, useState } from 'react';
import { baseURL } from '@/app/constant';
import { motion } from 'framer-motion';

export default function ProductMix() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function toMMDDYYYY(d: Date) {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  useEffect(() => {
    async function load() {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);

      const res = await fetch(
        `${baseURL}/reports/top-selling-products?limit=5&start_date=${toMMDDYYYY(
          start
        )}&end_date=${toMMDDYYYY(end)}`
      );

      const json = await res.json();
      setData(json || []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <p className='text-gray-400'>Loading product mix...</p>;
  }

  const total = data.reduce((a, b) => a + b.revenue, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white p-6 rounded-2xl shadow-md space-y-4'
    >
      <div className='text-blue-500'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='34'
          height='34'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='lucide lucide-shopping-cart-icon lucide-shopping-cart'
        >
          <circle cx='8' cy='21' r='1' />
          <circle cx='19' cy='21' r='1' />
          <path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' />
        </svg>
      </div>
      <h3 className='font-semibold text-gray-800'>Product Mix (Last 7 Days)</h3>

      <div className='space-y-3'>
        {data.map((p, i) => {
          const percent =
            total === 0 ? 0 : ((p.revenue / total) * 100).toFixed(1);
          return (
            <div key={i} className='space-y-1'>
              <div className='flex justify-between text-sm'>
                <span>{p.product_name}</span>
                <span>{percent}%</span>
              </div>

              <div className='w-full bg-gray-200 rounded h-3 overflow-hidden'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.7 }}
                  className='bg-blue-500 h-3 rounded'
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
