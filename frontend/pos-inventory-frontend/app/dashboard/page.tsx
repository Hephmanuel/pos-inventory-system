'use client';

import React, { useEffect, useState } from 'react';
import { Montserrat } from 'next/font/google';
import { baseURL } from '@/app/constant';
import SalesOverTimeChart from '../Cardcomponent/salesovertimecharts';
import StockBarChart from '../Cardcomponent/stockBarcharts';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import SalesOverTimeCard from '../Cardcomponent/salesovertimecard';
import TodayVsYesterday from '../Cardcomponent/TodayVsYesterday';
const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
});

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

export default function Dashboardpage() {
  // 📅 default = today
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true); //Product Count
  // The chart data state

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);

  const [loadingSaleChart, setLoadingSalesChart] = useState(true); //Product Insights

  // Fetch stock data for the bar chart
  // refs (optional but recommended)
  const chartFetchingRef = useRef(false);
  const productFetchingRef = useRef(false);

  async function fetchTotalProducts() {
    if (productFetchingRef.current) return;
    productFetchingRef.current = true;

    try {
      const res = await fetch(`${baseURL}/catalog/products`);
      if (!res.ok) throw new Error('Failed to fetch products');

      const all = await res.json();

      // Only count active products
      const active = all.filter((p: any) => p.active === true);

      setTotalProducts(active.length);
    } catch (err) {
      console.error(err);
    } finally {
      productFetchingRef.current = false;
      setLoadingProducts(false);
    }
  }

  // 🔁 shared refresher
  async function refreshDashboard() {
    await Promise.all([fetchTotalProducts()]);
  }
  useEffect(() => {
    // initial load
    refreshDashboard();

    // ⏱ auto refresh every 30s
    const interval = setInterval(refreshDashboard, 30000);

    return () => clearInterval(interval);
  }, []);
  // 💰 Fetch daily sales summary
  async function fetchDailySummary() {
    setLoading(true);

    try {
      const res = await fetch(`${baseURL}/reports/sales-summary`);

      if (!res.ok) {
        throw new Error('Failed to fetch sales summary');
      }

      const data = await res.json();

      console.log('Backend response:', data);

      // ✅ ONLY fields that exist in Postman
      setDailyRevenue(data.dailyRevenue ?? 0);
    } catch (error) {
      console.error(error);
      setDailyRevenue(0);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchDailySummary();
  }, []);

  // ₦ formatter (safe)
  const formatNaira = (amount: number) =>
    `₦${amount.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
    })}`;

  //Product Insights
  const REFRESH_INTERVAL = 30_000;
  // 🔹 Flatten SKU prices for insights
  const skuPrices =
    products?.flatMap((product: any) =>
      product.skus.map((sku: any) => ({
        productName: product.name,
        skuCode: sku.sku_code,
        price: Number(sku.base_price),
      }))
    ) ?? [];

  const sortedByPrice = [...skuPrices].sort((a, b) => b.price - a.price);
  const highestProduct = sortedByPrice[0];
  const lowestProduct = sortedByPrice[sortedByPrice.length - 1];

  const averagePrice =
    skuPrices.reduce((sum, item) => sum + item.price, 0) / skuPrices.length;

  async function fetchProductInsights() {
    try {
      setLoadingInsights(true);

      const res = await fetch(`${baseURL}/catalog/products`);
      if (!res.ok) throw new Error('Failed to fetch products');

      const all = await res.json();

      // Only include products that are actually sellable
      const active = all.filter((p: any) => p.active === true);

      setProducts(active);
    } catch (err) {
      console.error('Failed to fetch product insights', err);
    } finally {
      setLoadingInsights(false);
    }
  }

  useEffect(() => {
    fetchProductInsights();
    const interval = setInterval(fetchProductInsights, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='space-y-8 bg-gray-100 p-6'>
      {/* HEADER */}
      <div>
        <h1 className={`text-4xl font-extrabold ${montserrat.className}`}>
          Dashboard
        </h1>
        <p className={`text-gray-500 mt-1 ${montserrat.className}`}>
          Detailed reports in sales performance, inventory levels, and customer
          behaviour
        </p>
      </div>

      {/* 🔝 TOP CARDS */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* TOTAL SALES */}
        <div className='bg-white p-8 rounded-lg shadow-md space-y-3'>
          <p className={`text-gray-500 text-lg ${montserrat.className}`}>
            Total Products
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
            {loadingProducts ? '—' : totalProducts}
          </h2>
        </div>

        {/* DAILY REVENUE */}
        <div className='bg-white p-8 rounded-lg shadow-lg space-y-3'>
          <p className={`text-gray-500 text-lg ${montserrat.className}`}>
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
        <div className='lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-6'>
          <div>
            {/* Other dashboard cards */}

            <div className='space-y-4 '>
              {/* Calendar */}
              <TodayVsYesterday />

              {/* Chart */}
            </div>
          </div>
        </div>
        {/* Product Insights*/}
        <div className='bg-white p-6 rounded-lg shadow-lg animate-fadeIn'>
          <h3
            className={`text-lg font-semibold mb-4 text-gray-500 ${montserrat.className}`}
          >
            Product Price Insights
          </h3>

          {loadingInsights ? (
            <ProductInsightsSkeleton />
          ) : skuPrices.length === 0 ? (
            <p className='text-gray-400 text-sm text-center'>
              No product data available
            </p>
          ) : (
            <div className='space-y-8'>
              {/* Highest */}
              <div className='flex items-center gap-10'>
                <div className='text-blue-500 rounded flex items-center justify-center'>
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
                    className='lucide lucide-chevrons-up-icon lucide-chevrons-up'
                  >
                    <path d='m17 11-5-5-5 5' />
                    <path d='m17 18-5-5-5 5' />
                  </svg>
                </div>
                <div className='flex-1'>
                  <p className='text-md font-medium text-black'>
                    Highest Product
                  </p>
                  <p
                    className={`text-xs text-gray-500 mt-1 ${montserrat.className}`}
                  >
                    SKU: {highestProduct?.skuCode}
                  </p>
                </div>
                <p className='font-semibold text-xl text-black'>
                  ₦{highestProduct?.price.toLocaleString()}
                </p>
              </div>

              {/* Lowest */}
              <div className='flex items-center gap-10'>
                <div className=' rounded text-red-500 flex items-center justify-center'>
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
                    className='lucide lucide-chevrons-down-icon lucide-chevrons-down'
                  >
                    <path d='m7 6 5 5 5-5' />
                    <path d='m7 13 5 5 5-5' />
                  </svg>
                </div>
                <div className='flex-1'>
                  <p className='text-md font-medium text-black'>
                    Lowest Product
                  </p>
                  <p
                    className={`text-xs text-gray-500 mt-1 ${montserrat.className}`}
                  >
                    SKU: {lowestProduct?.skuCode}
                  </p>
                </div>
                <p className='font-semibold text-xl text-black'>
                  ₦{lowestProduct?.price.toLocaleString()}
                </p>
              </div>

              {/* Average */}
              <div className='flex items-center gap-10'>
                <div className='text-blue-500 rounded flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-chart-column-big-icon lucide-chart-column-big'
                  >
                    <path d='M3 3v16a2 2 0 0 0 2 2h16' />
                    <rect x='15' y='5' width='4' height='12' rx='1' />
                    <rect x='7' y='8' width='4' height='9' rx='1' />
                  </svg>
                </div>
                <div className='flex-1'>
                  <p className='text-md font-medium text-black'>
                    Average Price
                  </p>
                  <p className='text-md text-gray-500 mt-1'>
                    Across all products
                  </p>
                </div>
                <p className='font-semibold text-xl text-black'>
                  ₦
                  {averagePrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

//Skeleton
function ProductInsightsSkeleton() {
  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <div className='flex justify-center mb-4'>
        <div className='w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin' />
      </div>

      <div className='space-y-4'>
        {[1, 2].map((i) => (
          <div key={i} className='flex items-center gap-4 animate-pulse'>
            <div className='w-12 h-12 bg-gray-200 rounded' />
            <div className='flex-1 space-y-2'>
              <div className='h-3 bg-gray-200 rounded w-1/3' />
              <div className='h-2 bg-gray-200 rounded w-1/2' />
            </div>
            <div className='h-4 w-12 bg-gray-200 rounded' />
          </div>
        ))}
      </div>
    </div>
  );
}
