'use client';

type SalesPoint = {
  date: string;
  revenue: number;
};

export default function SalesOverTimeChart({
  data,
  loading,
}: {
  data: SalesPoint[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className='h-64 flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (!data.length) {
    return (
      <p className='text-gray-400 text-center mt-12'>
        No sales data for selected period
      </p>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  const points = data
    .map((d, i) => {
      const x = data.length === 1 ? 50 : (i / (data.length - 1)) * 100;
      const y = 40 - (d.revenue / maxRevenue) * 35;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox='0 0 100 40' className='w-full h-64'>
      <polyline
        fill='none'
        stroke='#2563eb'
        strokeWidth='2.5'
        points={points}
      />
    </svg>
  );
}
