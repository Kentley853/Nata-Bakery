/**
 * Complete Orders Management View: "Pesanan"
 * Lists all orders with filters, source badges, status controls, and detail view triggers.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Flame, 
  Truck,
  Plus
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrdersView: React.FC = () => {
  const { orders, setSelectedOrderId, setCurrentView } = useApp();
  const [statusFilter, setStatusFilter] = useState<'All' | string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      statusFilter === 'All' ||
      o.productionStatus === statusFilter ||
      o.paymentStatus === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.deliveryCity.toLowerCase().includes(q) ||
      o.items.some((i) => i.productName.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#ECE5DC] pb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-[#241A14] tracking-tight">
              Daftar Pesanan
            </h1>
            <span className="text-[11px] font-semibold text-[#8E4A35] bg-[#F5ECE8] px-2 py-0.5 rounded border border-[#ECD9D0]">
              {orders.length} Total
            </span>
          </div>
          <p className="text-xs text-[#736A61] mt-1">
            Pantau seluruh siklus pesanan dari penerimaan WhatsApp, pembayaran, hingga pengiriman.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('ai-receptionist')}
          className="px-3.5 py-2 bg-[#8E4A35] hover:bg-[#723624] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Lihat Draf AI Receptionist</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] p-3.5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#9E948B] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari order ID, customer, produk..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] rounded-lg border border-[#E2DAD0] text-[#26211E] placeholder:text-[#A0958B] focus:outline-none focus:bg-white"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'All', label: 'Semua' },
            { id: 'Sedang Dibuat', label: 'Sedang Dibuat' },
            { id: 'Pesanan Baru', label: 'Pesanan Baru' },
            { id: 'Menunggu Konfirmasi', label: 'Menunggu Konfirmasi' },
            { id: 'Lunas', label: 'Lunas' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#8E4A35] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#595048] hover:bg-[#F2ECE4]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE5DC] text-[#7A7168] font-medium">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Produk Pesanan</th>
                <th className="py-3 px-4">Tanggal Kirim</th>
                <th className="py-3 px-4">Kota Tujuan</th>
                <th className="py-3 px-4">Status Produksi</th>
                <th className="py-3 px-4">Pembayaran</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#9E948B]">
                    Tidak ada pesanan yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelectedOrderId(o.id)}
                    className="hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-num font-bold text-[#8E4A35] group-hover:underline whitespace-nowrap">
                      {o.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#26211E]">{o.customerName}</p>
                      <p className="text-[11px] text-[#7A7168] font-num">{o.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#4A423B] max-w-xs truncate">
                      {o.items.map((i) => `${i.productName} (${i.quantity}x)`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-[#7A7168] font-num whitespace-nowrap">
                      {o.deliveryDate}
                    </td>
                    <td className="py-3.5 px-4 text-[#595048] whitespace-nowrap">
                      {o.deliveryCity}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-[#26211E]">
                        {o.productionStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          o.paymentStatus === 'Lunas'
                            ? 'bg-[#EAF2ED] text-[#2D6A4F]'
                            : o.paymentStatus === 'Menunggu Konfirmasi'
                            ? 'bg-[#FCF5EB] text-[#9E631E]'
                            : 'bg-[#FDF0ED] text-[#A8422A]'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-num font-bold text-[#26211E] whitespace-nowrap">
                      {formatRupiah(o.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
