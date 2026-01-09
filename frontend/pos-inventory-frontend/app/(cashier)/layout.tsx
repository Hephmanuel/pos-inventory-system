"use client";

import POSSidebar from "../components/POSSidebar";
import POSHeader from "../components/POSHeader";
import React, { useState } from "react";

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  // Single source of truth for the sidebar state
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans m-0 p-0">
      {/* Sidebar now receives the state from layout */}
      <POSSidebar isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">  
        {/* Header receives the state and the toggle function */}
        <POSHeader isSidebarOpen={isSidebarOpen} onToggle={toggleSidebar} />

        <main className="flex-1 overflow-hidden z-0 bg-[#E5E5E5]">
          {children}
        </main>
      </div>
    </div>
  );
}