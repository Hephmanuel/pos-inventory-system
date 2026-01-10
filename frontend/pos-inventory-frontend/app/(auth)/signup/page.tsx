"use client";

import Link from "next/link";
import AuthInput from "@/app/components/AuthInput"; // Adjust path based on your setup
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  return (
    <>
      <button className="mb-2 p-1 rounded-md border border-gray-200 hover:bg-gray-50">
        <ArrowLeft size={24} className="text-gray-600" />
        <Link href="/"></Link>
      </button>

      <h1 className="text-4xl font-bold text-[#0066FF]">Sign Up</h1>
      <p className="text-gray-500 mb-8">Please Provide your details</p>

      <form className="space-y-6">
        <AuthInput label="Name" type="text" />
        <AuthInput label="Email Address" type="email" />
        <AuthInput label="Password" type="password" />
        <AuthInput label="Repeat Password" type="password" />

        <button className="w-full bg-[#0066FF] text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
          Continue<Link href="/login"></Link>
        </button>
      </form>

      <p className="text-center mt-8 text-gray-500">
        Already Have an Account?{""}
        <Link href="/login/" className="text-[#0066FF] font-bold hover:underline">Login</Link>
      </p>
    </>
  );
}