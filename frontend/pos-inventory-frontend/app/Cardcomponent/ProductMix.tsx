'use client';

import { useEffect, useState } from 'react';
import { baseURL } from '@/app/constant';
import { motion } from 'framer-motion';

type ProductMixItem = {
  sku_id: string;
  product_name: string;
  total_quantity_sold: number;
  total_revenue: number;
};

export default function ProductMix() {
  const [data, setData] = useState<ProductMixItem[]>([]);
  const [loading, setLoading] = useState(true);

  function toMMDDYYYY(date: Date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  useEffect(() => {
    async function load() {
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);

        const res = await fetch(
          `${baseURL}/reports/top-selling-products?limit=5&start_date=${toMMDDYYYY(
            start
          )}&end_date=${toMMDDYYYY(end)}`
        );

        if (!res.ok) throw new Error('Failed to fetch product mix');

        const json: ProductMixItem[] = await res.json();
        setData(json);
      } catch (error) {
        console.error('Product mix error:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p className='text-gray-400'>Loading product mix...</p>;
  }

  const totalRevenue = data.reduce(
    (sum, item) => sum + Number(item.total_revenue ?? 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white p-6 rounded-2xl shadow-md space-y-4'
    >
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
        >
          <circle cx='8' cy='21' r='1' />
          <circle cx='19' cy='21' r='1' />
          <path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' />
        </svg>
      </div>

      <h3 className='font-semibold text-gray-800 '>
        Product Mix (Last 7 Days)
      </h3>

      <div className='space-y-3'>
        {data.map((item) => {
          const revenue = Number(item.total_revenue ?? 0);
          const percent =
            totalRevenue > 0
              ? ((revenue / totalRevenue) * 100).toFixed(1)
              : '0.0';

          return (
            <div key={item.sku_id} className='space-y-1'>
              <div className='flex justify-between text-sm'>
                <span>{item.product_name}</span>
                <span>{percent}%</span>
              </div>

              <div className='w-full bg-gray-200 rounded h-3 overflow-hidden'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.7 }}
                  className='bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 h-3 rounded'
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
