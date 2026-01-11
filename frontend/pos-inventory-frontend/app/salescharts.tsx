'use client';

import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { value: 200 },
  { value: 990 },
  { value: 820 },
  { value: 850 },
  { value: 380 },
  { value: 920 },
  { value: 380 },
  { value: 650 },
  { value: 970 },
  { value: 570 },
  { value: 420 },
  { value: 730 },
  { value: 620 },
  { value: 550 },
  { value: 710 },
  { value: 570 },
  { value: 600 },
  { value: 920 },
  { value: 480 },
];

export default function SalesChart() {
  return (
    <div className='h-65'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={data}>
          {/* Gradient */}
          <defs>
            <linearGradient id='blueGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#2563eb' stopOpacity={0.25} />
              <stop offset='100%' stopColor='#2563eb' stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Smooth line + fill */}
          <Area
            type='monotone'
            dataKey='value'
            stroke='#2563eb'
            strokeWidth={3}
            fill='url(#blueGradient)'
            dot={false}
          />

          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
