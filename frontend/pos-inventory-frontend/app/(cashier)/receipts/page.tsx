"use client";

import { useState, useEffect, useMemo } from "react";
import SearchBar from "@/app/components/SearchBar";
import ReceiptTable from "@/app/components/ReceiptTable";
import RefundModal from "@/app/components/RefundModal";
import { getSalesHistory } from "@/app/services/receiptService";

export default function ReceiptsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filterPeriod, setFilterPeriod] = useState("today");
  const [allReceipts, setAllReceipts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getSalesHistory();
      setAllReceipts(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // 2. Combined Search and Period Logic
  const filteredReceipts = useMemo(() => {
    return allReceipts.filter((receipt) => {
      const matchesSearch = (receipt.receipt_no || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Period Filtering
      const receiptDate = new Date(receipt.created_at);
      const now = new Date();
      
      if (filterPeriod === "today") {
        return receiptDate.toDateString() === now.toDateString();
      } else if (filterPeriod === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return receiptDate >= weekAgo;
      } else if (filterPeriod === "month") {
        return receiptDate.getMonth() === now.getMonth() && receiptDate.getFullYear() === now.getFullYear();
      }
      
      return true;
    });
  }, [allReceipts, searchQuery, filterPeriod]);

  const handleOpenRefund = (id: string) => {
    setSelectedReceiptId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/2 p-4">
          <SearchBar 
            placeholder="Search Receipt by number..." 
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <div className="relative">
          <select 
            value={filterPeriod}
            className="appearance-none bg-white px-6 py-3 mr-6 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer shadow-sm"
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <ReceiptTable 
        receipts={filteredReceipts} 
        isLoading={isLoading} 
        onRowClick={handleOpenRefund} 
      />

      <RefundModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        receiptId={selectedReceiptId || ""} 
      />
    </div>
  );
}