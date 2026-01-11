"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../lib/api"; // Your Axios instance

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptId: string; // This is the database UUID
}

export default function RefundModal({ isOpen, onClose, receiptId }: RefundModalProps) {
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch the specific receipt details when the modal opens
  useEffect(() => {
    if (isOpen && receiptId) {
      api.get(`/sales/${receiptId}`).then((res) => setReceiptData(res.data));
    }
  }, [isOpen, receiptId]);

  // 2. The Refund Trigger
  const handleRefund = async () => {
    if (!confirm("Are you sure you want to refund this entire transaction?")) return;
    
    setIsLoading(true);
    try {
      const res = await api.post(`/sales/${receiptId}/refund`);
      alert(res.data.message || "Refund Successful! Inventory Restored.");
      onClose();
      window.location.reload(); // Refresh the table to show updated stock/history
    } catch (err: any) {
      alert(err.response?.data?.message || "Refund failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{receiptData?.receipt_no || "Loading..."}</h2>
              <p className="text-gray-400 text-xs">
                {receiptData ? new Date(receiptData.date).toLocaleString() : ""}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden mb-8 max-h-60 overflow-y-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 uppercase">Product</th>
                  <th className="px-6 py-3 uppercase">Qty</th>
                  <th className="px-6 py-3 uppercase text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {receiptData?.items.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-blue-50/50">
                    <td className="px-6 py-4 font-bold text-slate-800">Item #{idx + 1}</td>
                    <td className="px-6 py-4 text-slate-800">{Number(item.quantity)}</td>
                    <td className="px-6 py-4 text-right font-bold">
                      NGN {Number(item.unit_price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-bold uppercase">Total Amount</p>
              <p className="text-xl font-black text-gray-900">
                NGN {Number(receiptData?.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-8 py-3 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button 
                onClick={handleRefund}
                disabled={isLoading}
                className={`px-8 py-3 ${isLoading ? 'bg-gray-400' : 'bg-[#0066FF]'} text-white rounded-lg font-bold hover:bg-blue-700 transition-colors`}
              >
                {isLoading ? "Processing..." : "Return/Refund"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}