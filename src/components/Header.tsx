/**
 * Top Bar Header Contract:
 * Zone 1: Single brand title wordmark
 * Zone 2: Navigation & Search
 * Zone 3: Actions (Notifications, Date Filter, Reset)
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Search, 
  RotateCcw, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  PackageCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    dateFilter, 
    setDateFilter, 
    setIsSearchOpen, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    metrics,
    resetDemoData,
    setSelectedOrderId
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Zone 1: Brand & Demo Marker */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg md:text-xl font-bold tracking-tight text-[#2B1810]">
              NATA
            </span>
            <span className="hidden sm:inline text-xs font-medium text-[#7C6E65]">
              Command Center
            </span>
            <span className="text-[11px] font-medium text-[#8E4A35] bg-[#F5EBE6] px-2 py-0.5 rounded border border-[#ECD9D0] whitespace-nowrap">
              Demo Data
            </span>
          </div>
          <span className="text-[11px] text-[#8C827A] hidden md:block truncate">
            Droppfloww Systems · NATA Cake and Cookies
          </span>
        </div>
      </div>

      {/* Zone 2: Global Search Trigger */}
      <div className="flex-1 max-w-md mx-2 hidden sm:block">
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-white rounded-lg border border-[#E2DAD0] text-[#7A7169] text-xs hover:border-[#C4B9AC] hover:text-[#26211E] transition-all shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#9E948B]" />
            <span>Cari order, customer, produk...</span>
          </div>
          <kbd className="hidden lg:inline text-[10px] text-[#A69C92] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8E2D9]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="sm:hidden p-2 text-[#635A52] hover:text-[#26211E] rounded-lg hover:bg-white"
          title="Cari"
          aria-label="Cari data"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Date Filter Selector */}
        <div className="relative hidden md:flex items-center">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E2DAD0] rounded-lg text-xs font-medium text-[#38312A] shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#8E4A35]" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-[#38312A] focus:outline-none cursor-pointer pr-1"
            >
              <option value="Hari Ini">Hari Ini (24 Sep)</option>
              <option value="Kemarin">Kemarin (23 Sep)</option>
              <option value="7 Hari Terakhir">7 Hari Terakhir</option>
              <option value="Bulan Ini">Bulan Ini (September)</option>
            </select>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-[#635A52] hover:text-[#26211E] hover:bg-white border border-transparent hover:border-[#E2DAD0] transition-colors"
            title="Notifikasi"
            aria-label="Buka notifikasi"
          >
            <Bell className="w-4 h-4" />
            {metrics.unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8E4A35] rounded-full ring-2 ring-[#FAF8F5]" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-[#E8E2D9] py-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between px-4 pb-2.5 border-b border-[#F0EAE1]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#26211E]">Notifikasi</span>
                  {metrics.unreadNotificationsCount > 0 && (
                    <span className="text-[11px] text-[#8E4A35] font-medium bg-[#FBF0EC] px-1.5 py-0.5 rounded">
                      {metrics.unreadNotificationsCount} baru
                    </span>
                  )}
                </div>
                {metrics.unreadNotificationsCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#8E4A35] hover:underline cursor-pointer"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#F5EFE8]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.orderId) {
                        setSelectedOrderId(n.orderId);
                        setShowNotifMenu(false);
                      }
                    }}
                    className={`p-3.5 text-left transition-colors cursor-pointer hover:bg-[#FAF8F5] ${
                      !n.read ? 'bg-[#FCFAF7]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'order' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                        {n.type === 'payment' && <Clock className="w-3.5 h-3.5 text-amber-700" />}
                        {n.type === 'production' && <PackageCheck className="w-3.5 h-3.5 text-stone-700" />}
                        {n.type === 'alert' && <AlertTriangle className="w-3.5 h-3.5 text-[#8E4A35]" />}
                        {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-medium text-[#26211E] truncate">{n.title}</p>
                          <span className="text-[10px] text-[#9E948B] shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#635A52] mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Data */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="p-2 text-[#7C6E65] hover:text-[#8E4A35] hover:bg-white rounded-lg border border-transparent hover:border-[#E2DAD0] transition-colors"
            title="Reset Demo Data"
            aria-label="Reset demo data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {showResetConfirm && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#E8E2D9] p-3.5 z-50">
              <p className="text-xs font-semibold text-[#26211E]">Reset Data Simulasi?</p>
              <p className="text-[11px] text-[#6E645C] mt-1 leading-normal">
                Mengembalikan pesanan, status produksi, dan pembayaran ke nilai awal demo.
              </p>
              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2.5 py-1 text-xs text-[#635A52] hover:bg-[#F5EFE8] rounded"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetDemoData();
                    setShowResetConfirm(false);
                  }}
                  className="px-2.5 py-1 text-xs text-white bg-[#8E4A35] hover:bg-[#723624] rounded font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
