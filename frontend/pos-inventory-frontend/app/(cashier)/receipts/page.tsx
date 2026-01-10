"use client";

import { useState } from "react";
import SearchBar from "@/app/components/SearchBar";
import ReceiptTable from "@/app/components/ReceiptTable";
import RefundModal from "@/app/components/RefundModal";
import { ChevronRight } from "lucide-react";

export default function ReceiptsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const handleOpenRefund = (id: string) => {
    setSelectedReceipt(id);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/2 p-4">
          <SearchBar placeholder="Search Receipt by number or date..." />
        </div>
        <div className="relative">
          <select 
            className="appearance-none bg-white px-6 py-3 mr-6 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer shadow-sm"
            onChange={(e) => console.log("Filter by:", e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          
        </div>
      </div>

      {/* When a row is clicked, it triggers the refund flow */}
      <ReceiptTable onRowClick={handleOpenRefund} />

      <RefundModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        receiptId={selectedReceipt || ""} 
      />
    </div>
  );
}