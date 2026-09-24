/**
 * Production Board View: "Produksi"
 * Visual pipeline for bakery kitchen operations: Pesanan Baru -> Sedang Dibuat -> Siap -> Selesai
 * Live status switching with reactive updates to main dashboard KPIs.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductionStatus } from '../../types';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ChefHat, 
  Calendar,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const ProductionView: React.FC = () => {
  const { orders, updateProductionStatus, setSelectedOrderId, metrics } = useApp();
  const [filterPriority, setFilterPriority] = useState<'All' | 'Prioritas Tinggi'>('All');

  const columns: { status: ProductionStatus; title: string; color: string; desc: string }[] = [
    { status: 'Pesanan Baru', title: 'Pesanan Baru', color: 'border-amber-300 text-amber-900', desc: 'Antrian bahan & jadwal panggang' },
    { status: 'Sedang Dibuat', title: 'Sedang Dibuat', color: 'border-orange-400 text-orange-900', desc: 'Proses layer & pemanggangan oven' },
    { status: 'Siap', title: 'Siap', color: 'border-emerald-400 text-emerald-900', desc: 'Pendinginan, QC & packaging box' },
    { status: 'Selesai', title: 'Selesai', color: 'border-stone-300 text-stone-700', desc: 'Siap dikirim atau sudah terkirim' },
  ];

  const filteredOrders = filterPriority === 'All' 
    ? orders 
    : orders.filter((o) => o.productionPriority === 'Prioritas Tinggi');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#ECE5DC] pb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-[#241A14] tracking-tight">
              Papan Produksi Dapur
            </h1>
            <span className="text-[11px] font-semibold text-[#8E4A35] bg-[#F5ECE8] px-2 py-0.5 rounded border border-[#ECD9D0]">
              {metrics.inProductionCount} Sedang Dibuat
            </span>
          </div>
          <p className="text-xs text-[#736A61] mt-1">
            Manajemen antrian oven, pemanggangan layer per lapis, dan pengemasan pesanan kue NATA.
          </p>
        </div>

        {/* Filter Priority Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#7A7168]">Filter:</span>
          <button
            type="button"
            onClick={() => setFilterPriority(filterPriority === 'All' ? 'Prioritas Tinggi' : 'All')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              filterPriority === 'Prioritas Tinggi'
                ? 'bg-[#8E4A35] text-white border-[#8E4A35]'
                : 'bg-white text-[#4A423B] border-[#D9D1C7] hover:bg-[#FAF8F5]'
            }`}
          >
            {filterPriority === 'Prioritas Tinggi' ? '★ Hanya Prioritas Tinggi' : 'Tampilkan Semua'}
          </button>
        </div>
      </div>

      {/* 4-Column Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colOrders = filteredOrders.filter((o) => o.productionStatus === col.status);

          return (
            <div
              key={col.status}
              className="bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] p-3.5 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="pb-3 border-b border-[#E8E2D9] mb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#26211E] tracking-tight">
                    {col.title}
                  </h3>
                  <span className="text-[11px] font-num font-semibold text-[#8E4A35] bg-white px-2 py-0.5 rounded border border-[#E2DAD0]">
                    {colOrders.length}
                  </span>
                </div>
                <p className="text-[10px] text-[#7A7168] mt-0.5">{col.desc}</p>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colOrders.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-xs text-[#9E948B] italic">
                    Tidak ada pesanan
                  </div>
                ) : (
                  colOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl border border-[#E5DFD6] p-3.5 shadow-2xs hover:border-[#CFC4B5] transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Header Row: ID, Priority */}
                        <div className="flex items-center justify-between gap-1 text-[11px]">
                          <span 
                            onClick={() => setSelectedOrderId(order.id)}
                            className="font-num font-bold text-[#8E4A35] hover:underline cursor-pointer"
                          >
                            {order.id}
                          </span>
                          {order.productionPriority === 'Prioritas Tinggi' && (
                            <span className="text-[10px] font-semibold text-[#A8422A] bg-[#FBF0ED] px-1.5 py-0.2 rounded border border-[#F0D5CD]">
                              Prioritas Tinggi
                            </span>
                          )}
                        </div>

                        {/* Customer */}
                        <p className="text-xs font-semibold text-[#26211E] mt-1">
                          {order.customerName}
                        </p>

                        {/* Products summary */}
                        <div className="mt-2 space-y-1 text-xs text-[#4F463E]">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                              <span className="truncate pr-1">{item.productName}</span>
                              <span className="font-num font-semibold text-[#26211E] shrink-0">
                                × {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Date & Team */}
                        <div className="mt-3 pt-2.5 border-t border-[#F2ECE4] space-y-1 text-[11px] text-[#786E64]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-[#8E4A35]" />
                            <span>Kirim: <strong className="text-[#26211E]">{order.deliveryDate}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ChefHat className="w-3 h-3 text-[#7A7168]" />
                            <span>{order.productionTeam || 'Tim Oven Utama'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Forward Action */}
                      <div className="mt-3 pt-2 flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderId(order.id)}
                          className="text-[11px] text-[#7A7168] hover:text-[#26211E] hover:underline"
                        >
                          Detail
                        </button>

                        {col.status === 'Pesanan Baru' && (
                          <button
                            type="button"
                            onClick={() => updateProductionStatus(order.id, 'Sedang Dibuat')}
                            className="px-2.5 py-1 text-[11px] font-medium text-white bg-[#8E4A35] hover:bg-[#743523] rounded-lg transition-colors flex items-center gap-1"
                          >
                            <span>Mulai Panggang</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {col.status === 'Sedang Dibuat' && (
                          <button
                            type="button"
                            onClick={() => updateProductionStatus(order.id, 'Siap')}
                            className="px-2.5 py-1 text-[11px] font-medium text-white bg-[#2D6A4F] hover:bg-[#22533D] rounded-lg transition-colors flex items-center gap-1"
                          >
                            <span>Selesai Oven</span>
                            <CheckCircle2 className="w-3 h-3" />
                          </button>
                        )}

                        {col.status === 'Siap' && (
                          <button
                            type="button"
                            onClick={() => updateProductionStatus(order.id, 'Selesai')}
                            className="px-2.5 py-1 text-[11px] font-medium text-[#26211E] bg-[#EFEAE2] hover:bg-[#E5DFD6] rounded-lg transition-colors flex items-center gap-1"
                          >
                            <span>Tandai Selesai</span>
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          </button>
                        )}

                        {col.status === 'Selesai' && (
                          <span className="text-[10px] text-[#2D6A4F] font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Tuntas</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
