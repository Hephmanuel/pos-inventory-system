'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SalesOverTimeChart from './salesovertimecharts';
import { baseURL } from '@/app/constant';

type Range = 'today' | '7d' | '30d';

export default function SalesOverTimeCard() {
  const [range, setRange] = useState<Range>('7d');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [percent, setPercent] = useState(0);

  function toMMDDYYYY(d: Date) {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  function getRange() {
    const end = new Date();
    const start = new Date();

    if (range === '7d') start.setDate(end.getDate() - 7);
    if (range === '30d') start.setDate(end.getDate() - 30);

    return {
      start: toMMDDYYYY(start),
      end: toMMDDYYYY(end),
    };
  }

  async function load() {
    setLoading(true);
    const { start, end } = getRange();

    const res = await fetch(
      `${baseURL}/reports/sales-over-time?start_date=${start}&end_date=${end}`
    );

    const json = await res.json();

    const sales = json.data || [];

    setData(sales);

    const sum = sales.reduce((a: number, b: any) => a + b.revenue, 0);
    setTotal(sum);

    // Placeholder until backend sends % change
    setPercent(sales.length ? (Math.random() > 0.5 ? 5.2 : -3.4) : 0);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [range]);

  return (
    <div className='bg-white rounded-xl shadow p-6 space-y-4'>
      <div className='flex justify-between items-start'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800'>
            Sales Over Time
          </h3>
          <p className='text-3xl font-bold mt-1'>₦{total.toLocaleString()}</p>

          <p
            className={`text-sm mt-1 ${
              percent >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {range === 'today'
              ? 'Today'
              : range === '7d'
              ? 'Last 7 Days'
              : 'Last 30 Days'}{' '}
            {percent >= 0 ? '+' : ''}
            {percent}%
          </p>
        </div>

        <div className='flex gap-2 bg-gray-100 p-1 rounded-full'>
          {(['today', '7d', '30d'] as Range[]).map((r) => (
            <motion.button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium relative ${
                range === r ? 'text-white' : 'text-gray-600'
              }`}
            >
              {range === r && (
                <motion.div
                  layoutId='tab'
                  className='absolute inset-0 bg-blue-600 rounded-full'
                />
              )}
              <span className='relative z-10'>
                {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : '30 Days'}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <SalesOverTimeChart data={data} loading={loading} />
    </div>
  );
}
