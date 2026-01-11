"use client";

// 1. Define what a Product looks like based on your backend
interface Product {
  skuId: string;
  sku: string;
  product: string;
  category: string;
  stock: number;
  price: number;
}

interface DataTableProps {
  products: Product[]; // Receives the live list
  onRowClick: (product: any) => void;
  isLoading: boolean; // Shows a loading state
}

export default function DataTable({ products, onRowClick, isLoading }: DataTableProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border">
        <p className="text-gray-400 animate-pulse font-bold">Fetching Live Inventory...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
      <div className="overflow-y-auto">
        <table className="w-full text-center border-collapse">
          <thead className="bg-[#F8F9FB] sticky top-0 z-10 border-b border-gray-100">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase">SKU</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase">Product</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase">Category</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase">Stock</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((item) => (
              <tr 
                key={item.skuId} 
                onClick={() => onRowClick({ id: item.skuId, name: item.product, price: item.price })}
                className="hover:bg-[#EBF3FF] cursor-pointer transition-colors"
              >
                <td className="px-8 py-4 text-[11px]">{item.sku}</td>
                <td className="px-8 py-4 text-[11px]">{item.product}</td>
                <td className="px-8 py-4 text-[11px]">{item.category}</td>
                <td className={`px-8 py-4 text-[11px] font-bold ${item.stock <= 5 ? 'text-red-500' : ''}`}>
                  {item.stock}
                </td>
                <td className="px-8 py-4 text-[11px] font-bold text-[#0066FF]">
                  NGN {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-20 text-center text-gray-400">No products found in inventory.</div>
        )}
      </div>
    </div>
  );
}