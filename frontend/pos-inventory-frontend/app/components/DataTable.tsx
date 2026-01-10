"use client";

const Products = [
  { id: "1", name: "Tom-Tom",          category: "Snacks",      stock: 10, price: 1500.00 },
  { id: "2", name: "Blue T-Shirt",     category: "Clothing",     stock: 15, price: 1500.00 },
  { id: "3", name: "Black Purse",      category: "Accessories",  stock: 8, price: 1500.00 },
  { id: "4", name: "Tom-Tom",          category: "Snacks",       stock: 12, price: 1500.00 },
  { id: "5", name: "Red T-Shirt",      category: "Clothing",     stock: 5, price: 1500.00 },
  { id: "6", name: "Brown Belt",       category: "Accessories",  stock: 20, price: 1500.00 },
  { id: "7", name: "Tom-Tom",          category: "Snacks",       stock: 7, price: 1500.00 },
  { id: "8", name: "Green T-Shirt",    category: "Clothing",     stock: 9, price: 1500.00 },
  { id: "9", name: "Silver Necklace",  category: "Accessories",  stock: 4, price: 1500.00 },

];

 

export default function DataTable({ onRowClick }: { onRowClick: (product: any) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
      <div className="overflow-y-auto">
        <table className="w-full text-center border-collapse">
          <thead className="bg-[#F8F9FB] sticky top-0 z-10 border-b border-gray-100">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase tracking-wider">SKU</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase tracking-wider">Product</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase tracking-wider">Category</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase tracking-wider">Stock</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Products.map((product) => (
              <tr 
                key={product.id} 
                onClick={() => onRowClick(product)}
                className="hover:bg-[#EBF3FF] cursor-pointer transition-colors"
              >
                <td className="px-8 py-4 text-[11px] ">{product.id}</td>
                <td className="px-8 py-4 text-[11px] ">{product.name}</td>
                <td className="px-8 py-4 text-[11px] ">{product.category}</td>
                <td className="px-8 py-4 text-[11px] font-bold">{product.stock}</td>
                <td className="px-8 py-4 text-[11px] font-bold">
                  NGN {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}