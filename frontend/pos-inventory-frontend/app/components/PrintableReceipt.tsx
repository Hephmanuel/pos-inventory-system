"use client";

import React from 'react';

interface PrintableReceiptProps {
  items: any[];
  total: number;
}

export default function PrintableReceipt({ items, total }: PrintableReceiptProps) {
  const now = new Date();
  
  // Custom format: Thurs 12th 10:10:56
  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const time = date.toLocaleTimeString('en-GB', { hour12: false });
    return `${dayName} ${dayNumber} ${time}`;
  };

  return (
    <div id='receipt-print' className="hidden print:block p-4 bg-white text-black font-mono text-[10px] w-[80mm] mx-auto">
      <div className="text-center border-b border-dashed pb-2 mb-2">
        <h2 className="text-lg font-bold">SWIFT POS</h2>
        <p>Terminal 01 - Cashier: Mercyofgod</p>
        <p>{formatDate(now)}</p>
      </div>

      <table className="w-full mb-2">
        <thead>
          <tr className="border-b border-dashed">
            <th className="text-left">Item</th>
            <th className="text-center">Qty</th>
            <th className="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="py-1">{item.name}</td>
              <td className="text-center">{item.qty}</td>
              <td className="text-right">{(item.price * item.qty).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed pt-2 flex justify-between font-bold text-sm">
        <span>TOTAL</span>
        <span>NGN {total.toLocaleString()}</span>
      </div>

      <div className="text-center mt-4 border-t border-dashed pt-2">
        <p>Thank you for your patronage!</p>
      </div>
    </div>
  );
}