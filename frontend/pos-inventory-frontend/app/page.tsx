
import Link from "next/link";
import { Store, ArrowRight } from "lucide-react"; // Using Lucide for a professional look

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
      {/* Logo / Brand Section */}
      <div className="mb-12 text-center">
        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <Store className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Swift<span className="text-[#0066FF]">POS</span>
        </h1>
        <p className="text-gray-500 mt-2">Manage your sales and inventory seamlessly.</p>
      </div>

      {/* Action Card */}
      <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Get Started</h2>
        
        <div className="space-y-4">
          {/* Log In Button */}
          <Link 
            href="/login" 
            className="group flex items-center justify-between w-full bg-[#0066FF] text-white p-5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
          >
            Sign In to Terminal
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>

          {/* Sign Up Button */}
          <Link 
            href="/signup" 
            className="flex items-center justify-center w-full bg-white text-gray-700 border-2 border-gray-100 p-5 rounded-2xl font-bold hover:border-blue-200 hover:text-blue-600 transition-all"
          >
            Create New Account
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <p className="mt-12 text-sm text-gray-400">
        © 2026 SwiftPOS Systems. All rights reserved.
      </p>
    </div>
  );
}
        
import Image from 'next/image';
import React from 'react';
import { redirect } from 'next/navigation';
export default function Home() {
  return redirect('/dashboard');
}
