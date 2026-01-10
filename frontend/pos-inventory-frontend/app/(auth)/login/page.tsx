"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import AuthInput from "@/app/components/AuthInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is where you'll eventually connect to your backend
    console.log("Logging in with:", { email, password });
  };

  return (
    <>
      {/* Design matches the "Sign In" title and blue color from your Figma */}
      <h1 className="text-[40px] font-bold text-[#0066FF] leading-tight">
        Sign In
      </h1>
      <p className="text-gray-500 mt-2 mb-8">
        Please Enter your details
      </p>

      <form onSubmit={handleLogin} className="space-y-6">
        {/* Reusable Input for Email */}
        <AuthInput 
          label="Email Address" 
          type="email" 
          placeholder="johndoe@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        {/* Reusable Input for Password */}
        <AuthInput 
          label="Password" 
          type="password" 
          placeholder="*********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* The "Continue" button from your Figma design */}
        <button 
          type="submit" 
          className="w-full bg-[#0066FF] text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
        >
          Continue
        </button>
      </form>

      {/* Footer navigation */}
      <p className="text-center mt-8 text-gray-500">
        Don’t Have an Account?{" "}
        <Link href="/signup" className="text-[#0066FF] font-bold hover:underline">
          Signup
        </Link>
      </p>
    </>
  );
}