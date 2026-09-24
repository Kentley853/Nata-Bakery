/**
 * Order Detail Drawer / Modal
 * Displays complete order cycle, customer details, financial breakdown,
 * and allows instant status updates and WhatsApp contact simulation.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MessageSquare, 
  Check, 
  MapPin, 
  Phone, 
  Calendar, 
  Truck, 
  Flame, 
  CreditCard,
  ChefHat,
  Copy,
  ExternalLink
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { DeliveryStatus, PaymentStatus, ProductionStatus } from '../../types';

export const OrderDetailModal: React.FC = () => {
  const { 
    selectedOrderId, 
    setSelectedOrderId, 
    orders, 
    updatePaymentStatus, 
    updateProductionStatus, 
    updateDeliveryStatus 
  } = useApp();

  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showStatusEdit, setShowStatusEdit] = useState(false);
  const [showWhatsAppDraft, setShowWhatsAppDraft] = useState(false);

  const order = orders.find((o) => o.id === selectedOrderId);
  if (!order) return null;

  const copyPhoneNumber = () => {
    navigator.clipboard?.writeText(order.customerPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const whatsAppTemplate = `Halo Kak ${order.customerName},\nTerima kasih telah memesan di NATA Cake and Cookies.\nDetail pesanan ${order.id}:\n- Produk: ${order.items.map(i => `${i.productName} (${i.quantity}x)`).join(', ')}\n- Pengiriman: ${order.deliveryDate} ke ${order.deliveryCity}\n- Total: ${formatRupiah(order.total)}\nStatus saat ini: ${order.paymentStatus === 'Lunas' ? 'Lunas & Dalam Antrian Dapur' : 'Menunggu Konfirmasi Pembayaran'}.\nAda yang perlu kami tambahkan, Kak?`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8E2D9] max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EAE1] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg text-[#2B1810]">
              Detail Pesanan
            </span>
            <span className="font-num text-xs font-semibold px-2 py-0.5 bg-white text-[#8E4A35] border border-[#E2DAD0] rounded">
              {order.id}
            </span>
            {order.aiDrafted && (
              <span className="text-[10px] bg-[#EAF2ED] text-[#2D6A4F] px-2 py-0.5 rounded font-medium border border-[#D5E5DA]">
                AI Verified
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSelectedOrderId(null)}
            className="p-1.5 rounded-lg text-[#786F66] hover:bg-white hover:text-[#26211E] transition-colors"
            aria-label="Tutup detail pesanan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Visual Order Journey Timeline - Requirement 5 */}
          <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#ECE5DC]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0EAE1]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#26211E]">
                Alur Perjalanan Pesanan
              </span>
              <span className="text-[11px] text-[#7A7067]">
                Status otomatis ter-update
              </span>
            </div>

            {/* Stepper with ✓, ●, ○ */}
            {(() => {
              // Calculate status for each of the 6 steps
              const steps = [
                {
                  id: 'incoming',
                  label: 'Pesan Masuk',
                  state: 'completed' as const, // ✓
                },
                {
                  id: 'drafted',
                  label: 'Order Dibuat',
                  state: 'completed' as const, // ✓
                },
                {
                  id: 'confirmed',
                  label: 'Dikonfirmasi',
                  state: 'completed' as const, // ✓
                },
                {
                  id: 'production',
                  label: 'Produksi',
                  state: (order.productionStatus === 'Selesai'
                    ? 'completed'
                    : order.productionStatus === 'Sedang Dibuat'
                    ? 'current'
                    : 'upcoming') as 'completed' | 'current' | 'upcoming',
                },
                {
                  id: 'payment',
                  label: 'Pembayaran',
                  state: (order.paymentStatus === 'Lunas'
                    ? 'completed'
                    : order.paymentStatus === 'Menunggu Konfirmasi'
                    ? 'current'
                    : 'upcoming') as 'completed' | 'current' | 'upcoming',
                },
                {
                  id: 'delivery',
                  label: 'Pengiriman',
                  state: (order.deliveryStatus === 'Tiba di Tujuan'
                    ? 'completed'
                    : order.deliveryStatus === 'Dalam Pengiriman'
                    ? 'current'
                    : 'upcoming') as 'completed' | 'current' | 'upcoming',
                },
              ];

              return (
                <div className="grid grid-cols-6 gap-1 text-center relative">
                  {steps.map((st, i) => {
                    const isCompleted = st.state === 'completed';
                    const isCurrent = st.state === 'current';

                    return (
                      <div key={st.id} className="flex flex-col items-center relative">
                        {/* Connecting Line */}
                        {i < steps.length - 1 && (
                          <div
                            className={`hidden sm:block absolute top-3.5 left-1/2 w-full h-0.5 -z-0 ${
                              isCompleted ? 'bg-[#2D6A4F]' : 'bg-[#E5DFD7]'
                            }`}
                          />
                        )}

                        {/* Step Node symbol: ✓, ●, ○ */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors ${
                            isCompleted
                              ? 'bg-[#2D6A4F] text-white shadow-xs'
                              : isCurrent
                              ? 'bg-[#8E4A35] text-white ring-4 ring-[#F5ECE8] shadow-xs'
                              : 'bg-white text-[#9E9388] border border-[#D5CABE]'
                          }`}
                        >
                          {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                        </div>

                        {/* Step Label */}
                        <div className="mt-2 text-[10px] sm:text-[11px] font-semibold text-[#26211E] leading-tight">
                          {st.label}
                        </div>
                        <div className="text-[9px] text-[#7A7067] hidden sm:block mt-0.5">
                          {isCompleted ? 'Selesai' : isCurrent ? 'Berjalan' : 'Menunggu'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Quick Lifecycle Status Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#ECE5DC]">
            {/* Payment Status */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#7C7167]">
                <CreditCard className="w-3.5 h-3.5 text-[#8E4A35]" />
                <span>Pembayaran</span>
              </div>
              <p className="text-xs font-semibold text-[#26211E] mt-1">{order.paymentStatus}</p>
              <p className="text-[11px] text-[#7C7167] font-num">{order.paymentMethod}</p>
            </div>

            {/* Production Status */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#7C7167]">
                <Flame className="w-3.5 h-3.5 text-[#8E4A35]" />
                <span>Produksi Dapur</span>
              </div>
              <p className="text-xs font-semibold text-[#26211E] mt-1">{order.productionStatus}</p>
              <p className="text-[11px] text-[#7C7167]">{order.productionTeam || 'Antrian Oven'}</p>
            </div>

            {/* Delivery Status */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#7C7167]">
                <Truck className="w-3.5 h-3.5 text-[#8E4A35]" />
                <span>Pengiriman</span>
              </div>
              <p className="text-xs font-semibold text-[#26211E] mt-1">{order.deliveryStatus}</p>
              <p className="text-[11px] text-[#7C7167]">{order.deliveryCity}</p>
            </div>
          </div>

          {/* Customer & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-[#ECE5DC] bg-white">
              <span className="text-[11px] font-semibold text-[#8C8176] uppercase tracking-wider">
                Informasi Customer
              </span>
              <h4 className="text-sm font-semibold text-[#26211E] mt-1">{order.customerName}</h4>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-[#524941]">
                <Phone className="w-3.5 h-3.5 text-[#8E4A35]" />
                <span className="font-num">{order.customerPhone}</span>
                <button
                  type="button"
                  onClick={copyPhoneNumber}
                  className="text-[10px] text-[#8E4A35] hover:underline flex items-center gap-0.5 ml-1"
                >
                  <Copy className="w-3 h-3" />
                  {copiedPhone ? 'Tersalin' : 'Salin'}
                </button>
              </div>
              <div className="text-[11px] text-[#7A7168] mt-1">
                Sumber Order: <span className="font-medium text-[#26211E]">{order.source}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#ECE5DC] bg-white">
              <span className="text-[11px] font-semibold text-[#8C8176] uppercase tracking-wider">
                Jadwal & Tujuan Pengiriman
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[#26211E] font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#8E4A35]" />
                <span>Kirim: {order.deliveryDate}</span>
                <span className="text-[#8C8176] text-[11px]">(Pesan: {order.orderDate})</span>
              </div>
              <div className="flex items-start gap-1.5 mt-2 text-xs text-[#524941]">
                <MapPin className="w-3.5 h-3.5 text-[#8E4A35] shrink-0 mt-0.5" />
                <span className="leading-snug">{order.deliveryAddress}</span>
              </div>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="border border-[#ECE5DC] rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-[#FAF8F5] border-b border-[#ECE5DC] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#26211E]">Item Pesanan</span>
              <span className="text-[11px] text-[#7A7168]">{order.items.length} Macam Produk</span>
            </div>
            <div className="divide-y divide-[#F2ECE4]">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#26211E]">{item.productName}</p>
                    <p className="text-[11px] text-[#7A7168] font-num">
                      {item.quantity} × {formatRupiah(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-semibold font-num text-[#26211E]">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="p-3.5 bg-[#FAF8F5] border-t border-[#ECE5DC] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#635A52]">
                <span>Subtotal Produk</span>
                <span className="font-num">{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#635A52]">
                <span>Biaya Pengiriman ({order.deliveryCity})</span>
                <span className="font-num">{formatRupiah(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#26211E] pt-2 border-t border-[#ECE5DC]">
                <span>Total Pembayaran</span>
                <span className="font-num text-[#8E4A35]">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE5DC] text-xs">
              <span className="font-semibold text-[#26211E]">Catatan Pesanan:</span>
              <p className="text-[#5C534B] mt-0.5 leading-relaxed">{order.notes}</p>
            </div>
          )}

          {/* WhatsApp Message Draft Dialog */}
          {showWhatsAppDraft && (
            <div className="p-4 bg-[#F2F8F4] rounded-xl border border-[#CDE3D5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F5438]">
                  Draft Pesan WhatsApp untuk Customer
                </span>
                <button
                  type="button"
                  onClick={() => setShowWhatsAppDraft(false)}
                  className="text-xs text-[#2D6A4F] hover:underline"
                >
                  Tutup
                </button>
              </div>
              <textarea
                readOnly
                value={whatsAppTemplate}
                rows={5}
                className="w-full p-2.5 bg-white rounded-lg border border-[#BCD9C7] text-xs font-mono text-[#26211E] focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(whatsAppTemplate);
                    alert('Draft pesan WhatsApp telah disalin ke clipboard!');
                  }}
                  className="px-3 py-1.5 bg-[#2D6A4F] text-white rounded-lg text-xs font-medium hover:bg-[#22533D] flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Salin Teks WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* Status Change Controls Accordion */}
          {showStatusEdit && (
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E2DAD0] space-y-3">
              <h5 className="text-xs font-bold text-[#26211E]">Ubah Status Pesanan</h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Payment Status Dropdown */}
                <div>
                  <label className="block text-[11px] font-medium text-[#6B6158] mb-1">
                    Status Pembayaran
                  </label>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => updatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                    className="w-full p-2 bg-white rounded-lg border border-[#D9D1C7] text-xs font-medium text-[#26211E] focus:outline-none"
                  >
                    <option value="Belum Dibayar">Belum Dibayar</option>
                    <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                    <option value="Lunas">Lunas</option>
                  </select>
                </div>

                {/* Production Status Dropdown */}
                <div>
                  <label className="block text-[11px] font-medium text-[#6B6158] mb-1">
                    Status Produksi
                  </label>
                  <select
                    value={order.productionStatus}
                    onChange={(e) => updateProductionStatus(order.id, e.target.value as ProductionStatus)}
                    className="w-full p-2 bg-white rounded-lg border border-[#D9D1C7] text-xs font-medium text-[#26211E] focus:outline-none"
                  >
                    <option value="Pesanan Baru">Pesanan Baru</option>
                    <option value="Sedang Dibuat">Sedang Dibuat</option>
                    <option value="Siap">Siap</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                {/* Delivery Status Dropdown */}
                <div>
                  <label className="block text-[11px] font-medium text-[#6B6158] mb-1">
                    Status Pengiriman
                  </label>
                  <select
                    value={order.deliveryStatus}
                    onChange={(e) => updateDeliveryStatus(order.id, e.target.value as DeliveryStatus)}
                    className="w-full p-2 bg-white rounded-lg border border-[#D9D1C7] text-xs font-medium text-[#26211E] focus:outline-none"
                  >
                    <option value="Menunggu Jadwal">Menunggu Jadwal</option>
                    <option value="Siap Dikirim">Siap Dikirim</option>
                    <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                    <option value="Tiba di Tujuan">Tiba di Tujuan</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#F0EAE1] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowStatusEdit(!showStatusEdit)}
              className="px-3 py-2 bg-white border border-[#D9D1C7] hover:bg-[#F2ECE4] rounded-lg text-xs font-medium text-[#38312A] transition-colors"
            >
              {showStatusEdit ? 'Tutup Pilihan Status' : 'Ubah Status'}
            </button>
            <button
              type="button"
              onClick={() => setShowWhatsAppDraft(!showWhatsAppDraft)}
              className="px-3 py-2 bg-[#2D6A4F] text-white hover:bg-[#22533D] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Hubungi Customer</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {order.paymentStatus !== 'Lunas' && (
              <button
                type="button"
                onClick={() => updatePaymentStatus(order.id, 'Lunas')}
                className="px-3 py-2 bg-[#8E4A35] hover:bg-[#743523] text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Konfirmasi Lunas</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedOrderId(null)}
              className="px-4 py-2 bg-white border border-[#D9D1C7] text-[#5C534B] hover:text-[#26211E] rounded-lg text-xs font-medium"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
