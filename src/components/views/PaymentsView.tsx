/**
 * Payments Management View: "Pembayaran"
 * Shows cash flow settlement status, payment method breakdown,
 * and allows 1-click payment verification.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { PaymentStatus } from '../../types';
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  ArrowUpRight,
  Filter,
  Check
} from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const { orders, updatePaymentStatus, setSelectedOrderId, metrics } = useApp();
  const [filterTab, setFilterTab] = useState<'All' | PaymentStatus>('All');

  const filteredOrders = filterTab === 'All' 
    ? orders 
    : orders.filter((o) => o.paymentStatus === filterTab);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-[#ECE5DC] pb-4">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold text-[#241A14] tracking-tight">
            Status Pembayaran
          </h1>
          <span className="text-[11px] font-semibold text-[#8E4A35] bg-[#F5ECE8] px-2 py-0.5 rounded border border-[#ECD9D0]">
            Demo Data
          </span>
        </div>
        <p className="text-xs text-[#736A61] mt-1">
          Pantau transfer bank BCA, Mandiri, dan QRIS dari pesanan cake dan hampers NATA.
        </p>
      </div>

      {/* 3 Large KPI Cards as requested */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Belum Dibayar */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECE5DC] shadow-xs">
          <div className="flex items-center justify-between text-[#8E4A35]">
            <span className="text-xs font-semibold">Total Belum Dibayar</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-[#8E4A35] font-num mt-2">
            {formatRupiah(metrics.totalUnpaid)}
          </div>
          <p className="text-[11px] text-[#7A7168] mt-1">
            {metrics.waitingPaymentCount} pesanan menunggu pelunasan
          </p>
        </div>

        {/* Sudah Dibayar */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECE5DC] shadow-xs">
          <div className="flex items-center justify-between text-[#2D6A4F]">
            <span className="text-xs font-semibold">Sudah Dibayar</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-[#2D6A4F] font-num mt-2">
            {formatRupiah(metrics.totalPaid)}
          </div>
          <p className="text-[11px] text-[#7A7168] mt-1">
            Dana masuk terverifikasi
          </p>
        </div>

        {/* Menunggu Konfirmasi */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECE5DC] shadow-xs">
          <div className="flex items-center justify-between text-[#9E631E]">
            <span className="text-xs font-semibold">Menunggu Konfirmasi</span>
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-[#9E631E] font-num mt-2">
            {metrics.waitingPaymentConfirmationCount || 3}
          </div>
          <p className="text-[11px] text-[#7A7168] mt-1">
            Bukti transfer diunggah via WA
          </p>
        </div>
      </div>

      {/* Table & Tabs */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] overflow-hidden shadow-xs">
        {/* Segmented Filter Bar */}
        <div className="p-4 border-b border-[#F0EAE1] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#F2ECE4] rounded-lg">
            {(['All', 'Menunggu Konfirmasi', 'Belum Dibayar', 'Lunas'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterTab === tab
                    ? 'bg-white text-[#26211E] shadow-xs'
                    : 'text-[#695F56] hover:text-[#26211E]'
                }`}
              >
                {tab === 'All' ? 'Semua Status' : tab}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#7A7168]">
            Menampilkan {filteredOrders.length} transaksi
          </span>
        </div>

        {/* Payment Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE5DC] text-[#7A7168] font-medium">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Metode</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Aksi Simulasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#26211E]">{o.customerName}</p>
                    <p className="text-[11px] text-[#7A7168] font-num">{o.customerPhone}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => setSelectedOrderId(o.id)}
                      className="font-num font-bold text-[#8E4A35] hover:underline cursor-pointer"
                    >
                      {o.id}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-[#595048]">
                    {o.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4 text-[#7A7168] font-num whitespace-nowrap">
                    {o.orderDate}
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
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {o.paymentStatus !== 'Lunas' ? (
                      <button
                        type="button"
                        onClick={() => updatePaymentStatus(o.id, 'Lunas')}
                        className="px-2.5 py-1 bg-[#8E4A35] hover:bg-[#743523] text-white rounded text-[11px] font-medium transition-colors"
                      >
                        Tandai Lunas
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => updatePaymentStatus(o.id, 'Menunggu Konfirmasi')}
                        className="text-[11px] text-[#7A7168] hover:text-[#8E4A35] hover:underline"
                      >
                        Reset Status
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
