"use client";

import React from 'react';

// Mock data representing the Sales History
const mockReceipts = [
  { id: "RCT-290202", date: "12/18/25", items: 4, total: 10000.00, cashier: "Mercyofgod" },
  { id: "RCT-290203", date: "12/18/25", items: 2, total: 2100.00, cashier: "Mercyofgod" },
  { id: "RCT-290204", date: "12/18/25", items: 1, total: 500.00, cashier: "Mercyofgod" },
  { id: "RCT-290205", date: "12/18/25", items: 5, total: 15500.00, cashier: "Mercyofgod" },
];

interface ReceiptTableProps {
  onRowClick: (receiptId: string) => void;
}

export default function ReceiptTable({ onRowClick }: ReceiptTableProps) {
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
            {mockReceipts.map((receipt) => (
              <tr 
                key={receipt.id} 
                onClick={() => onRowClick(receipt.id)} // Triggers the Refund Modal
                className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
              >
                <td className="px-8 py-4 text-[11px] text-blue-600 font-bold underline-offset-4 group-hover:underline">
                  {receipt.id}
                </td>
                <td className="px-8 py-4 text-[11px] text-gray-500 font-medium">{receipt.date}</td>
                <td className="px-8 py-4 text-[11px] text-gray-500">{receipt.items} Items</td>
                <td className="px-8 py-4 text-[11px] font-bold">
                  NGN {receipt.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}