/**
 * Customer Management View: "Customer"
 * Tracks loyal repeat clients, VIP patrons, corporate accounts,
 * total order history, and lifetime spending value.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { 
  Users2, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  ChevronRight, 
  Building2, 
  Crown, 
  User,
  X
} from 'lucide-react';
import { Customer } from '../../types';

export const CustomersView: React.FC = () => {
  const { customers, orders, setSelectedOrderId } = useApp();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const customerOrders = selectedCustomer 
    ? orders.filter((o) => o.customerId === selectedCustomer.id || o.customerName.toLowerCase().includes(selectedCustomer.name.split(' ')[0].toLowerCase()))
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-[#ECE5DC] pb-4">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold text-[#241A14] tracking-tight">
            Database Customer
          </h1>
          <span className="text-[11px] font-semibold text-[#8E4A35] bg-[#F5ECE8] px-2 py-0.5 rounded border border-[#ECD9D0]">
            Demo Data
          </span>
        </div>
        <p className="text-xs text-[#736A61] mt-1">
          Daftar pelanggan setia NATA Cake and Cookies, riwayat pesanan, dan akumulasi nilai belanja.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Customer Table / List (7 cols or full width) */}
        <div className={`${selectedCustomer ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-2xl border border-[#ECE5DC] overflow-hidden shadow-xs`}>
          <div className="p-4 border-b border-[#F0EAE1] flex items-center justify-between">
            <span className="text-xs font-bold text-[#26211E]">Semua Customer Terdaftar</span>
            <span className="text-xs text-[#7A7168]">{customers.length} Kontak</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#ECE5DC] text-[#7A7168] font-medium">
                <tr>
                  <th className="py-3 px-4">Nama Customer</th>
                  <th className="py-3 px-4">Tipe</th>
                  <th className="py-3 px-4 text-center">Total Pesanan</th>
                  <th className="py-3 px-4 text-right">Total Belanja</th>
                  <th className="py-3 px-4">Pesanan Terakhir</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE4]">
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomerId(c.id)}
                    className={`hover:bg-[#FAF8F5] transition-colors cursor-pointer ${
                      selectedCustomerId === c.id ? 'bg-[#FAF5F2]' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#26211E]">{c.name}</div>
                      <div className="text-[11px] text-[#7A7168] font-num">{c.phone} · {c.city}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          c.type === 'Corporate'
                            ? 'bg-[#EBF3F8] text-[#1E5D87]'
                            : c.type === 'VIP'
                            ? 'bg-[#FAF0E6] text-[#A66D2E]'
                            : 'bg-[#F2ECE4] text-[#695F56]'
                        }`}
                      >
                        {c.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-num font-bold text-[#26211E]">
                      {c.totalOrders}x
                    </td>
                    <td className="py-3.5 px-4 text-right font-num font-bold text-[#26211E] whitespace-nowrap">
                      {formatRupiah(c.totalSpend)}
                    </td>
                    <td className="py-3.5 px-4 text-[#7A7168] font-num whitespace-nowrap">
                      {c.lastOrderDate}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <ChevronRight className="w-4 h-4 text-[#A89D92] mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Customer Profile & History (5 cols) */}
        {selectedCustomer && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#ECE5DC] p-5 shadow-xs space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F5ECE8] flex items-center justify-center text-[#8E4A35] font-bold">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#26211E]">{selectedCustomer.name}</h3>
                  <span className="text-[11px] text-[#8E4A35] font-medium">{selectedCustomer.type} Patron</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomerId(null)}
                className="p-1 rounded text-[#7A7168] hover:bg-[#FAF8F5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#595048]">
                <Phone className="w-3.5 h-3.5 text-[#8E4A35]" />
                <span className="font-num">{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-[#595048]">
                <MapPin className="w-3.5 h-3.5 text-[#8E4A35] shrink-0 mt-0.5" />
                <span>{selectedCustomer.address}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F2ECE4]">
              <div className="p-3 bg-[#FAF8F5] rounded-xl text-center">
                <span className="text-[10px] text-[#7A7168]">Total Orders</span>
                <p className="font-bold text-sm sm:text-base text-[#26211E] font-num mt-0.5">{selectedCustomer.totalOrders}x</p>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xl text-center">
                <span className="text-[10px] text-[#7A7168]">Total Spending</span>
                <p className="font-bold text-xs sm:text-sm text-[#8E4A35] font-num mt-0.5 truncate">{formatRupiah(selectedCustomer.totalSpend)}</p>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xl text-center">
                <span className="text-[10px] text-[#7A7168]">Last Order</span>
                <p className="font-bold text-xs sm:text-xs text-[#26211E] font-num mt-0.5 truncate">{selectedCustomer.lastOrderDate}</p>
              </div>
            </div>

            {/* Favorite Products */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE5DC]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7168]">
                Favorite Products
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {(selectedCustomer.favoriteProducts || ['Lapis Legit Polos', 'Lapis Surabaya Polos']).map((prod, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white text-[#26211E] px-2.5 py-1 rounded-md border border-[#E5DDD2] font-medium"
                  >
                    🍰 {prod}
                  </span>
                ))}
              </div>
            </div>

            {/* INSIGHT Section - Requirement 8 */}
            <div className="p-3.5 bg-[#FAF5F2] rounded-xl border border-[#ECD9CE]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E4A35]">
                  INSIGHT
                </span>
                <span className="text-[10px] text-[#9E9388] italic">Simulasi AI</span>
              </div>
              <p className="text-xs text-[#3D342C] font-medium mt-1 leading-relaxed">
                {selectedCustomer.insight || 'Customer ini memiliki pola repeat order bulanan untuk hampers keluarga.'}
              </p>
            </div>

            {/* PELUANG FOLLOW-UP Section - Requirement 8 */}
            <div className="p-3.5 bg-white rounded-xl border border-[#ECE5DC] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#26211E]">
                  PELUANG FOLLOW-UP
                </span>
                <span className="text-[10px] text-[#2D6A4F] font-semibold bg-[#EAF2ED] px-1.5 py-0.2 rounded">
                  Siap Dikirim
                </span>
              </div>
              <p className="text-xs text-[#524941] leading-relaxed">
                {selectedCustomer.followUpOpportunity || 'Belum melakukan order selama 21 hari. Hubungi untuk penawaran slot oven akhir pekan.'}
              </p>

              <button
                type="button"
                onClick={() => {
                  alert(`[Demo Follow Up] Pesan WhatsApp disiapkan untuk ${selectedCustomer.name}:\n\n"Halo Kak ${selectedCustomer.name}, salam hangat dari NATA Cake and Cookies! Apakah ada rencana kiriman hampers atau cake favorit Kakak untuk akhir pekan ini?"`);
                }}
                className="w-full py-2.5 bg-[#8E4A35] hover:bg-[#723624] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <span>Follow Up via WhatsApp (Simulasi)</span>
              </button>
            </div>

            {/* Order History */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-[#26211E] mb-2 flex items-center justify-between">
                <span>Order History (Riwayat Transaksi)</span>
                <span className="text-[11px] text-[#7A7168]">{customerOrders.length} Ditemukan</span>
              </h4>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {customerOrders.length === 0 ? (
                  <p className="text-xs text-[#9E948B] italic">Tidak ada transaksi tercatat di sesi ini.</p>
                ) : (
                  customerOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className="p-3 bg-[#FCFAF7] rounded-xl border border-[#ECE5DC] hover:border-[#D5C9BA] transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-num font-bold text-[#8E4A35]">{ord.id}</span>
                        <span className="font-num text-[11px] text-[#7A7168]">{ord.orderDate}</span>
                      </div>
                      <p className="text-[#3A332C] mt-1 font-medium truncate">
                        {ord.items.map((i) => `${i.productName} (${i.quantity}x)`).join(', ')}
                      </p>
                      <div className="flex justify-between items-center mt-2 pt-1 border-t border-[#F0EAE1] text-[11px]">
                        <span className="text-[#2D6A4F] font-semibold">{ord.paymentStatus}</span>
                        <span className="font-num font-bold text-[#26211E]">{formatRupiah(ord.total)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
