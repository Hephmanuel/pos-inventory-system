"use client";

import { X } from "lucide-react";

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptId: string;
}

export default function RefundModal({ isOpen, onClose, receiptId }: RefundModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{receiptId}</h2>
              <p className="text-gray-400 text-xs">12/18/25</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Item List matching your Figma image */}
          <div className="border border-gray-100 rounded-xl overflow-hidden mb-8">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 uppercase">SKU</th>
                  <th className="px-6 py-3 uppercase">Product</th>
                  <th className="px-6 py-3 uppercase">Category</th>
                  <th className="px-6 py-3 uppercase text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3].map((item) => (
                  <tr key={item} className="hover:bg-blue-50/50 cursor-pointer">
                    <td className="px-6 py-4">CRU-189</td>
                    <td className="px-6 py-4 font-bold text-slate-800">Indomie</td>
                    <td className="px-6 py-4 text-slate-800">Food</td>
                    <td className="px-6 py-4 text-right font-bold">NGN 700.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Logic */}
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-bold uppercase">Total Selected</p>
              <p className="text-xl font-black text-gray-900">NGN 2100.00</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-8 py-3 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-8 py-3 bg-[#0066FF] text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Return/Refund
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}