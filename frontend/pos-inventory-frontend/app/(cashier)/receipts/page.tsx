"use client";

import { useState } from "react";
import SearchBar from "@/app/components/SearchBar";
import ReceiptTable from "@/app/components/ReceiptTable";
import RefundModal from "@/app/components/RefundModal";

export default function ReceiptsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  
  // 🔥 FIX: Add state for the search bar
  const [searchQuery, setSearchQuery] = useState(""); 

  const handleOpenRefund = (id: string) => {
    setSelectedReceipt(id);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/2 p-4">
          {/* 🔥 FIX: Provide the required value and onChange props */}
          <SearchBar 
            placeholder="Search Receipt by number or date..." 
            value={searchQuery}
            onChange={setSearchQuery}
          />
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

      {/* Passing the searchQuery to the table to allow live filtering later */}
      <ReceiptTable onRowClick={handleOpenRefund} />

      <RefundModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        receiptId={selectedReceipt || ""} 
      />
    </div>
  );
}