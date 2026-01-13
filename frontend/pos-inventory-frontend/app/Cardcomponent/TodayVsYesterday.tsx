'use client';

import { useEffect, useState } from 'react';
import { baseURL } from '@/app/constant';

export default function TodayVsYesterday() {
  const [today, setToday] = useState<any>(null);
  const [yesterday, setYesterday] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Converts JS date to backend format: MM/DD/YYYY
  function toMMDDYYYY(d: Date) {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  useEffect(() => {
    async function load() {
      const now = new Date();
      const y = new Date();
      y.setDate(now.getDate() - 1);

      const todayDate = toMMDDYYYY(now);
      const yesterdayDate = toMMDDYYYY(y);

      const [tRes, yRes] = await Promise.all([
        fetch(`${baseURL}/reports/daily-summary?date=${todayDate}`),
        fetch(`${baseURL}/reports/daily-summary?date=${yesterdayDate}`),
      ]);

      const t = await tRes.json();
      const yData = await yRes.json();

      setToday(t);
      setYesterday(yData);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <p className='text-gray-400'>Loading comparison...</p>;
  }

  const todayValue = today?.dailyRevenue || 0;
  const yesterdayValue = yesterday?.dailyRevenue || 0;

  /**
   * ✅ Correct business change calculation
   *
   * - If yesterday was 0 and today > 0 → +100% (new sales)
   * - If yesterday > 0 → normal percentage formula
   * - If both 0 → 0%
   */
  let change = 0;

  if (yesterdayValue === 0 && todayValue > 0) {
    change = 100; // new sales day
  } else if (yesterdayValue > 0) {
    change = ((todayValue - yesterdayValue) / yesterdayValue) * 100;
  }

  // cap crazy spikes
  if (change > 999) change = 999;

  /**
   * Prevents divide-by-zero when both days are 0
   * This stops NaN% and broken bars
   */
  const max = Math.max(todayValue, yesterdayValue, 1);

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg space-y-4'>
      <h3 className='font-semibold text-gray-800'>Revenue Comparison</h3>

      <div className='space-y-3'>
        {/* Yesterday bar */}
        <div>
          <p className='text-sm text-gray-500'>Yesterday</p>
          <div className='w-full bg-gray-200 rounded h-4'>
            <div
              className='bg-gray-500 h-4 rounded'
              style={{ width: `${(yesterdayValue / max) * 100}%` }}
            />
          </div>
          <p className='text-sm mt-1'>₦{yesterdayValue.toLocaleString()}</p>
        </div>

        {/* Today bar */}
        <div>
          <p className='text-sm text-gray-500'>Today</p>
          <div className='w-full bg-gray-200 rounded h-4'>
            <div
              className='bg-blue-600 h-4 rounded'
              style={{ width: `${(todayValue / max) * 100}%` }}
            />
          </div>
          <p className='text-sm mt-1'>₦{todayValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Percentage change */}
      <p
        className={`text-sm font-medium ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}% growth vs
        yesterday
      </p>
    </div>
  );
}
