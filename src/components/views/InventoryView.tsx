/**
 * Inventory View: "Stok"
 * Raw materials and luxury packaging inventory tracking for NATA Cake and Cookies.
 * Clearly marked as Demo Data with simple status indicators and restock actions.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  Package, 
  Scale
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, restockItem } = useApp();
  const [selectedItemToRestock, setSelectedItemToRestock] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);

  const handleRestockSubmit = (itemId: string) => {
    restockItem(itemId, restockAmount);
    setSelectedItemToRestock(null);
    setRestockAmount(10);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#ECE5DC] pb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-[#241A14] tracking-tight">
              Stok Bahan Baku & Packaging
            </h1>
            <span className="text-[11px] font-semibold text-[#8E4A35] bg-[#F5ECE8] px-2 py-0.5 rounded border border-[#ECD9D0]">
              Demo Data
            </span>
          </div>
          <p className="text-xs text-[#736A61] mt-1">
            Pantau persediaan bahan utama seperti Butter Wijsman, telur, coklat couverture, dan kotak hampers eksklusif.
          </p>
        </div>

        {/* Disclaimer Tag */}
        <div className="text-[11px] text-[#8C827A] italic">
          Data simulasi stok untuk demonstrasi kapasitas operasional
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#ECE5DC] shadow-xs">
          <span className="text-xs font-semibold text-[#7A7168]">Total Item Terpantau</span>
          <div className="text-2xl font-bold text-[#26211E] font-num mt-1">{inventory.length} Item</div>
          <p className="text-[10px] text-[#7A7168] mt-0.5">Bahan baku & packaging box</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#ECE5DC] shadow-xs">
          <span className="text-xs font-semibold text-[#8E4A35]">Perlu Pengadaan (Menipis)</span>
          <div className="text-2xl font-bold text-[#8E4A35] font-num mt-1">
            {inventory.filter((i) => i.status !== 'Aman').length} Item
          </div>
          <p className="text-[10px] text-[#7A7168] mt-0.5">Butter Wijsman & Packaging Box</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#ECE5DC] shadow-xs">
          <span className="text-xs font-semibold text-[#2D6A4F]">Stok Aman</span>
          <div className="text-2xl font-bold text-[#2D6A4F] font-num mt-1">
            {inventory.filter((i) => i.status === 'Aman').length} Item
          </div>
          <p className="text-[10px] text-[#7A7168] mt-0.5">Mencukupi produksi 4 hari ke depan</p>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => {
          const isWarning = item.status === 'Menipis' || item.status === 'Kritis';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#ECE5DC] p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9E9388]">
                    {item.category}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      item.status === 'Aman'
                        ? 'bg-[#EAF2ED] text-[#2D6A4F]'
                        : 'bg-[#FDF0ED] text-[#A8422A]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#26211E] mt-2 leading-snug">
                  {item.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#26211E] font-num">
                    {item.currentStock}
                  </span>
                  <span className="text-xs text-[#7A7168] font-medium">{item.unit}</span>
                </div>

                {/* Predictive Status Box - Requirement 7 */}
                <div className="mt-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE5DC] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7A7168]">Status:</span>
                    <span className={`font-semibold ${item.status === 'Aman' ? 'text-[#2D6A4F]' : 'text-[#8E4A35]'}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7A7168]">Estimated remaining:</span>
                    <span className="font-num font-bold text-[#26211E]">
                      {item.estimatedDaysRemaining !== undefined ? `${item.estimatedDaysRemaining} hari` : '4.5 hari'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#F0EAE1]">
                    <span className="text-[#7A7168]">Upcoming orders requiring:</span>
                    <span className="font-num font-bold text-[#8E4A35]">
                      {item.upcomingOrdersRequiring !== undefined ? `${item.upcomingOrdersRequiring} pesanan` : '5 pesanan'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-[#7A7168] flex items-center justify-between">
                  <span>Batas Minimum: {item.minStock} {item.unit}</span>
                  <span>Restock: {item.lastRestocked}</span>
                </div>
              </div>

              {/* Action Button: Catat Restock */}
              <div className="mt-4 pt-3 border-t border-[#F2ECE4]">
                {selectedItemToRestock === item.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={restockAmount}
                      onChange={(e) => setRestockAmount(Number(e.target.value))}
                      className="w-20 p-2 text-xs border border-[#D9D1C7] rounded-lg bg-[#FAF8F5] font-num"
                    />
                    <button
                      type="button"
                      onClick={() => handleRestockSubmit(item.id)}
                      className="px-3 py-2 bg-[#8E4A35] text-white rounded-lg text-xs font-semibold hover:bg-[#723624] cursor-pointer"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedItemToRestock(null)}
                      className="px-2 py-2 text-xs text-[#7A7168] hover:text-[#26211E] cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedItemToRestock(item.id)}
                    className="w-full py-2.5 bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#E2DAD0] rounded-xl text-xs font-semibold text-[#4A423B] transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                  >
                    <Plus className="w-4 h-4 text-[#8E4A35]" />
                    <span>Catat Restock</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
