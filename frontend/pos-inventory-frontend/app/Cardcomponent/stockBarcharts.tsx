'use client';
import { Montserrat } from 'next/font/google';
const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
});

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type StockRow = {
  sku: string;
  stock: number;
};

export default function StockBarChart({ data }: { data: StockRow[] }) {
  return (
    <div>
      <div className='text-blue-500 ml-7'>
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
          className='lucide lucide-package-open-icon lucide-package-open'
        >
          <path d='M12 22v-9' />
          <path d='M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z' />
          <path d='M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13' />
          <path d='M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z' />
        </svg>
      </div>
      <h2
        className={`text-lg text-gray-500 font-semibold mb-4 space-y-3 ${montserrat.className}`}
      >
        Inventory Stock Levels
      </h2>

      <div className={`h-72 text-blue-500 ${montserrat.className}`}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data}>
            <XAxis dataKey='sku' tick={{ fontSize: 12 }} interval={0} />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey='stock'
              fill='#2563eb' // blue-600
              radius={[6, 6, 0, 0]}
              isAnimationActive
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
