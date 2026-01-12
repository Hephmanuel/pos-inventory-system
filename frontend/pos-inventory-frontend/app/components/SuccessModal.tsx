"use client";

import { CheckCircle2, Printer, X } from "lucide-react";
import PrintableReceipt from "./PrintableReceipt";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  cartItems?: any[];
}

const handlePrint = () => {
    window.print(); 
  };

export default function SuccessModal({ isOpen, onClose, totalAmount, cartItems }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
  <>
    <PrintableReceipt items={cartItems || []} total={totalAmount} />

    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-10 flex flex-col items-center text-center">
          
          {/* Animated Success Icon */}
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Successful</h2>
          <p className="text-gray-500 text-sm mb-8 px-4">
            Transaction completed successfully. The receipt has been generated.
          </p>

          <div className="w-full bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Amount Paid</p>
            <p className="text-3xl font-black text-[#0066FF]">
              NGN {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="flex flex-col w-full gap-3">
            <button className="w-full bg-[#0066FF] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
            onClick={handlePrint}>
              
              <Printer size={20} /> Print Receipt
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Start New Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}