'use client';
import React from 'react';
import { Montserrat } from 'next/font/google';
import { useState, useEffect } from 'react';
import { baseURL } from '@/app/constant';
import { useRef } from 'react';
import '../../globals.css';

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
});
type InventoryRow = {
  productId: string;
  skuId: string;
  sku: string;
  product: string;
  category: string;
  stock: number;
  price: number;
  optimistic?: boolean;
  rollback?: boolean; // 👈 PUT IT HERE
};

// CORS is a backend concern. Do not require or use server middleware in client components.
//
// File: Inventory page (client)
// Purpose: Manage inventory list, add products, edit, delete and display stock/price.
// This component is a client component (use client) and uses fetch() to call
// backend endpoints defined in `baseURL`.

export default function InventoryPage() {
  // UI state for modals and notifications
  const [open, setOpen] = useState(false); // Add Product modal
  const [success, setSuccess] = useState(false); // Add success toast
  const [isDeleting, setIsDeleting] = useState(false); // Delete confirm modal
  const [deleteSuccess, setDeleteSuccess] = useState(false); // Delete success toast
  const [editOpen, setEditOpen] = useState(false); // Edit product modal
  const [addStockOpen, setAddStockOpen] = useState(false); // Add stock modal
  const [shake, setShake] = useState(false); //Adding shake animations
  const fetchingRef = useRef(false); //Prevents re duplicate fetches
  const [isUpdating, setIsUpdating] = useState(false);
  const [editShake, setEditShake] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);

  // General UI messages and data
  const [successMsg, setSuccessMsg] = useState(''); // generic success message
  const [inventoryData, setInventoryData] = useState([]); // raw inventory payload (unused currently)
  const [rows, setRows] = useState<any[]>([]); // flattened rows for table display
  const [error, setError] = useState<string | null>(null); // error display
  const [loading, setLoading] = useState(false); // loading indicator for async ops
  const [skuError, setSkuError] = useState<string | null>(null);
  const SKU_REGEX = /^[A-Z0-9]+(-[A-Z0-9]+)*$/;
  const [loadingTable, setLoadingTable] = useState(true); //Loading Table state
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null); //stores the row being edited
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState<{
    productName?: string;
    category?: string;
    price?: string;
  }>({});

  // Form state for creating a product
  const [form, setForm] = useState({
    productName: '',
    category: '',
    price: '',
    sku: '',
  });
  //Create a variable to judge form validity
  const isFormValid =
    form.productName.trim() !== '' &&
    form.category.trim() !== '' &&
    form.price !== '' &&
    Number(form.price) > 0 &&
    !skuError;

  const [editErrors, setEditErrors] = useState<{
    price?: string;
  }>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const [stockAmount, setStockAmount] = useState('');
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  async function handleAddStock(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedRow) return;

    const desiredStock = Number(stockAmount);
    const currentStock = selectedRow.stock;
    const adjustment = desiredStock - currentStock;

    if (isNaN(desiredStock)) {
      setStockError('Enter a valid number');
      return;
    }

    if (adjustment === 0) {
      setStockError('No stock change detected');
      return;
    }

    try {
      setIsAddingStock(true);
      setStockError(null);

      const res = await fetch(`${baseURL}/inventory/adjust`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sku_id: selectedRow.skuId,
          quantity: adjustment, // ✅ POSITIVE = ADD
          reason: 'Manual restock from inventory screen',
          // optional but safe
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Add stock error:', err);
        throw new Error(err.message || 'Failed to add stock');
      }

      // 🔁 Refresh from backend (source of truth)
      await loadInventory();

      // ✅ UX
      setAddStockOpen(false);
      setStockAmount('');
      setSuccessMsg('Stock added successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
      setEditOpen(true);
    } catch (err: any) {
      console.error(err);
      setStockError(err.message || 'Failed to add stock');
    } finally {
      setIsAddingStock(false);
    }
  }

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();

    setAttemptedSubmit(true);

    if (!isFormValid) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    // 🚫 BLOCK  IF SKU IS INVALID
    if (skuError) {
      setError('Please fix SKU format before submitting');
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setTimeout(() => setError(null), 3000);
      return;
    }
    const errors: typeof formErrors = {};

    if (!form.productName.trim()) {
      errors.productName = 'Product name is required😌';
    }

    if (!form.category.trim()) {
      errors.category = 'Category is required😌';
    }

    if (!form.price || Number(form.price) <= 0) {
      errors.price = 'Price must be greater than 0😒';
    }

    if (Object.keys(errors).length > 0 || skuError) {
      setFormErrors(errors);
      setError('Please fix the highlighted fields before submitting');
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build the payload expected by the backend product creation endpoint
      const payload = {
        name: form.productName,
        description: form.category,
        active: true,
        skus: [
          {
            sku_code: form.sku,
            price: Number(form.price), // ensure numeric
            attribute: 'Default',
          },
        ],
      };

      // POST to backend API to create a product with a single SKU
      const res = await fetch(`${baseURL}/catalog/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // If backend returns non-2xx, try to parse and throw the error payload
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }

      // 1️⃣ CREATE OPTIMISTIC ROW 👇 (HERE)
      const optimisticRow = {
        skuId: crypto.randomUUID(),
        sku: form.sku,
        product: form.productName,
        category: form.category,
        stock: 0,
        price: Number(form.price),
        optimistic: true,
      };

      // 2️⃣ INSERT INTO TABLE IMMEDIATELY
      setRows((prev) => [optimisticRow, ...prev]);

      // Success: close modal, show toast and reset form
      setOpen(false);
      setSuccess(true);
      setForm({ productName: '', category: '', price: '', sku: '' });
      // ✅ STEP 5B
      setAttemptedSubmit(false);

      // 🔥 REFRESH TABLE DATA
      await loadInventory();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const message = Array.isArray(err?.message)
        ? err.message.join(', ')
        : err?.message || 'Failed to create product';

      setError(message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  }
  //Prevents Update if nothing changed
  function hasProductChanged(row: any, original: any) {
    return (
      Number(row.price) !== Number(original.price) ||
      row.product !== original.product ||
      row.category !== original.category
    );
  }

  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedRow || isUpdating) return;

    // 🚫 1️⃣ Validate before anything
    if (!selectedRow.price || Number(selectedRow.price) <= 0) {
      setEditErrors({ price: 'Price must be greater than 0' });
      setEditShake(true);
      setTimeout(() => setEditShake(false), 400);
      return;
    }

    // 🧠 2️⃣ SAVE PREVIOUS ROW (PUT THIS HERE)
    const previousRow = rows.find((r) => r.skuId === selectedRow.skuId);

    if (previousRow && !hasProductChanged(selectedRow, previousRow)) {
      setEditShake(true);
      setError('No changes detected');
      setTimeout(() => setEditShake(false), 400);
      setTimeout(() => setError(null), 2000);
      return;
    }

    try {
      setIsUpdating(true);
      setEditErrors({});

      // ⚡ 3️⃣ OPTIMISTIC UI UPDATE (PUT THIS HERE)
      setRows((prev) =>
        prev.map((r) =>
          r.skuId === selectedRow.skuId
            ? {
                ...r,
                price: Number(selectedRow.price),
                product: selectedRow.product,
                category: selectedRow.category,
                optimistic: true,
              }
            : r
        )
      );

      // 🔹 4️⃣ PATCH SKU PRICE
      const res = await fetch(
        `${baseURL}/catalog/skus/${selectedRow.skuId}/price`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base_price: Number(selectedRow.price),
          }),
        }
      );

      if (!res.ok) throw new Error('Price update failed');

      // 🔹 5️⃣ PATCH PRODUCT DETAILS
      await updateProductDetails(selectedRow.productId, {
        name: selectedRow.product,
        description: selectedRow.category,
      });

      // ✅ 6️⃣ CLEAR OPTIMISTIC FLAG (PUT THIS HERE)
      setRows((prev) =>
        prev.map((r) =>
          r.skuId === selectedRow.skuId ? { ...r, optimistic: false } : r
        )
      );

      setEditOpen(false);
      setSuccessMsg('Product updated successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);

      // 🔄 7️⃣ ROLLBACK ON FAILURE (PUT THIS HERE)
      if (previousRow) {
        setRows((prev) =>
          prev.map((r) => (r.skuId === previousRow.skuId ? previousRow : r))
        );
      }

      setError('Failed to update product');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  }

  async function updateProductDetails(
    productId: string,
    payload: {
      name?: string;
      description?: string;
    }
  ) {
    const res = await fetch(`${baseURL}/catalog/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Failed to update product details');
    }
  }

  async function loadInventory() {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoadingTable(true);

    try {
      console.log('loadInventory called');

      const [productsRes, stockRes] = await Promise.all([
        fetch(`${baseURL}/catalog/products`),
        fetch(`${baseURL}/inventory/stock-levels`),
      ]);

      const all = await productsRes.json();
      const stockLevels = await stockRes.json();

      // Only show active products
      const products = all.filter((p: any) => p.active === true);

      // Build lookup map from sku_id → quantity
      const stockMap: Record<string, number> = {};
      stockLevels.forEach((item: any) => {
        stockMap[item.sku_id] = Number(item.quantity_available);
      });

      // Build table rows
      const tableRows = products.flatMap((product: any) =>
        product.skus.map((sku: any) => ({
          productId: product.id,
          skuId: sku.id,
          sku: sku.sku_code,
          product: product.name,
          category: product.description,
          stock: stockMap[sku.id] ?? 0, // 0 if missing
          price: Number(sku.base_price),
        }))
      );

      setRows(tableRows);
    } catch (err) {
      console.error('Inventory fetch error:', err);
    } finally {
      fetchingRef.current = false;
      setLoadingTable(false);
    }
  }

  async function handleDeleteProduct() {
    if (!rowToDelete) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${baseURL}/catalog/products/${rowToDelete.productId}`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      // ✅ Refresh from backend so it disappears
      await loadInventory();

      // ✅ UX cleanup
      setIsDeleting(false);
      setRowToDelete(null);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete product');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredRows = rows.filter((row) => {
    const term = searchTerm.toLowerCase();

    return (
      row.product.toLowerCase().includes(term) ||
      row.sku.toLowerCase().includes(term)
    );
  });
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1
            className={`text-2xl font-bold text-black ${montserrat.className}`}
          >
            Inventory
          </h1>
          <p className={`text-gray-600 mt-2 ${montserrat.className}`}>
            Manage your inventory here
          </p>
        </div>
        <button>
          <span
            onClick={() => {
              setOpen(true);
              setAttemptedSubmit(false); // ✅ STEP 5A
            }}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 ${montserrat.className}`}
          >
            Add Product
          </span>
        </button>
      </div>
      {/* SEARCH */}
      <div className='bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm'>
        <svg
          width='28'
          height='21'
          viewBox='0 0 28 21'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M26.5639 19.25L20.4464 14.9M23.7513 9.25C23.7513 13.6683 18.7142 17.25 12.5006 17.25C6.28708 17.25 1.25 13.6683 1.25 9.25C1.25 4.83172 6.28708 1.25 12.5006 1.25C18.7142 1.25 23.7513 4.83172 23.7513 9.25Z'
            stroke='#767676'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>

        <input
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Search Product by name or SKU'
          className={`w-full outline-none text-md text-gray-700
  transition-all duration-200
  focus:ring-2 focus:ring-blue-400
  focus:shadow-md ${montserrat.className}`}
        />
      </div>
      ``
      {/* Error Message */}
      {error && (
        <div className='fixed bottom-6 right-6 z-50'>
          <div className='bg-red-200 text-red-900 px-4 py-3 rounded-lg shadow'>
            {error}
          </div>
        </div>
      )}
      {/* Success for editing */}
      {successMsg && (
        <div className='fixed top-6 right-6 z-50'>
          <div className='flex items-center gap-3 bg-green-200 text-green-900 px-4 py-3 rounded-lg shadow'>
            <span className={`font-medium ${montserrat.className}`}>
              {successMsg}
            </span>

            <button
              onClick={() => setSuccessMsg('')}
              className='ml-2 text-green-900 hover:text-black'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-x-icon lucide-x'
              >
                <path d='M18 6 6 18' />
                <path d='m6 6 12 12' />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* SUCCESS ALERT (Add product) */}
      {success && (
        <div className='fixed bottom-6 right-6 z-50'>
          <div className='flex items-center gap-3 bg-green-200 text-green-900 px-4 py-3 rounded-lg shadow'>
            <span className={`font-medium ${montserrat.className}`}>
              Product has been added
            </span>

            <button
              onClick={() => setSuccess(false)}
              className='ml-2 text-green-900 hover:text-black'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-x-icon lucide-x'
              >
                <path d='M18 6 6 18' />
                <path d='m6 6 12 12' />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* DELETE SUCCESS ALERT */}
      {deleteSuccess && (
        <div className='fixed bottom-6 right-6 z-50'>
          <div className='flex items-center gap-3 bg-green-200 text-green-900 px-4 py-3 rounded-lg shadow'>
            <span className={`font-medium ${montserrat.className}`}>
              Product has been deleted
            </span>

            <button
              onClick={() => setDeleteSuccess(false)}
              className='ml-2 text-green-900 hover:text-black'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-x-icon lucide-x'
              >
                <path d='M18 6 6 18' />
                <path d='m6 6 12 12' />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* DELETE CONFIRMATION */}
      {isDeleting && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          {/* Overlay */}
          <div
            onClick={() => setIsDeleting(false)}
            className='absolute inset-0 bg-black/40'
          />

          {/* Modal Card */}
          <div className='relative bg-white rounded-lg w-full max-w-md p-6 shadow-lg'>
            {/* Header */}
            <div className='flex items-center justify-end mb-6'>
              <button
                onClick={() => setIsDeleting(false)}
                className='text-gray-500 hover:text-black'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='lucide lucide-x-icon lucide-x'
                >
                  <path d='M18 6 6 18' />
                  <path d='m6 6 12 12' />
                </svg>
              </button>
            </div>

            {/* CONFIRMATION TEXT */}
            <div className='flex flex-col items-center text-center mb-3 gap-3'>
              <p className='text-black font-bold'>{rowToDelete?.product}</p>

              <p className={`text-gray-500 text-sm ${montserrat.className}`}>
                SKU: {rowToDelete?.sku}
              </p>
            </div>

            {/* ACTIONS */}
            <div
              className={`flex justify-center gap-8 mt-6 ${montserrat.className}`}
            >
              <button
                onClick={() => setIsDeleting(false)}
                className={`px-4 py-2 border-black border text-black rounded-lg text-sm ${montserrat.className}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={loading}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700
    ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Product Popup */}
      {editOpen && (
        <div className='fixed inset-0 bg-black/40 z-40 flex items-center justify-center'>
          <div
            className={`relative bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg ${
              editShake ? 'animate-shake' : ''
            }`}
          >
            <h2
              className={`text-xl font-bold text-black mb-6 ${montserrat.className} `}
            >
              Edit Product
            </h2>

            <form
              onSubmit={handleUpdateProduct}
              className={`grid grid-cols-2 gap-4 ${montserrat.className}`}
            >
              {/* LEFT */}
              <Input
                label='Product Name'
                value={selectedRow?.product || ''}
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({
                    ...prev,
                    product: e.target.value,
                  }))
                }
              />
              <Input
                label='Category'
                value={selectedRow?.category || ''}
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              />

              <div>
                <Input
                  label='Price'
                  value={selectedRow?.price || ''}
                  onChange={(e) => {
                    setSelectedRow((prev: any) => ({
                      ...prev,
                      price: e.target.value,
                    }));
                    setEditErrors({});
                  }}
                />

                {editErrors.price && (
                  <p className='text-sm text-red-600 mt-1'>
                    {editErrors.price}
                  </p>
                )}
              </div>
              <Input label='SKU' value={selectedRow?.sku || ''} disabled />

              {/* ACTIONS */}
              <div className='col-span-2 flex justify-between mt-6'>
                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={() => {
                      setAddStockOpen(true);
                      setEditOpen(false);
                      setStockAmount(String(selectedRow.stock));
                    }}
                    disabled={isUpdating}
                    className={`' border  text-white bg-blue-600 px-4 py-2 rounded-lg'
    ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Add Stock
                  </button>
                </div>

                <div className='flex gap-3'>
                  <button
                    disabled={isUpdating}
                    onClick={() => setEditOpen(false)}
                    className={`border border-black text-black px-4 py-2 rounded
    ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Cancel
                  </button>

                  <button
                    type='submit'
                    disabled={isUpdating}
                    className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2
    ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isUpdating && (
                      <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    )}
                    {isUpdating ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* The Add Product Popup */}
      {addStockOpen && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
          <div className='bg-white w-100 rounded-lg p-6'>
            <h3 className='text-lg text-black font-semibold mb-4'>Add Stock</h3>

            <form onSubmit={handleAddStock} className='space-y-4'>
              <div>
                <label className='block text-sm text-black mb-1'>
                  Insert Stock
                </label>

                <input
                  type='number'
                  value={stockAmount}
                  onChange={(e) => setStockAmount(e.target.value)}
                  className='w-full border border-black text-black rounded px-3 py-2'
                  placeholder='100'
                />

                {stockError && (
                  <p className='text-sm text-red-600 mt-1'>{stockError}</p>
                )}
              </div>

              <div className='flex justify-end gap-3 mt-4'>
                <button
                  type='button'
                  onClick={() => {
                    setAddStockOpen(false); // close Add Stock
                    setEditOpen(true); // reopen Edit popup
                  }}
                  className='border border-black text-black px-4 py-2 rounded'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  disabled={isAddingStock}
                  className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2
    ${isAddingStock ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isAddingStock && (
                    <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  )}
                  {isAddingStock ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add product popup */}
      {/* MODAL */}
      {open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          {/* Overlay */}
          <div
            onClick={() => !loading && setOpen(false)}
            className='absolute inset-0 bg-black/40'
          />

          {/* Modal */}
          <div
            className={`relative bg-white rounded-2xl w-full max-w-2xl p-6 shadow-lg ${
              shake ? 'animate-shake' : ''
            }`}
          >
            <h2 className='text-xl font-semibold mb-6 text-black'>
              Add Product
            </h2>

            <form
              onSubmit={handleCreateProduct}
              className='grid grid-cols-2 gap-4 text-black'
            >
              <div>
                <Input
                  label='Product Name'
                  value={form.productName}
                  onChange={(e) => handleChange('productName', e.target.value)}
                />
                {formErrors.productName && (
                  <p className='text-sm text-red-600 mt-1'>
                    {formErrors.productName}
                  </p>
                )}
              </div>
              <div>
                <Input
                  label='Category'
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                />
                {formErrors.category && (
                  <p className='text-sm text-red-600 mt-1'>
                    {formErrors.category}
                  </p>
                )}
              </div>
              <div>
                <Input
                  label='Price'
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                />
                {formErrors.price && (
                  <p className='text-sm text-red-600 mt-1'>
                    {formErrors.price}
                  </p>
                )}
              </div>
              <div>
                <Input
                  label='SKU'
                  value={form.sku}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();

                    handleChange('sku', value);

                    if (!SKU_REGEX.test(value)) {
                      setSkuError(
                        'SKU must contain only letters, numbers, and dashes (e.g. CRB-219)😌'
                      );
                    } else {
                      setSkuError(null);
                    }
                  }}
                />
                {skuError && (
                  <p className='text-sm text-red-600 mt-1'>{skuError}</p>
                )}
                {/* SKU SUCCESS */}
                {!skuError && form.sku && (
                  <p className='text-sm text-green-600 mt-1'>
                    SKU format looks good😉👌
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              <div className='col-span-2 flex justify-end gap-3 mt-4'>
                <button
                  type='button'
                  disabled={loading}
                  onClick={() => {
                    setOpen(false);
                    setAttemptedSubmit(false);
                  }}
                  className='px-4 py-2 border rounded-lg text-sm border-black text-black'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  disabled={loading}
                  onClick={() => {
                    if (!isFormValid) {
                      setAttemptedSubmit(true);
                      setShake(true);
                      setTimeout(() => setShake(false), 400);
                    }
                  }}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2'
                >
                  {loading && (
                    <span className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
                  )}
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
              </div>
              {/* ✅ STEP 3 GOES HERE */}
              <div className='relative right-0'>
                {attemptedSubmit && !isFormValid && (
                  <p className='text-md text-red-600'>
                    Fill all fields correctly to enable submission
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      {/* TABLE */}
      <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
        <table className='w-full text-sm'>
          <thead
            className={`bg-gray-100 text-gray-600 ${montserrat.className}`}
          >
            <tr>
              <th className='text-left px-6 py-3'>SKU</th>
              <th className='text-left px-6 py-3'>Product</th>
              <th className='text-left px-6 py-3'>Category</th>
              <th className='text-left px-6 py-3'>Stock</th>
              <th className='text-left px-6 py-3'>Price</th>
              <th className='text-left px-6 py-3'>Action</th>
            </tr>
          </thead>

          <tbody>
            {loadingTable ? (
              <>
                <TableSkeletonRow />
                <TableSkeletonRow />
                <TableSkeletonRow />
                <TableSkeletonRow />
                <TableSkeletonRow />
              </>
            ) : (
              filteredRows.map((row, i) => (
                <tr
                  key={row.skuId ?? i}
                  className={`border-t last:border-b hover:bg-gray-50
        transition-all duration-300 animate-fade-in animate-fade-slide ${
          montserrat.className
        }
        ${row.optimistic ? 'animate-row-in' : ''}
      `}
                >
                  <td className='px-6 py-4 text-gray-600 flex items-center gap-2'>
                    {row.sku}
                    {row.optimistic && (
                      <span className='text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded'>
                        NEW
                      </span>
                    )}
                  </td>

                  <td className='px-6 py-4 text-gray-600'>{row.product}</td>

                  <td className='px-6 py-4 text-gray-600'>{row.category}</td>

                  <td
                    className={`px-6 py-4 font-medium
               ${row.stock <= 10 ? 'text-red-600' : 'text-gray-900'}
                     `}
                  >
                    {row.stock}

                    {row.stock <= 10 && (
                      <span className='ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded'>
                        LOW
                      </span>
                    )}
                  </td>

                  <td className='px-6 py-4 text-gray-600'>
                    {row.price.toFixed(2)}
                  </td>

                  <td className='px-6 py-4 flex gap-4'>
                    <button
                      className={`text-black  transition-all duration-200
    hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-200
    active:scale-95 ${
      row.optimistic
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'text-black hover:shadow-lg'
    }`}
                      onClick={() => {
                        setRowToDelete(row);
                        setIsDeleting(true);
                      }}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-trash2-icon lucide-trash-2'
                      >
                        <path d='M10 11v6' />
                        <path d='M14 11v6' />
                        <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' />
                        <path d='M3 6h18' />
                        <path d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
                      </svg>
                    </button>
                    <button
                      className={`text-blue-600 transition-all duration-200
    hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-200
    active:scale-95 ${
      row.optimistic
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : ' text-blue-500 hover:shadow-lg'
    }`}
                      onClick={() => {
                        setEditOpen(true);
                        setSelectedRow(row);
                      }}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-square-pen-icon lucide-square-pen'
                      >
                        <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                        <path d='M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z' />
                      </svg>
                    </button>

                    {/* 👇 PUT IT HERE */}
                    {row.optimistic && (
                      <span className='text-xs text-gray-500 ml-2'>
                        Syncing…
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function Input({ label, ...props }: InputProps) {
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-bold text-black'>{label}</label>
      <input
        {...props}
        className='border-black border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500'
      />
    </div>
  );
}

function TableSkeletonRow() {
  return (
    <tr className='border-t animate-pulse'>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className='px-6 py-4'>
          <div className='h-4 bg-gray-400 rounded w-full' />
        </td>
      ))}
    </tr>
  );
}
