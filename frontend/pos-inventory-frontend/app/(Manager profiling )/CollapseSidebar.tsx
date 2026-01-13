'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStaffProfile } from '@/app/(Manager profiling )/useStaffProfile';

export default function Sidebar() {
  const user = useStaffProfile();
  const [open, setOpen] = useState(true);

  return (
    <motion.aside
      animate={{ width: open ? 260 : 80 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className='h-screen bg-linear-to-b from-blue-500 via-blue-600 to-blue-700 text-white shadow-xl flex flex-col justify-between overflow-hidden'
    >
      {/* Top */}
      <div>
        {/* Toggle */}
        <div className='p-4 flex justify-end'>
          <button
            onClick={() => setOpen(!open)}
            className='w-10 h-10 rounded-full bg-linear-to-br from-blue-300 to-blue-700 flex items-center justify-center shadow-lg'
          >
            <motion.svg
              animate={{ rotate: open ? 0 : 180 }}
              transition={{ duration: 0.3 }}
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              fill='none'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M15 18l-6-6 6-6' />
            </motion.svg>
          </button>
        </div>

        {/* Profile */}
        {open && user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='px-4 flex items-center gap-3 mt-4'
          >
            <div className='w-10 h-10 rounded-full bg-white/30 flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                fill='none'
                stroke='white'
                strokeWidth='2'
              >
                <circle cx='12' cy='8' r='4' />
                <path d='M20 21a8 8 0 0 0-16 0' />
              </svg>
            </div>

            <div>
              <p className='font-bold'>
                {user.first_name} {user.last_name}
              </p>
              <p className='text-sm text-white/70 capitalize'>{user.role}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Date */}
      {open && (
        <div className='p-4 text-xs text-white/60'>
          {new Date().toDateString()}
        </div>
      )}
    </motion.aside>
  );
}
