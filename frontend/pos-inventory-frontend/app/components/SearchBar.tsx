"use client";

import { Search } from "lucide-react";

// 1. Define the props so the parent can control the input
interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full mb-4">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value} // Controlled component
        onChange={(e) => onChange(e.target.value)} // Send text back to POS Page
        className="block w-full pl-11 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        placeholder={placeholder || "Search Product by name or Scan Barcode"}
      />
    </div>
  );
}