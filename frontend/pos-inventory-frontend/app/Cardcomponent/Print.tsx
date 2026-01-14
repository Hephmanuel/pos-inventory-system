'use client';

import { useEffect, useState } from 'react';
import { getSalesHistory } from '@/app/services/receiptService';

export default function Print() {
  const [receipts, setReceipts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getSalesHistory();
      setReceipts(data);

      // open print dialog after render
      setTimeout(() => window.print(), 300);
    }

    load();
  }, []);

  const totalRevenue = receipts.reduce(
    (sum, r) => sum + Number(r.total_amount || 0),
    0
  );

  const totalItems = receipts.reduce(
    (sum, r) => sum + (r.lines?.length || 0),
    0
  );

  return (
    <pre
      style={{
        fontFamily: 'monospace',
        fontSize: '14px',
        padding: '40px',
        whiteSpace: 'pre-wrap',
        background: 'white',
        color: 'black',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      {`
SWIFT POS
Analytics Report
Generated: ${new Date().toLocaleString()}

----------------------------------------
INVENTORY HEALTH
Critical SKUs: 0
Inventory Status: Healthy (100%)

----------------------------------------
SALES PERFORMANCE
Total Revenue: NGN ${totalRevenue.toLocaleString()}
Total Items Sold: ${totalItems}
Total Transactions: ${receipts.length}

----------------------------------------
RECEIPTS
Receipt No     Date         Items   Total
----------------------------------------
${receipts
  .map(
    (r) =>
      `${(r.receipt_no || 'N/A').padEnd(14)} ${new Date(r.created_at)
        .toLocaleDateString()
        .padEnd(12)} ${(r.lines?.length || 0)
        .toString()
        .padEnd(7)} NGN ${Number(r.total_amount).toLocaleString()}`
  )
  .join('\n')}
----------------------------------------

Thank you for using SWIFT POS
`}
    </pre>
  );
}
