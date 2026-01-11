"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthInput from "@/app/components/AuthInput";
import { ArrowLeft } from 'lucide-react';
// Importing the specific logic we built in the previous step
import { loginUser } from '@/app/services/authService'; 

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // This will be sent as 'pin_code'
  const [isLoading, setIsLoading] = useState(false); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // ADD THESE LOGS FOR PROOF
     console.log("Button Clicked!"); 
     console.log("Email captured:", email);
     console.log("Password captured:", password);
    
    try {
      // 1. Trigger the logic tier
      const data = await loginUser(email, password);

      localStorage.setItem("user", JSON.stringify(data.user));
      
      // 2. Extract the role from the successful response
      const userRole = data.user.role; 

      // 3. Role-based redirection logic using a Switch statement
      switch (userRole) {
        case 'manager':
          alert(`Login Successful. Welcome, ${data.user.full_name}`);
          router.push("/dashboard"); 
          break;
        case 'cashier':
          alert(`Terminal Active. Welcome, ${data.user.full_name}`);
          router.push("/pos"); 
          break;
        default:
          alert("Unauthorized role. Please contact your Technical Lead.");
      }
    }catch (err: any) {
      const errorMsg = err.response?.data?.message || "Login failed.";
      alert(errorMsg);
    } finally {
      setIsLoading(false); // Stop loading regardless of success/fail
    }
  };

  return (
    <>
      <button className="mb-2 p-1 rounded-md border border-gray-200 hover:bg-gray-50">
        <Link href="/"><ArrowLeft size={24} className="text-gray-600" /></Link>
      </button>

      <h1 className="text-[40px] font-bold text-[#0066FF] leading-tight">
        Sign In
      </h1>
      <p className="text-gray-500 mt-2 mb-8">
        Please Enter your details
      </p>

      <form onSubmit={handleLogin} className="space-y-6">
        <AuthInput 
          label="Email Address" 
          type="email" 
          placeholder="johndoe@gmail.com"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />
        
        <AuthInput 
          label="Terminal PIN" 
          type="password" 
          placeholder="****"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />

        <button 
          type="submit" 
          disabled={isLoading} // Disable while loading
          className={`w-full ${isLoading ? 'bg-blue-400' : 'bg-[#0066FF]'} text-white py-4 rounded-xl font-semibold ...`}
        >
          {isLoading ? "Connecting to Terminal..." : "Continue"}
        </button>
      </form>

      <p className="text-center mt-8 text-gray-500">
        Don’t Have an Account?{" "}
        <Link href="/signup" className="text-[#0066FF] font-bold hover:underline">
          Signup
        </Link>
      </p>
    </>
  );
}