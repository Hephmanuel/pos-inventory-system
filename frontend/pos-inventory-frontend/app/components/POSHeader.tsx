"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import LiveClock from "./LiveClock";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

export default function POSHeader({ isSidebarOpen, onToggle }: HeaderProps) {
  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Company Logo and Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0066FF] rounded-full" />
          <span className="font-bold text-xs text-slate-800 leading-tight">
            POS.INC<br/>
            <span className="text-gray-400 font-normal">Company</span>
          </span>
        </div>

        {/* The Toggle Button */}
        <button 
          onClick={onToggle}
          className="p-1.5 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors ml-2"
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
        
      <div className="flex items-center gap-6">
        <LiveClock />
        {/* <span className="text-[11px] text-gray-500 font-medium">Thurs 12th 10:10:56</span> */}

        <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
          <div className="text-right">
            <p className="font-bold text-slate-800 text-xs leading-none">Mercyofgod Okocha</p>
            <p className="text-[10px] text-gray-400 mt-1 text-right">Cashier</p>
          </div>
          <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden" />
        </div>
      </div>
    </nav>
  );
}