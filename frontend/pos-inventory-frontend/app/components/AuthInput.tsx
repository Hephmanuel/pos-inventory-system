"use client";

import React from 'react';

interface AuthInputProps {
  label: string;
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AuthInput({ label, type, placeholder, value, onChange }: AuthInputProps) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      {/* Label styled with the Figma font-weight */}
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      
      {/* Input styled with the specific border and radius from your image */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="max-w-100 max-h-12.5 p-2.25 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900"
      />
    </div>
  );
}