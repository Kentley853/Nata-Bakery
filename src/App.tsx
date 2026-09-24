/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { SearchModal } from './components/SearchModal';
import { OrderDetailModal } from './components/views/OrderDetailModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { OrdersView } from './components/views/OrdersView';
import { AiReceptionistView } from './components/views/AiReceptionistView';
import { ProductionView } from './components/views/ProductionView';
import { PaymentsView } from './components/views/PaymentsView';
import { FinanceView } from './components/views/FinanceView';
import { SpreadsheetView } from './components/views/SpreadsheetView';
import { InventoryView } from './components/views/InventoryView';
import { CustomersView } from './components/views/CustomersView';
import { SettingsView } from './components/views/SettingsView';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="flex h-screen bg-[#FAF8F5] text-[#26211E] overflow-hidden antialiased">
      {/* Desktop/Tablet Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-24 lg:pb-12">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'orders' && <OrdersView />}
            {currentView === 'ai-receptionist' && <AiReceptionistView />}
            {currentView === 'production' && <ProductionView />}
            {currentView === 'payments' && <PaymentsView />}
            {currentView === 'finance' && <FinanceView />}
            {currentView === 'data' && <SpreadsheetView />}
            {currentView === 'inventory' && <InventoryView />}
            {currentView === 'customers' && <CustomersView />}
            {currentView === 'settings' && <SettingsView />}
          </div>
        </main>

        {/* Mobile Thumb-zone Bottom Navigation Bar */}
        <MobileNav />
      </div>

      {/* Global Interactive Overlays */}
      <OrderDetailModal />
      <SearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
