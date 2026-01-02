'use client';
import React from 'react';
import { Montserrat } from 'next/font/google';
import { useState } from 'react';

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
});

export default function InventoryPage() {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
            onClick={() => setOpen(true)}
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
            stroke-width='2.5'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>

        <input
          type='text'
          placeholder='Search Product by name or Scan Barcode'
          className={`w-full outline-none text-md text-gray-500 ${montserrat.className}`}
        />
      </div>
      ``
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
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
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
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
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
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
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
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='lucide lucide-x-icon lucide-x'
                >
                  <path d='M18 6 6 18' />
                  <path d='m6 6 12 12' />
                </svg>
              </button>
            </div>

            {/* CONFIRMATION TEXT */}
            <div className='flex flex-col items-center text-center mb-3 gap-3'>
              <p className='text-black font-bold flex items-center'>
                Confirm Delete item?
              </p>
              <p
                className={`text-gray-500 font-bold flex items-center ${montserrat.className}`}
              >
                Deodarant SKU: CRB-234
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
                onClick={() => {
                  setIsDeleting(false);
                  setDeleteSuccess(true);
                  setTimeout(() => setDeleteSuccess(false), 3000);
                }}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 ${montserrat.className}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Product Popup */}
      {editOpen && (
        <div className='fixed inset-0 bg-black/40 z-40 flex items-center justify-center'>
          <div className='relative bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg'>
            <h2
              className={`text-xl font-bold text-black mb-6 ${montserrat.className} `}
            >
              Edit Product
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditOpen(false);
                setSuccessMsg('Product has been updated');
                setTimeout(() => setSuccessMsg(''), 3000);
              }}
              className={`grid grid-cols-2 gap-4 ${montserrat.className}`}
            >
              {/* LEFT */}
              <Input label='Product Name' placeholder='Foxie' />
              <Input label='Category' placeholder='Snacks' />

              <Input label='Sale Price' placeholder='1900' />
              <Input label='Cost Price' placeholder='5000' />

              <Input label='Current Stock' placeholder='200' />
              <Input label='Minimum Stock' placeholder='20' />

              <Input label='SKU' placeholder='CRB-234' />
              <Input label='Expiry Date' placeholder='11/09/27' />

              {/* ACTIONS */}
              <div className='col-span-2 flex justify-between mt-6'>
                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={() => setAddStockOpen(true)}
                    className='bg-blue-600 text-white px-4 py-2 rounded'
                  >
                    Add Stock
                  </button>

                  <button
                    type='button'
                    className='bg-red-600 text-white px-4 py-2 rounded'
                  >
                    Deactivate
                  </button>
                </div>

                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={() => setEditOpen(false)}
                    className='border border-black text-black px-4 py-2 rounded'
                  >
                    Cancel
                  </button>

                  <button
                    type='submit'
                    className='bg-blue-600 text-white px-4 py-2 rounded'
                  >
                    Update
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
          <div className='bg-white w-[400px] rounded-lg p-6'>
            <h3 className='text-lg text-black font-semibold mb-4'>Add Stock</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAddStockOpen(false);
                setSuccessMsg('Stock added successfully');
                setTimeout(() => setSuccessMsg(''), 3000);
              }}
              className='space-y-4'
            >
              <div>
                <label className='block text-sm text-black mb-1'>
                  Insert Stock
                </label>
                <input
                  type='number'
                  className='w-full border border-black text-black rounded px-3 py-2'
                  placeholder='1000'
                />
              </div>

              <div className='flex justify-end gap-3 mt-4'>
                <button
                  type='button'
                  onClick={() => setAddStockOpen(false)}
                  className='border border-black text-black px-4 py-2 rounded'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  className='bg-blue-600 text-white px-4 py-2 rounded'
                >
                  Add
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
            onClick={() => setOpen(false)}
            className='absolute inset-0 bg-black/40'
          />

          {/* Modal Card */}
          <div className='relative bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-semibold text-black'>Add Product</h2>
              <button
                onClick={() => setOpen(false)}
                className='text-gray-500 hover:text-black'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='lucide lucide-x-icon lucide-x'
                >
                  <path d='M18 6 6 18' />
                  <path d='m6 6 12 12' />
                </svg>
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={(e) => {
                e.preventDefault();

                // pretend product was added successfully
                setOpen(false);
                setSuccess(true);

                // auto hide after 3s
                setTimeout(() => setSuccess(false), 3000);
              }}
              className='grid grid-cols-2 gap-4'
            >
              <Input label='Product Name' placeholder='Foxie' />
              <Input label='Category' placeholder='Snacks' />
              <Input label='Sale Price' placeholder='1900' />
              <Input label='Cost Price' placeholder='500' />
              <Input label='Current Stock' placeholder='200' />
              <Input label='Minimum Stock' placeholder='20' />
              <Input label='SKU' placeholder='CRB-219' />
              <Input label='Expiry Date' placeholder='11/09/27' />

              {/* ACTIONS */}
              <div className='col-span-2 flex justify-end gap-3 mt-4'>
                <button
                  type='button'
                  onClick={() => setOpen(false)}
                  className='px-4 py-2 border border-black text-black rounded-lg text-sm'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700'
                >
                  Add Product
                </button>
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
            {Array.from({ length: 12 }).map((_, i) => (
              <tr key={i} className='border-t last:border-b hover:bg-gray-50 '>
                <td className='px-6 py-4 text-gray-600'>CRB-234</td>
                <td className='px-6 py-4 text-gray-600'>Deodorant</td>
                <td className='px-6 py-4 text-gray-600'>Toiletries</td>
                <td className='px-6 py-4 text-gray-600'>2000</td>
                <td className='px-6 py-4 text-gray-600'>2900.00</td>
                <td className='px-6 py-4 flex gap-4'>
                  <button
                    className='text-red-600 hover:text-red-700'
                    onClick={() => setIsDeleting(true)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
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
                    className='text-green-600 hover:text-green-700'
                    onClick={() => setEditOpen(true)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className='lucide lucide-square-pen-icon lucide-square-pen'
                    >
                      <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                      <path d='M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z' />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Reusable Input */
function Input({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <div className='flex flex-col gap-1'>
      <label className={`text-sm font-bold text-black ${montserrat.className}`}>
        {label}
      </label>
      <input
        placeholder={placeholder}
        className='border-black border rounded-lg px-3 py-2 text-sm text-gray-400 outline-none focus:ring-2 focus:ring-blue-500'
      />
    </div>
  );
}
