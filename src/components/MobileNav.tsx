/**
 * Mobile Navigation Bar (Bottom Tab Bar)
 * Built with thumb-zone ergonomic principles, 44px min hitboxes,
 * and compact drawer for additional views.
 */

import React, { useState } from 'react';
import { useApp, ViewType } from '../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Bot,
  Flame,
  Menu,
  X,
  CreditCard,
  PieChart,
  TableProperties,
  Boxes,
  Users2,
  BellRing,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, metrics, orders } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard' as ViewType, label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'orders' as ViewType, label: 'Pesanan', icon: ShoppingBag, badge: orders.length },
    { id: 'ai-receptionist' as ViewType, label: 'AI Chat', icon: Bot, badge: 1 },
    { id: 'production' as ViewType, label: 'Produksi', icon: Flame, badge: metrics.inProductionCount },
  ];

  const drawerTabs = [
    { id: 'payments' as ViewType, label: 'Pembayaran', icon: CreditCard, count: metrics.waitingPaymentCount },
    { id: 'finance' as ViewType, label: 'Keuangan & Profit', icon: PieChart },
    { id: 'data' as ViewType, label: 'Spreadsheet Data', icon: TableProperties },
    { id: 'inventory' as ViewType, label: 'Stok Bahan & Box', icon: Boxes },
    { id: 'customers' as ViewType, label: 'Database Customer', icon: Users2 },
    { id: 'settings' as ViewType, label: 'Notifikasi Owner & n8n', icon: BellRing },
  ];

  return (
    <>
      {/* Slide-up Drawer Overlay */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Slide-up Drawer */}
      <div
        className={`fixed bottom-16 left-0 right-0 z-50 lg:hidden bg-white rounded-t-2xl shadow-xl border-t border-[#E8E2D9] p-4 transition-transform duration-200 ${
          drawerOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <div className="w-10 h-1 bg-[#D9D1C7] rounded-full mx-auto mb-3" />
        <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
          <span className="text-xs font-bold text-[#2B1810]">Menu Operasional & Analisis</span>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-1 text-[#786F66] hover:text-[#26211E]"
            aria-label="Tutup menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {drawerTabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentView === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setCurrentView(t.id);
                  setDrawerOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-left text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F5ECE8] text-[#782E1C]'
                    : 'bg-[#FAF8F5] text-[#4A423B] hover:bg-[#F2ECE4]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-[#8E4A35]" />
                <span className="truncate">{t.label}</span>
                {t.count !== undefined && t.count > 0 && (
                  <span className="ml-auto text-[10px] bg-[#8E4A35] text-white px-1.5 py-0.2 rounded-full">
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D9] h-16 px-2 flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setCurrentView(tab.id);
                setDrawerOpen(false);
              }}
              className={`flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors relative ${
                isActive ? 'text-[#8E4A35]' : 'text-[#7A7168] hover:text-[#26211E]'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 text-[9px] font-bold bg-[#8E4A35] text-white px-1 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-1">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Drawer Button */}
        <button
          type="button"
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors ${
            drawerOpen ? 'text-[#8E4A35]' : 'text-[#7A7168] hover:text-[#26211E]'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Menu</span>
        </button>
      </div>
    </>
  );
};
