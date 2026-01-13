'use client';

import { useEffect, useState } from 'react';
import { baseURL } from '@/app/constant';
import { motion } from 'framer-motion';
import { Montserrat } from 'next/font/google';
import { useRouter } from 'next/navigation';

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
});

type Stock = {
  sku_id: string;
  quantity_available: string;
};

const LOW_STOCK_THRESHOLD = 10;

export default function InventoryHealth() {
  const [items, setItems] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, stockRes] = await Promise.all([
          fetch(`${baseURL}/catalog/products`),
          fetch(`${baseURL}/inventory/stock-levels`),
        ]);

        const allProducts = await productsRes.json();
        const stockLevels = await stockRes.json();

        // Only active products
        const active = allProducts.filter((p: any) => p.active === true);

        // Collect SKU IDs that are sellable
        const activeSkuIds = new Set(
          active.flatMap((p: any) => p.skus.map((s: any) => s.id))
        );

        // Only stock belonging to sellable SKUs
        const filteredStock = stockLevels.filter((s: any) =>
          activeSkuIds.has(s.sku_id)
        );

        setItems(filteredStock);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return null;

  const parsed = items.map((i) => ({
    sku: i.sku_id,
    qty: Number(i.quantity_available),
  }));

  let score = 0;

  parsed.forEach((i) => {
    if (i.qty === 0) {
      score += 4; // Out of stock (worst)
    } else if (i.qty <= 10) {
      score += 2; // Low stock
    } else {
      score += 0; // 11+ fully healthy
    }
  });

  const maxScore = parsed.length * 4;

  const percent =
    maxScore === 0 ? 100 : Math.round(100 - (score / maxScore) * 100);

  const critical = parsed.filter((i) => i.qty <= LOW_STOCK_THRESHOLD);

  let color = 'text-blue-500';
  let ring = 'stroke-blue-500';

  if (percent < 50) {
    color = 'text-yellow-400';
    ring = 'stroke-yellow-400';
  }
  if (percent < 35) {
    color = 'text-red-500';
    ring = 'stroke-red-500';
  }

  const dash = `${percent}, 100`;

  return (
    <div className=' text-white bg-white rounded-xl p-6 flex justify-between  items-center'>
      <div className='flex gap-12 items-center'>
        {/* Ring */}
        <div className='relative w-24 h-24'>
          <svg viewBox='0 0 36 36' className='w-full h-full'>
            <path
              d='M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831'
              fill='none'
              stroke='#6b7280'
              strokeWidth='3'
            />

            <motion.path
              d='M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831'
              fill='none'
              strokeWidth='3'
              strokeDasharray={dash}
              className={ring}
              initial={{ strokeDasharray: '0, 100' }}
              animate={{ strokeDasharray: dash }}
              transition={{ duration: 1 }}
            />
          </svg>

          <div className='absolute  inset-0 flex items-center justify-center'>
            <span className={`text-xl font-bold ${color}`}>{percent}%</span>
          </div>
        </div>

        {/* Text */}
        <div>
          <p className='text-xl font-bold text-black'>Inventory Healthy</p>
          <p className={`text-sm text-gray-500 ${montserrat.className}`}>
            {critical.length} items require immediate restock to maintain
            service levels.
          </p>

          <div className='flex items-center gap-2 mt-2'>
            <span className='w-2 h-2 bg-orange-400 rounded-full' />
            <p className='text-sm font-medium text-orange-400'>
              Critical: {critical.length} SKUs
            </p>
          </div>
        </div>
      </div>

      {/* MANAGE */}
      <button
        onClick={() => router.push('/dashboard/Inventory')}
        className='text-white bg-blue-600 rounded-full px-4 py-2 hover:underline text-sm font-medium'
      >
        MANAGE
      </button>
    </div>
  );
}
