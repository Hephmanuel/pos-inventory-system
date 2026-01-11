"use client";

import Link from "next/link";
import AuthInput from "@/app/components/AuthInput";
import { ArrowLeft } from "lucide-react";
import { useSignup } from "@/app/hooks/useSignups"; // Our new module

export default function SignUpPage() {
  const { formData, updateField, submitSignup, isLoading } = useSignup();

  return (
    <>
      <button className="mb-2 p-1 rounded-md border border-gray-200 hover:bg-gray-50">
        <Link href="/"><ArrowLeft size={24} className="text-gray-600" /></Link>
      </button>

      <h1 className="text-4xl font-bold text-[#0066FF]">Sign Up</h1>
      <p className="text-gray-500 mb-8">Register a new staff member</p>

      <form className="space-y-6" onSubmit={submitSignup}>
        <div className="flex gap-4 w-full">
          <div className="flex-1">
             <AuthInput label="First Name" type="text" onChange={(e: any) => updateField('first_name', e.target.value)} />
          </div>
          <div className="flex-1">
            <AuthInput label="Last Name" type="text" onChange={(e: any) => updateField('last_name', e.target.value)} />
          </div>
        </div>
        
        <AuthInput label="Email Address" type="email" onChange={(e: any) => updateField('email', e.target.value)} />
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Staff Role</label>
          <select 
            className="w-full p-4 rounded-xl border border-gray-200 bg-white"
            value={formData.role}
            onChange={(e) => updateField('role', e.target.value)}
          >
            <option value="cashier">Cashier</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        
        <AuthInput label="Terminal PIN" type="password" onChange={(e: any) => updateField('pin_code', e.target.value)} />

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full ${isLoading ? 'bg-blue-400' : 'bg-[#0066FF]'} text-white py-4 rounded-xl font-semibold transition-all`}
        >
          {isLoading ? "Creating..." : "Register Staff Member"}
        </button>
      </form>
    </>
  );
}