import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // This div creates the light gray background seen in your Figma designs
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
      
      {/* This is the white Auth Card container */}
      <div className="bg-white w-full max-w-120 rounded-sm shadow-xl p-10 border border-gray-100">
        
        {/* This is where the specific page content (Login or Signup) will appear */}
        {children}
        
      </div>
    </div>
  );
}