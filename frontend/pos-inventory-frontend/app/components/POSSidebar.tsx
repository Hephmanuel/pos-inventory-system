"use client";

import Link from "next/link";
import { Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isSidebarOpen: boolean;
}


export default function POSSidebar({ isSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside 
      className={`${
        isSidebarOpen ? "w-52" : "w-0"
      } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col justify-between overflow-hidden relative py-6`}
    >
      <div className="w-52"> {/* Fixed width container inside keeps content steady */}
        <nav className="space-y-1 pt-20">
          <Link href="/pos" 
          className={`flex items-center gap-3 px-6 py-3 text-sm whitespace-nowrap transition-all ${pathname === "/pos" ? "bg-[#0066FF] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
            POS
          </Link>
          <Link href="/receipts" 
          className={`flex items-center gap-3 px-6 py-3 text-sm whitespace-nowrap transition-all ${pathname === "/receipts" ? "bg-[#0066FF] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
            Receipts
          </Link>
        </nav>
      </div>

      <div className="w-52 px-6 space-y-4 whitespace-nowrap">
        <button className="flex items-center gap-3 text-red-500 text-sm font-bold hover:text-red-600">
          <Link href="/" className="flex gap-2"><LogOut size={18}/> Log out</Link>
        </button>
      </div>
    </aside>
  );
}