/**
 * Settings & Automation View: "Notifikasi Owner" & "Automation"
 * Allows toggle configuration of owner alert triggers, displays future
 * architecture readiness for n8n pipelines, and data reset.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BellRing, 
  GitBranch, 
  Check, 
  RotateCcw, 
  Database, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Server,
  Smartphone
} from 'lucide-react';
import { OwnerAlertPreferences } from '../../types';

export const SettingsView: React.FC = () => {
  const { ownerAlerts, updateAlertPreferences, resetDemoData, addNotification } = useApp();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [simulatedTestSuccess, setSimulatedTestSuccess] = useState(false);

  const toggleAlert = (key: keyof OwnerAlertPreferences) => {
    updateAlertPreferences({ [key]: !ownerAlerts[key] });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestNotification = () => {
    addNotification({
      type: 'payment',
      title: 'Tes Notifikasi Simulasi: Pembayaran Belum Masuk',
      message: 'Simulasi alert WhatsApp: Pesanan NATA-006 (Rp 6.230.000) belum ada bukti transfer.',
      orderId: 'NATA-006',
    });
    setSimulatedTestSuccess(true);
    setTimeout(() => setSimulatedTestSuccess(false), 3000);
  };

  const categories = [
    {
      category: 'Pesanan',
      key: 'newOrder' as keyof OwnerAlertPreferences,
      title: 'Pesanan Baru Masuk',
      desc: 'Notifikasi instan saat draf pesanan AI disetujui atau order baru masuk via WhatsApp.',
    },
    {
      category: 'Pembayaran',
      key: 'unpaidOrder' as keyof OwnerAlertPreferences,
      title: 'Pembayaran Belum Masuk',
      desc: 'Peringatan otomatis untuk pesanan yang belum mengirimkan bukti transfer sebelum jadwal oven.',
    },
    {
      category: 'Produksi',
      key: 'delayedProduction' as keyof OwnerAlertPreferences,
      title: 'Produksi Terlambat',
      desc: 'Pemberitahuan jika antrian oven dan peracikan loyang melampaui estimasi waktu.',
    },
    {
      category: 'Stok',
      key: 'lowStock' as keyof OwnerAlertPreferences,
      title: 'Stok Menipis',
      desc: 'Alert otomatis saat bahan baku utama (seperti Wijsman, coklat couverture) atau kemasan menipis.',
    },
    {
      category: 'Customer',
      key: 'importantCustomer' as keyof OwnerAlertPreferences,
      title: 'Customer Penting',
      desc: 'Alert khusus saat pelanggan VIP atau pesanan korporat bernilai tinggi melakukan order.',
    },
    {
      category: 'Keuangan',
      key: 'dailyRevenueSummary' as keyof OwnerAlertPreferences,
      title: 'Ringkasan Penjualan',
      desc: 'Rekap omzet, total kue terjual, dan proyeksi margin laba yang dikirim sore hari.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-[#ECE5DC] pb-4">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold text-[#241A14] tracking-tight">
            Notifikasi Owner
          </h1>
          <span className="text-[11px] font-semibold text-[#8E4A35] bg-[#F5ECE8] px-2 py-0.5 rounded border border-[#ECD9D0]">
            Pusat Alert
          </span>
        </div>
        <p className="text-xs text-[#736A61] mt-1">
          Owner dapat menerima informasi penting tanpa harus membuka dashboard.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 bg-[#FCF8F2] rounded-2xl border border-[#EADBCC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <BellRing className="w-4 h-4 text-[#8E4A35] shrink-0 mt-0.5" />
          <div className="text-xs text-[#5C5045]">
            <p className="font-bold text-[#26211E]">
              Owner dapat menerima informasi penting tanpa harus membuka dashboard.
            </p>
            <p className="text-[#786E64] mt-0.5">
              Notifikasi disimulasikan secara lokal pada sistem demo ini untuk menggambarkan alur WhatsApp gateway yang sebenarnya.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTestNotification}
          className="px-3.5 py-2 bg-[#8E4A35] hover:bg-[#723624] text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-colors shadow-2xs"
        >
          {simulatedTestSuccess ? '✓ Notifikasi Terkirim!' : 'Kirim Tes Simulasi'}
        </button>
      </div>

      {/* Owner Alerts Section by 6 Categories */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
          <div>
            <h3 className="text-xs font-bold text-[#241A14] uppercase tracking-tight flex items-center gap-2">
              <BellRing className="w-4 h-4 text-[#8E4A35]" />
              <span>Kategori Notifikasi Pilihan Owner</span>
            </h3>
            <p className="text-xs text-[#7A7168] mt-0.5">
              Pilih pemicu alert yang ingin Anda aktifkan
            </p>
          </div>
          {savedSuccess && (
            <span className="text-xs text-[#2D6A4F] font-semibold flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Tersimpan</span>
            </span>
          )}
        </div>

        <div className="divide-y divide-[#F2ECE4] mt-2">
          {categories.map((opt) => (
            <div key={opt.key} className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E4A35] bg-[#F5ECE8] px-2 py-0.2 rounded border border-[#ECD9CE]">
                    {opt.category}
                  </span>
                  <p className="text-xs font-bold text-[#26211E]">{opt.title}</p>
                </div>
                <p className="text-[11px] text-[#786E64] mt-1 leading-relaxed">{opt.desc}</p>
              </div>

              {/* Checkbox / Toggle */}
              <button
                type="button"
                onClick={() => toggleAlert(opt.key)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  ownerAlerts[opt.key] ? 'bg-[#8E4A35]' : 'bg-[#D9D1C7]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    ownerAlerts[opt.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Architecture (n8n Integration Preview) */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#8E4A35]" />
            <h3 className="text-xs font-bold text-[#241A14] uppercase tracking-tight">
              Automation & Integrasi Alur Kerja (Workflow Engine)
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#7A7168] bg-[#F2ECE4] px-2 py-0.5 rounded">
            Status: Demo Mode
          </span>
        </div>

        <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EADBCC] text-xs text-[#5C5147] leading-relaxed">
          Pada implementasi nyata, workflow automation dapat menggunakan <strong>n8n</strong> atau platform automation lainnya untuk menghubungkan WhatsApp, database, Google Sheets, email, dan notifikasi.
        </div>

        {/* Visual Architecture Diagram */}
        <div className="p-5 bg-white rounded-xl border border-[#ECE5DC]">
          <div className="text-[11px] font-semibold text-[#786E64] mb-3 uppercase tracking-wider">
            Rancangan Integrasi Produksi
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-center text-xs">
            <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#ECE5DC]">
              <Smartphone className="w-5 h-5 mx-auto text-[#075E54] mb-1" />
              <strong className="block text-[#26211E]">WhatsApp Customer</strong>
              <span className="text-[10px] text-[#7A7168]">Inbound order & tanya kue</span>
            </div>

            <ArrowRight className="w-4 h-4 mx-auto text-[#A89D92] hidden sm:block" />

            <div className="p-3 bg-[#F5ECE8] rounded-lg border border-[#ECD9D0]">
              <GitBranch className="w-5 h-5 mx-auto text-[#8E4A35] mb-1" />
              <strong className="block text-[#8E4A35]">n8n Automation Engine</strong>
              <span className="text-[10px] text-[#7A7168]">AI Parser & Webhook sync</span>
            </div>

            <ArrowRight className="w-4 h-4 mx-auto text-[#A89D92] hidden sm:block" />

            <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#ECE5DC]">
              <Database className="w-5 h-5 mx-auto text-[#2D6A4F] mb-1" />
              <strong className="block text-[#26211E]">NATA Command Center</strong>
              <span className="text-[10px] text-[#7A7168]">Database & Dashboard Owner</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Demo Data Card */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-[#26211E]">Reset Data Simulasi</h4>
          <p className="text-[11px] text-[#786E64] mt-0.5">
            Kembalikan seluruh data pesanan, pembayaran, dan stok ke data bawaan awal demo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="px-4 py-2 bg-white border border-[#D9D1C7] hover:border-[#8E4A35] text-[#8E4A35] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white p-5 rounded-2xl max-w-sm w-full border border-[#E8E2D9] shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-[#26211E]">Konfirmasi Reset Demo Data</h3>
            <p className="text-xs text-[#6E645C] leading-relaxed">
              Tindakan ini akan mengembalikan seluruh transaksi demo ke pengaturan awal katalog publik NATA Cake and Cookies.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-3 py-1.5 text-xs text-[#595048] hover:bg-[#FAF8F5] rounded"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setShowResetModal(false);
                }}
                className="px-3 py-1.5 text-xs text-white bg-[#8E4A35] hover:bg-[#723624] font-semibold rounded"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
