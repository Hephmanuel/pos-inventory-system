'use client';
import React from 'react';
import { Montserrat } from 'next/font/google';
import SalesChart from '../../Cardcomponent/salesovertimecharts';
import { useState, useEffect } from 'react';
import { baseURL } from '../../constant';
import ProductMix from '@/app/Cardcomponent/ProductMix';
import { motion, AnimatePresence } from 'framer-motion';
import InventoryHealth from '@/app/Cardcomponent/InventoryHealth';
import SalesPerformanceCard from '@/app/Cardcomponent/SalesPeformanceCard';
import ReceiptTable from '@/app/components/ReceiptTable';
import { getSalesHistory } from '@/app/services/receiptService';
import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Print from '@/app/Cardcomponent/Print';

import '../../globals.css';

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
});

export default function AnalyticsPage() {
  const [topProduct, setTopProduct] = useState<any>(null);
  const [loadingCards, setLoadingCards] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receipts, setReceipts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const analyticsRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const goNext = () => goToPage(currentPage + 1);
  const goPrev = () => goToPage(currentPage - 1);

  const handleRowClick = (receiptId: string) => {
    console.log('Clicked receipt:', receiptId);
  };

  useEffect(() => {
    async function loadReceipts() {
      try {
        setIsLoading(true);
        const data = await getSalesHistory(); // ✅ SAME AS CASHIER
        setReceipts(data);
      } catch (err) {
        console.error('Failed to fetch receipts', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadReceipts();
  }, []);
  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(receipts.length / ITEMS_PER_PAGE);

  const paginatedReceipts = receipts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handlePrint = () => {
    // 1. Apply the class to hide the dashboard
    document.body.classList.add('print-analytics');

    // 2. Give the browser a moment to recalculate the layout (removes blank pages)
    setTimeout(() => {
      window.print();
      // 3. Cleanup after printing
      document.body.classList.remove('print-analytics');
    }, 250); // Increased slightly for stability
  };

  const receiptsToRender = isExporting
    ? receipts // ✅ FULL receipts for PDF
    : paginatedReceipts; // ✅ normal UI
  return (
    <div ref={analyticsRef} className='  space-y-3  '>
      <div>
        {/* Header */}
        <div className='flex justify-between'>
          <div className=''>
            <h1
              className={`text-4xl text-black font-extrabold mb-4 ${montserrat.className}`}
            >
              Reporting & Analytics
            </h1>
            <p className={`text-gray-500 mt-1 ${montserrat.className}`}>
              Detailed reports in sales performance, inventory, and customer
              behaviour
            </p>
          </div>
          <div className='flex items-center gap-3'>
            {/* Print Button */}
            <button
              onClick={handlePrint}
              className='w-10 h-10 flex items-center justify-center rounded-md border border-black bg-white hover:bg-gray-100 text-black'
            >
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
                className='lucide lucide-printer-icon lucide-printer'
              >
                <path d='M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' />
                <path d='M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6' />
                <rect x='6' y='14' width='12' height='8' rx='1' />
              </svg>
            </button>
          </div>
        </div>

        {/* The Filter Option */}
        <div className='flex items-center gap-4 mt-10'></div>

        {/* STATS */}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-10'>
          {/* CARD 1 — Pie chart */}
          <div className='md:col-span-2  p-6 rounded-lg'>
            <ProductMix />
          </div>

          {/* CARD 2 — ITEMS SOLD */}
          <div className=' p-6 bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 rounded-lg shadow-lg'>
            <InventoryHealth />
          </div>
        </div>
        <div className='p-6 bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 rounded-lg shadow-lg mt-10 print-break '>
          <SalesPerformanceCard />
        </div>
        {/* Bottom section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-14'>
          {/* Sales over time  */}
          <div className='lg:col-span-2 p-6 shadow-lg bg-white rounded-lg flex flex-col items-center'>
            <div className='text-2xl text-black font-bold'>Reciept Table</div>
            <div className='text-blue-500 mt-3'>
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
                className='lucide lucide-receipt-text-icon lucide-receipt-text'
              >
                <path d='M13 16H8' />
                <path d='M14 8H8' />
                <path d='M16 12H8' />
                <path d='M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z' />
              </svg>
            </div>
            {/* Animated table container */}
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className='w-full max-w-5xl '
            >
              <ReceiptTable
                receipts={receiptsToRender}
                isLoading={isLoading}
                onRowClick={handleRowClick}
              />
            </motion.div>

            {/* Pagination */}
            {/* Pagination (HIDE DURING EXPORT) */}
            {!isExporting && !isLoading && totalPages > 1 && (
              <div className='flex items-center gap-2 mt-6 text-sm border-black text-black'>
                {/* Previous */}
                <button
                  onClick={goPrev}
                  disabled={currentPage === 1}
                  className='px-3 py-1 rounded-md border border-black text-blue-500 disabled:opacity-40'
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].slice(0, 7).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 rounded-full font-semibold transition
            ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border text-gray-600 hover:bg-gray-100'
            }
          `}
                    >
                      {page}
                    </button>
                  );
                })}

                {totalPages > 7 && <span className='px-2'>…</span>}

                {/* Next */}
                <button
                  onClick={goNext}
                  disabled={currentPage === totalPages}
                  className='px-3 py-1 rounded-md border border-black text-black disabled:opacity-40'
                >
                  Next
                </button>

                {/* Result Count */}
                <span className='ml-6 text-gray-500'>
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, receipts.length)} of{' '}
                  {receipts.length} results
                </span>
              </div>
            )}
          </div>
          {/* Top selling product */}
        </div>
      </div>
      {/* PRINT STORE (HIDDEN ON SCREEN) */}
      <div id='print-store'>
        <h2>SWIFT POS</h2>
        <p>Analytics Report</p>
        <p>Generated: {new Date().toLocaleString()}</p>

        <hr />

        <h3>Sales Performance</h3>
        <p>
          Total Revenue: NGN{' '}
          {receipts
            .reduce((s, r) => s + Number(r.total_amount || 0), 0)
            .toLocaleString()}
        </p>
        <p>
          Total Items Sold:{' '}
          {receipts.reduce((s, r) => s + (r.lines?.length || 0), 0)}
        </p>
        <p>Total Transactions: {receipts.length}</p>

        <hr />

        <h3>Receipts</h3>

        <table>
          <thead>
            <tr>
              <th>Receipt No</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {receipts.map((r, i) => (
              <tr key={i}>
                <td>{r.receipt_no || 'N/A'}</td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
                <td>{r.lines?.length || 0}</td>
                <td>NGN {Number(r.total_amount).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ marginTop: 40 }}>Thank you for using SWIFT POS</p>
      </div>
    </div>
  );
}
