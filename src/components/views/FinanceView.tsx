/**
 * Financial Dashboard View: "Keuangan"
 * Automatic business summary for revenue, cost structure, estimated profit, and margins.
 * Includes interactive expense percentage sliders that update profit metrics in real-time.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart as PieIcon, 
  Percent, 
  Sliders, 
  Info,
  ShieldCheck,
  Receipt
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const { metrics, expenses, updateExpenses } = useApp();

  const handleSliderChange = (key: keyof typeof expenses, val: number) => {
    updateExpenses({ [key]: val });
  };

  const totalExpensePercent =
    expenses.rawIngredientsPercent +
    expenses.packagingPercent +
    expenses.deliveryLogisticsPercent +
    expenses.operationalOverheadPercent;

  // Breakdown amounts based on total revenue
  const rawCost = Math.round((metrics.totalRevenue * expenses.rawIngredientsPercent) / 100);
  const packagingCost = Math.round((metrics.totalRevenue * expenses.packagingPercent) / 100);
  const deliveryCost = Math.round((metrics.totalRevenue * expenses.deliveryLogisticsPercent) / 100);
  const operationalCost = Math.round((metrics.totalRevenue * expenses.operationalOverheadPercent) / 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-[#ECE5DC] pb-4">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold text-[#241A14] tracking-tight">
            Ringkasan Keuangan Otomatis
          </h1>
          <span className="text-[11px] font-semibold text-[#8E4A35] bg-[#F5ECE8] px-2 py-0.5 rounded border border-[#ECD9D0]">
            Demo Data
          </span>
        </div>
        <p className="text-xs text-[#736A61] mt-1">
          Sistem membantu menghitung dan merangkum transaksi. Data tetap dapat diperiksa oleh tim keuangan/accounting.
        </p>
      </div>

      {/* Accounting Scope Notice Box */}
      <div className="p-4 bg-[#FCF8F2] rounded-2xl border border-[#EADBCC] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#8E4A35] shrink-0 mt-0.5" />
        <div className="text-xs text-[#6B5E53] leading-relaxed">
          <strong className="text-[#26211E]">Catatan Audit & Transparansi: </strong>
          Dashboard ini menghitung proyeksi margin kotor dan laba operasional dari data pesanan aktif. Estimasi ini dirancang untuk mempermudah pengambilan keputusan cepat oleh owner NATA dan bukan pengganti laporan neraca akuntansi perpajakan resmi.
        </div>
      </div>

      {/* Four Primary Financial Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pendapatan (Revenue) */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECE5DC] shadow-xs">
          <div className="text-xs font-semibold text-[#7A7168] flex items-center justify-between">
            <span>Pendapatan (Revenue)</span>
            <TrendingUp className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-[#241A14] font-num mt-2">
            {formatRupiah(metrics.totalRevenue)}
          </div>
          <p className="text-[11px] text-[#2D6A4F] mt-1 font-medium">
            Akumulasi transaksi terkonfirmasi
          </p>
        </div>

        {/* Pengeluaran (Expenses) */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECE5DC] shadow-xs">
          <div className="text-xs font-semibold text-[#7A7168] flex items-center justify-between">
            <span>Total Pengeluaran</span>
            <Receipt className="w-4 h-4 text-[#8E4A35]" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-[#8E4A35] font-num mt-2">
            {formatRupiah(metrics.estimatedCost)}
          </div>
          <p className="text-[11px] text-[#7A7168] mt-1">
            {totalExpensePercent}% dari total omzet
          </p>
        </div>

        {/* Estimasi Profit */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECE5DC] shadow-xs">
          <div className="text-xs font-semibold text-[#7A7168] flex items-center justify-between">
            <span>Estimasi Profit</span>
            <DollarSign className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-[#2D6A4F] font-num mt-2">
            {formatRupiah(metrics.estimatedProfit)}
          </div>
          <p className="text-[11px] text-[#7A7168] mt-1 font-num">
            Laba sebelum pajak
          </p>
        </div>

        {/* Margin */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECE5DC] shadow-xs">
          <div className="text-xs font-semibold text-[#7A7168] flex items-center justify-between">
            <span>Margin Keuntungan</span>
            <Percent className="w-4 h-4 text-[#8E4A35]" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-[#241A14] font-num mt-2">
            {metrics.profitMargin}%
          </div>
          <p className="text-[11px] text-[#2D6A4F] mt-1 font-medium">
            Estimasi berdasarkan data simulasi.
          </p>
        </div>
      </div>

      {/* Apa Yang Mempengaruhi Profit - Requirement 6 */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#F0EAE1]">
          <div>
            <h3 className="text-xs font-bold text-[#241A14] uppercase tracking-wider">
              APA YANG MEMPENGARUHI PROFIT?
            </h3>
            <p className="text-xs text-[#7A7168] mt-0.5">
              Penjelasan faktor pendorong utama performa laba bersih periode ini
            </p>
          </div>
          <span className="text-[11px] text-[#8E4A35] font-medium bg-[#FAF5F2] px-2.5 py-1 rounded-full border border-[#EADBCC]">
            Analisis Komparatif
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
          {/* Revenue */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE5DC]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#26211E]">Revenue</span>
              <span className="text-xs font-bold font-num text-[#2D6A4F] flex items-center gap-0.5">
                ↑ 12%
              </span>
            </div>
            <p className="text-[11px] text-[#695F56] mt-2 leading-relaxed">
              Didorong oleh lonjakan pesanan korporat (Paket Hampers Signature PT ABC & PT Mega Kreasi).
            </p>
          </div>

          {/* Packaging */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE5DC]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#26211E]">Packaging</span>
              <span className="text-xs font-bold font-num text-[#2D6A4F] flex items-center gap-0.5">
                ↓ 4%
              </span>
            </div>
            <p className="text-[11px] text-[#695F56] mt-2 leading-relaxed">
              Efisiensi pengadaan box hampers eksklusif secara grosir menghemat proporsi biaya kemasan.
            </p>
          </div>

          {/* Delivery */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE5DC]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#26211E]">Delivery</span>
              <span className="text-xs font-bold font-num text-[#A8422A] flex items-center gap-0.5">
                ↑ 2%
              </span>
            </div>
            <p className="text-[11px] text-[#695F56] mt-2 leading-relaxed">
              Peningkatan pengiriman luar kota (Bekasi, Depok, Tangerang) sedikit menaikkan porsi logistik khusus kue.
            </p>
          </div>

          {/* Ingredient Cost */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE5DC]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#26211E]">Ingredient Cost</span>
              <span className="text-xs font-bold font-num text-[#A8422A] flex items-center gap-0.5">
                ↑ 3%
              </span>
            </div>
            <p className="text-[11px] text-[#695F56] mt-2 leading-relaxed">
              Penyesuaian harga impor Butter Pure Wijsman & Plum Australia dari supplier premium.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Expense Simulation Controls */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#8E4A35]" />
            <h3 className="text-xs font-bold text-[#241A14] uppercase tracking-tight">
              Simulasi Komponen Biaya (COGS & Biaya Operasional)
            </h3>
          </div>
          <span className="text-xs text-[#7A7168]">
            Geser slider untuk melihat dampak terhadap profit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Slider 1: Bahan Baku */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EADBCC] space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#26211E]">
              <span>Bahan Baku (Butter Wijsman, Kuning Telur, Keju, Tepung)</span>
              <span className="font-num text-[#8E4A35]">{expenses.rawIngredientsPercent}%</span>
            </div>
            <input
              type="range"
              min={25}
              max={60}
              value={expenses.rawIngredientsPercent}
              onChange={(e) => handleSliderChange('rawIngredientsPercent', Number(e.target.value))}
              className="w-full accent-[#8E4A35] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#7A7168]">
              <span>Estimasi Nilai: {formatRupiah(rawCost)}</span>
              <span>Rekomendasi NATA: 38% - 42%</span>
            </div>
          </div>

          {/* Slider 2: Packaging */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EADBCC] space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#26211E]">
              <span>Packaging Box Eksklusif & Pita Emas</span>
              <span className="font-num text-[#8E4A35]">{expenses.packagingPercent}%</span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              value={expenses.packagingPercent}
              onChange={(e) => handleSliderChange('packagingPercent', Number(e.target.value))}
              className="w-full accent-[#8E4A35] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#7A7168]">
              <span>Estimasi Nilai: {formatRupiah(packagingCost)}</span>
              <span>Rekomendasi NATA: 6% - 9%</span>
            </div>
          </div>

          {/* Slider 3: Delivery Logistics */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EADBCC] space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#26211E]">
              <span>Logistik & Kurir Khusus Kue (Jabodetabek)</span>
              <span className="font-num text-[#8E4A35]">{expenses.deliveryLogisticsPercent}%</span>
            </div>
            <input
              type="range"
              min={2}
              max={10}
              value={expenses.deliveryLogisticsPercent}
              onChange={(e) => handleSliderChange('deliveryLogisticsPercent', Number(e.target.value))}
              className="w-full accent-[#8E4A35] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#7A7168]">
              <span>Estimasi Nilai: {formatRupiah(deliveryCost)}</span>
              <span>Ditanggung sebagian ongkir customer</span>
            </div>
          </div>

          {/* Slider 4: Operational Overhead */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EADBCC] space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#26211E]">
              <span>Biaya Operasional Dapur & Utilitas Oven Gas/Listrik</span>
              <span className="font-num text-[#8E4A35]">{expenses.operationalOverheadPercent}%</span>
            </div>
            <input
              type="range"
              min={8}
              max={25}
              value={expenses.operationalOverheadPercent}
              onChange={(e) => handleSliderChange('operationalOverheadPercent', Number(e.target.value))}
              className="w-full accent-[#8E4A35] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#7A7168]">
              <span>Estimasi Nilai: {formatRupiah(operationalCost)}</span>
              <span>Tenaga kerja dan utilitas produksi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
