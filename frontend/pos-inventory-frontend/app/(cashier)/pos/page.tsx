"use client";

import SearchBar from "@/app/components/SearchBar";
import DataTable from "@/app/components/DataTable";
import CurrentOrder from "@/app/components/CurrentOrder";
import { useState } from "react";
import SuccessModal from "@/app/components/SuccessModal";

export default function POSPage() {

    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    // This function will be triggered by the button in the sidebar
  const handlePaymentSuccess = () => {setIsSuccessOpen(true);};

  // Moving the Cart State to the Page level so both components can access it
  const [cartItems, setCartItems] = useState<any[]>([]);

  const handleAddItem = (product: any) => {
    setCartItems((prev) => {
      // Check if item already exists in cart
      const existingItem = prev.find((item) => item.id === product.id);
      
      if (existingItem) {
        // If it exists, just increase quantity
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      // If it's new, add it with qty 1
      return [...prev, { ...product, qty: 1 }];
    });
  };

  return (
    /* h-full ensures it takes the full remaining height under the header */
    <div className="flex h-full w-full overflow-hidden">
      
      {/* Middle Section: Search and Inventory */}
      {/* Added p-6 here so the middle content has breathing room, but the sidebar stays flush */}
      <div className="flex-1 flex flex-col min-w-0 p-6 overflow-hidden">
        <SearchBar />
        <DataTable onRowClick={handleAddItem} />
      </div>

      {/* Right Sidebar: Current Order */}
      {/* Removed any outer margins to ensure it touches the header and right edge */}
      <div className="h-full border-l border-gray-200 bg-white">
        <CurrentOrder 
        items={cartItems} 
        setItems={setCartItems}
        onCompletePayment={handlePaymentSuccess} />
      </div>
      <SuccessModal 
        isOpen={isSuccessOpen} 
        onClose={() => setIsSuccessOpen(false)} 
        totalAmount={10000}/>
    </div>

    
  );
}