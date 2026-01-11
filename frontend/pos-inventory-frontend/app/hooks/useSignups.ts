// @ts-nocheck
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerStaff } from "@/app/services/authService"; //

export function useSignup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    pin_code: "",
    role: "cashier"
  });

  // Helper to update specific fields
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerStaff(formData); //
      alert("Staff Member Registered!");
      router.push("/login");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Signup failed";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, updateField, submitSignup, isLoading };
}