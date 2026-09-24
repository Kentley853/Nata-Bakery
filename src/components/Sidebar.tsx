/**
 * Clean Desktop & Tablet Sidebar Navigation
 * Follows zero-pill discipline and domain-native bakery aesthetic
 */

import React from 'react';
import { useApp, ViewType } from '../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Bot,
  Flame,
  CreditCard,
  PieChart,
  TableProperties,
  Boxes,
  Users2,
  BellRing,
  GitBranch,
} from 'lucide-react';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, metrics, orders } = useApp();

  const operasionalItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Ringkasan Bisnis',
      icon: LayoutDashboard,
    },
    {
      id: 'orders',
      label: 'Pesanan',
      icon: ShoppingBag,
      badge: metrics.activeOrdersCount,
    },
    {
      id: 'production',
      label: 'Produksi',
      icon: Flame,
      badge: metrics.inProductionCount,
    },
    {
      id: 'ai-receptionist',
      label: 'AI Receptionist',
      icon: Bot,
      badge: 'Draft 1',
    },
  ];

  const bisnisItems: NavItem[] = [
    {
      id: 'finance',
      label: 'Keuangan',
      icon: PieChart,
    },
    {
      id: 'customers',
      label: 'Customer',
      icon: Users2,
    },
    {
      id: 'inventory',
      label: 'Stok',
      icon: Boxes,
      badge: '2 Menipis',
    },
  ];

  const dataItems: NavItem[] = [
    {
      id: 'data',
      label: 'Data & Laporan',
      icon: TableProperties,
    },
  ];

  const pengaturanItems: NavItem[] = [
    {
      id: 'settings',
      label: 'Notifikasi Owner',
      icon: BellRing,
    },
  ];

  const renderNavSection = (title: string, items: NavItem[]) => (
    <div className="py-2">
      <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A0958B]">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-[#F5ECE8] text-[#782E1C] font-semibold'
                  : 'text-[#4A423B] hover:bg-[#FAF8F5] hover:text-[#26211E]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#8E4A35]' : 'text-[#857B72]'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-num px-1.5 py-0.2 rounded ${
                    isActive
                      ? 'bg-white text-[#782E1C] font-semibold'
                      : typeof item.badge === 'string' && item.badge.includes('Menipis')
                      ? 'bg-[#FDF0ED] text-[#A8422A] font-medium'
                      : 'bg-[#F2ECE4] text-[#695F56]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E8E2D9] h-screen sticky top-0 shrink-0">
      {/* Brand Lockup */}
      <div className="p-5 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#8E4A35] flex items-center justify-center text-white font-serif font-bold text-base shadow-xs">
            N
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-tight text-[#2B1810]">
              NATA Cake & Cookies
            </h1>
            <p className="text-[11px] text-[#7A7067]">Command Center</p>
          </div>
        </div>
      </div>

      {/* Nav List grouped into 4 sections */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto divide-y divide-[#F4EFEA]">
        {renderNavSection('OPERASIONAL', operasionalItems)}
        {renderNavSection('BISNIS', bisnisItems)}
        {renderNavSection('DATA', dataItems)}
        {renderNavSection('PENGATURAN', pengaturanItems)}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#F0EAE1] bg-[#FAF8F5]/80">
        <div className="flex items-center gap-2 text-[11px] text-[#7C7167]">
          <GitBranch className="w-3.5 h-3.5 text-[#8E4A35]" />
          <span>Automation n8n · Demo Mode</span>
        </div>
        <p className="text-[10px] text-[#9E9388] mt-1">
          Droppfloww Systems · natacake.com
        </p>
      </div>
    </aside>
  );
};
