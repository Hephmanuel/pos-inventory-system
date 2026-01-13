"use client";

import React from 'react';

interface ReceiptTableProps {
  receipts: any[];
  isLoading: boolean;
  onRowClick: (receiptId: string) => void;
}

export default function ReceiptTable({ receipts, isLoading, onRowClick }: ReceiptTableProps) {
  if (isLoading) return <div className="p-20 text-center animate-pulse font-bold text-gray-400">Fetching Live Inventory...</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col m-4">
      <div className="overflow-y-auto">
        <table className="w-full text-center border-collapse">
          <thead className="bg-[#F8F9FB] sticky top-0 z-10 border-b border-gray-100">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase tracking-wider w-1/4">Receipt No</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase tracking-wider w-1/4">Date</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase tracking-wider w-1/4">Items</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase tracking-wider w-1/4">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {receipts.map((receipt) => (
              <tr 
                key={receipt.id} 
                onClick={() => onRowClick(receipt.id)} 
                className={`hover:bg-blue-50/50 cursor-pointer transition-colors group ${
                  // 🔒 Dim the row if it is already refunded
                  receipt.status === 'REFUNDED' ? 'opacity-60 bg-gray-50' : ''
                }`}
              >
                <td className="px-8 py-4 text-[11px] text-blue-600 font-bold underline-offset-4 group-hover:underline flex items-center justify-center gap-2">
                  {receipt.receipt_no || "N/A"}
                  
                  {/* 🏷️ The Visual Badge */}
                  {receipt.status === 'REFUNDED' && (
                    <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200 uppercase tracking-wide">
                      Refunded
                    </span>
                  )}
                </td>
                <td className="px-8 py-4 text-[11px] text-gray-500 font-medium">
                  {new Date(receipt.created_at).toLocaleDateString()}
                </td>
                <td className="px-8 py-4 text-[11px] text-gray-500">
                  {receipt.lines?.length || 0} Items
                </td>
                <td className={`px-8 py-4 text-[11px] font-bold ${
                  // 🔒 Strike-through the price for refunded items
                  receipt.status === 'REFUNDED' ? 'line-through text-gray-400' : ''
                }`}>
                  NGN {Number(receipt.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {receipts.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-bold">No receipts match your search.</div>
        )}
      </div>
    </div>
  );
}