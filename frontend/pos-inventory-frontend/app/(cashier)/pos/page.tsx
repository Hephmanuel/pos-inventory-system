"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/app/components/SearchBar";
import DataTable from "@/app/components/DataTable";
import CurrentOrder from "@/app/components/CurrentOrder";
import SuccessModal from "@/app/components/SuccessModal";
import { getCatalogTableData } from "@/app/catalog"; 
import { processCheckout } from "@/app/services/posService"; 

export default function POSPage() {
  // --- UI & Loading States ---
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // --- Data States ---
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");   
  const [cartItems, setCartItems] = useState<any[]>([]); 

  // 1. Initial Load: Fetch live inventory
  const loadPOSData = async () => {
    setIsLoading(true);
    try {
      const data = await getCatalogTableData();
      setInventory(data);
    } catch (err) {
      console.error("POS Data Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPOSData();
  }, []);

  // 2. Search Logic: Filters by Name, SKU, and Category
  const filteredInventory = inventory.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.product.toLowerCase().includes(query) || 
      item.sku.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  // 3. Cart Logic: Add products or increase quantity
  const handleAddItem = (product: any) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // 4. Checkout Logic: Deducts stock in DB and refreshes UI
  const handlePayment = async () => {
    if (cartItems.length === 0) return alert("Your cart is empty.");

    // Retrieve the employee ID from storage
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return alert("Session expired. Please log in again.");
    const employeeId = JSON.parse(savedUser).id;

    setIsProcessing(true);
    try {
      // Prepare data exactly as required by documentation
      const checkoutData = {
        employee_id: employeeId, 
        items: cartItems.map(item => ({
          sku_id: item.id, // Corrected key: sku_id
          quantity: item.qty
        }))
      };

      // Call service with corrected endpoint /sales/checkout
      await processCheckout(checkoutData);

      setIsSuccessOpen(true);
      await loadPOSData(); // Refresh stock counts in UI
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Checkout failed. Verify connection.";
      alert(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="flex h-full w-full overflow-hidden">
      
      <div className="flex-1 flex flex-col min-w-0 p-6 overflow-hidden">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Search by Name, SKU, or Category..." 
        />
        
        <DataTable 
          products={filteredInventory} 
          onRowClick={handleAddItem} 
          isLoading={isLoading} 
        />
      </div>

      <div className="h-full border-l border-gray-200 bg-white">
        <CurrentOrder 
          items={cartItems} 
          setItems={setCartItems}
          onCompletePayment={handlePayment} 
        />
      </div>

      <SuccessModal 
        isOpen={isSuccessOpen} 
        onClose={() => {
          setIsSuccessOpen(false);
          setCartItems([]); 
        }} 
        totalAmount={totalAmount}
      />

      {isProcessing && (
        <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}