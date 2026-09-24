/**
 * Google Sheets Style Data Spreadsheet View: "Data"
 * Displays tabular operational ledger with live searching, multi-column sorting,
 * calculated item-level profit margins, and instant CSV export.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { exportOrdersToCsv, formatRupiah } from '../../utils/formatters';
import { 
  Download, 
  Search, 
  ArrowUpDown, 
  Table, 
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Order } from '../../types';

export const SpreadsheetView: React.FC = () => {
  const { orders, expenses, setSelectedOrderId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Order | 'profit'>('id');
  const [sortAsc, setSortAsc] = useState(true);

  // Compute expenses percent
  const totalCostPercent =
    expenses.rawIngredientsPercent +
    expenses.packagingPercent +
    expenses.deliveryLogisticsPercent +
    expenses.operationalOverheadPercent;

  // Filter
  const filtered = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.items.some((i) => i.productName.toLowerCase().includes(q)) ||
      o.paymentStatus.toLowerCase().includes(q) ||
      o.productionStatus.toLowerCase().includes(q)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'profit') {
      const profitA = a.total * (1 - totalCostPercent / 100);
      const profitB = b.total * (1 - totalCostPercent / 100);
      return sortAsc ? profitA - profitB : profitB - profitA;
    }

    const valA = a[sortField as keyof Order] ?? '';
    const valB = b[sortField as keyof Order] ?? '';

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleSort = (field: keyof Order | 'profit') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#ECE5DC] pb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-[#241A14] tracking-tight">
              Data Sheet Transaksi
            </h1>
            <span className="text-[11px] font-semibold text-[#8E4A35] bg-[#F5ECE8] px-2 py-0.5 rounded border border-[#ECD9D0]">
              Spreadsheet View
            </span>
          </div>
          <p className="text-xs text-[#736A61] mt-1">
            Format lembar kerja terstruktur untuk audit operasional harian, revenue, dan estimasi laba.
          </p>
        </div>

        {/* Export CSV Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportOrdersToCsv(sorted)}
            className="px-3.5 py-2 bg-[#2D6A4F] hover:bg-[#22533D] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Control Bar */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] p-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#9E948B] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari order, nama, produk, atau status..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E2DAD0] text-[#26211E] placeholder:text-[#A0958B] focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-[#7A7168]">
          <span>Menampilkan <strong className="text-[#26211E]">{sorted.length}</strong> baris</span>
          <span className="text-[#D9D1C7]">|</span>
          <span className="text-[11px] text-[#8C827A]">
            Klik judul kolom untuk mengurutkan (sort)
          </span>
        </div>
      </div>

      {/* High-Density Spreadsheet Table */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE5DC] text-[#695F56] font-semibold sticky top-0 select-none">
              <tr>
                <th 
                  onClick={() => handleSort('id')} 
                  className="py-3 px-3.5 border-r border-[#EFEAE2] cursor-pointer hover:bg-[#F2ECE4] whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Order ID</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9E948B]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('orderDate')} 
                  className="py-3 px-3.5 border-r border-[#EFEAE2] cursor-pointer hover:bg-[#F2ECE4] whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Tanggal</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9E948B]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('customerName')} 
                  className="py-3 px-3.5 border-r border-[#EFEAE2] cursor-pointer hover:bg-[#F2ECE4] whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Customer</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9E948B]" />
                  </div>
                </th>
                <th className="py-3 px-3.5 border-r border-[#EFEAE2]">Produk</th>
                <th className="py-3 px-3.5 border-r border-[#EFEAE2] text-center">Qty</th>
                <th 
                  onClick={() => handleSort('total')} 
                  className="py-3 px-3.5 border-r border-[#EFEAE2] text-right cursor-pointer hover:bg-[#F2ECE4] whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Revenue</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9E948B]" />
                  </div>
                </th>
                <th className="py-3 px-3.5 border-r border-[#EFEAE2] text-right whitespace-nowrap">
                  Expense ({totalCostPercent}%)
                </th>
                <th 
                  onClick={() => handleSort('profit')} 
                  className="py-3 px-3.5 border-r border-[#EFEAE2] text-right cursor-pointer hover:bg-[#F2ECE4] whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Est. Profit</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9E948B]" />
                  </div>
                </th>
                <th className="py-3 px-3.5 border-r border-[#EFEAE2] whitespace-nowrap">Payment</th>
                <th className="py-3 px-3.5 border-r border-[#EFEAE2] whitespace-nowrap">Production</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4] font-num">
              {sorted.map((o) => {
                const totalQty = o.items.reduce((sum, i) => sum + i.quantity, 0);
                const expenseAmt = Math.round((o.total * totalCostPercent) / 100);
                const profitAmt = o.total - expenseAmt;

                return (
                  <tr 
                    key={o.id} 
                    onClick={() => setSelectedOrderId(o.id)}
                    className="hover:bg-[#FCFAF7] transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3.5 border-r border-[#F5EFE8] font-bold text-[#8E4A35] group-hover:underline">
                      {o.id}
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-[#F5EFE8] text-[#7A7168] whitespace-nowrap">
                      {o.orderDate.replace(' 2026', '')}
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-[#F5EFE8] font-sans font-medium text-[#26211E]">
                      {o.customerName}
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-[#F5EFE8] font-sans text-[#4A423B] max-w-xs truncate">
                      {o.items.map((i) => i.productName).join(', ')}
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-[#F5EFE8] text-center font-bold text-[#26211E]">
                      {totalQty}
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-[#F5EFE8] text-right font-bold text-[#26211E] whitespace-nowrap">
                      {formatRupiah(o.total)}
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-[#F5EFE8] text-right text-[#8E4A35] whitespace-nowrap">
                      {formatRupiah(expenseAmt)}
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-[#F5EFE8] text-right font-bold text-[#2D6A4F] whitespace-nowrap">
                      {formatRupiah(profitAmt)}
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-[#F5EFE8] font-sans whitespace-nowrap">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        o.paymentStatus === 'Lunas' ? 'bg-[#EAF2ED] text-[#2D6A4F]' : 'bg-[#FDF0ED] text-[#A8422A]'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-[#F5EFE8] font-sans text-[11px] text-[#4A423B] whitespace-nowrap">
                      {o.productionStatus}
                    </td>
                    <td className="py-2.5 px-3.5 font-sans text-[11px] text-[#4A423B] whitespace-nowrap">
                      {o.deliveryStatus} ({o.deliveryCity})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
