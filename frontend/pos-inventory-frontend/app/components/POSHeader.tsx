"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LiveClock from "./LiveClock";

// 1. Define the missing interface
interface HeaderProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

export default function POSHeader({ isSidebarOpen, onToggle }: HeaderProps) {
  // 2. Initialize with a loading state
  const [user, setUser] = useState({ full_name: "Loading...", role: "" });

  useEffect(() => {
    // 3. Retrieve the user details we saved in localStorage during login
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser({
        full_name: parsedUser.full_name,
        role: parsedUser.role
      });
    }
  }, []);

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

        {/* The Toggle Button uses the props defined in our interface */}
        <button 
          onClick={onToggle}
          className="p-1.5 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors ml-2"
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
        
      <div className="flex items-center gap-6">
        <LiveClock />

        <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
          <div className="text-right">
            {/* 4. Display the actual logged-in user name and role */}
            <p className="font-bold text-slate-800 text-xs leading-none">
            {user.full_name}
          </p>
          <p className="text-[10px] text-gray-400 mt-1 text-right capitalize">
            {user.role}</p>
          </div>
          <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden" />
        </div>
      </div>
    </nav>
  );
}