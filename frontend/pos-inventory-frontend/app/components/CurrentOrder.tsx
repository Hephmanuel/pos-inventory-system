"use client";

import { Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";

interface CurrentOrderProps {
    items: any[];
    setItems: React.Dispatch<React.SetStateAction<any[]>>;
    onCompletePayment: () => void;
  }

export default function CurrentOrder({ items, setItems, onCompletePayment }: CurrentOrderProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  const updateQty = (id: number, delta: number) => {
  setItems(prev => prev.map(item => 
    item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
  ));
};

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }

  return (
 
    <div className="w-88 bg-white h-full flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">Current Order</h2>
      
      {/* Scrollable Cart Items */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="p-4 border border-gray-100 rounded-xl flex items-center justify-between">

            <div>
              <h4 className="font-semibold text-sm">{item.name}</h4>
              <p className="text-[#0066FF] font-bold text-xs uppercase">NGN {item.price.toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-3">

              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                   <button onClick={() => updateQty(item.id, -1)}
                    className="w-6 h-6 bg-white shadow-sm rounded flex items-center justify-center hover:bg-gray-50">
                    <Minus size={12}/>
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                 
                  <button onClick={() => updateQty(item.id, 1)}
                    className="w-6 h-6 bg-white shadow-sm rounded flex items-center justify-center hover:bg-gray-50">
                    <Plus size={12}/>
                  </button>
              </div>

              <button onClick={() => removeItem(item.id)} 
              className="text-gray-700 hover:text-red-700 transition-colors"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>

      {/* Totals Section */}
      <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-bold text-gray-900 font-mono">NGN {calculateTotal().toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Discount</span>
          <button className="text-[#0066FF] font-bold hover:underline">Not Available</button>
        </div>
        <div className="flex justify-between text-xl font-black pt-2">
          <span>Total</span>
          <span className="font-mono">NGN {calculateTotal().toLocaleString()}</span>
        </div>

        <div className="flex gap-4 mt-4">
          <button 
    onClick={() => setPaymentMethod('cash')}
    className={`flex-1 py-8 rounded-xl font-bold border-2 transition-all ${
      paymentMethod === 'cash' ? "border-[#0066FF] bg-[#EBF3FF] text-[#0066FF]" : "bg-gray-200 text-gray-700 border-transparent"
    }`}
  >
    Cash
  </button>
  <button 
    onClick={() => setPaymentMethod('card')}
    className={`flex-1 py-8 rounded-xl font-bold border-2 transition-all ${
      paymentMethod === 'card' ? "border-[#0066FF] bg-[#EBF3FF] text-[#0066FF]" : "border-transparent bg-[#E5E5E5] text-gray-700"
    }`}
  >
    Card
  </button>
        </div>
        <button onClick={onCompletePayment} // Trigger the modal in the parent page
        className="w-full bg-[#0066FF] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-100 uppercase tracking-widest">
          PAY
        </button>
      </div>
    </div>
  );
}