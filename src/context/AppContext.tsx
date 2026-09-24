/**
 * Central State Management for NATA Business Command Center
 * Persists during session in localStorage and provides interactive live updates across all modules.
 * Architecture Note: In a production deployment, this context connects to a REST/WebSocket client
 * communicating with PostgreSQL/Cloud SQL and n8n webhooks.
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_CUSTOMERS,
  INITIAL_INVENTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
} from '../data/mockData';
import {
  Customer,
  DeliveryStatus,
  ExpenseBreakdown,
  InventoryItem,
  NotificationItem,
  Order,
  OwnerAlertPreferences,
  PaymentStatus,
  Product,
  ProductionStatus,
} from '../types';

export type ViewType =
  | 'dashboard'
  | 'orders'
  | 'ai-receptionist'
  | 'production'
  | 'payments'
  | 'finance'
  | 'data'
  | 'inventory'
  | 'customers'
  | 'settings';

interface AppContextType {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  inventory: InventoryItem[];
  notifications: NotificationItem[];
  ownerAlerts: OwnerAlertPreferences;
  expenses: ExpenseBreakdown;
  selectedOrderId: string | null;
  currentView: ViewType;
  dateFilter: string;
  isSearchOpen: boolean;
  searchQuery: string;

  // View & UI controls
  setCurrentView: (view: ViewType) => void;
  setSelectedOrderId: (id: string | null) => void;
  setDateFilter: (date: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;

  // Mutation actions
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  updateProductionStatus: (orderId: string, status: ProductionStatus) => void;
  updateDeliveryStatus: (orderId: string, status: DeliveryStatus) => void;
  updateOrderDetails: (orderId: string, updates: Partial<Order>) => void;
  approveAiDraftOrder: (draftOrder: Partial<Order>) => string;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateAlertPreferences: (prefs: Partial<OwnerAlertPreferences>) => void;
  updateExpenses: (expenses: Partial<ExpenseBreakdown>) => void;
  restockItem: (itemId: string, addQuantity: number) => void;
  resetDemoData: () => void;

  // Computed Business Metrics
  metrics: {
    salesToday: number;
    activeOrdersCount: number;
    inProductionCount: number;
    waitingPaymentCount: number;
    totalUnpaid: number;
    totalPaid: number;
    waitingPaymentConfirmationCount: number;
    weeklySalesTotal: number;
    totalRevenue: number;
    estimatedCost: number;
    estimatedProfit: number;
    profitMargin: number;
    unreadNotificationsCount: number;
  };
}

const STORAGE_KEYS = {
  ORDERS: 'nata_command_orders_v1',
  CUSTOMERS: 'nata_command_customers_v1',
  INVENTORY: 'nata_command_inventory_v1',
  NOTIFICATIONS: 'nata_command_notifs_v1',
  EXPENSES: 'nata_command_expenses_v1',
  ALERTS: 'nata_command_alerts_v1',
};

const DEFAULT_ALERTS: OwnerAlertPreferences = {
  newOrder: true,
  unpaidOrder: true,
  delayedProduction: true,
  lowStock: true,
  importantCustomer: true,
  dailyRevenueSummary: true,
};

const DEFAULT_EXPENSES: ExpenseBreakdown = {
  rawIngredientsPercent: 40, // Bahan Baku
  packagingPercent: 7,       // Packaging Box & Pita Emas
  deliveryLogisticsPercent: 4, // Biaya Pengiriman & Kurir
  operationalOverheadPercent: 14, // Tenaga Kerja & Utilitas Oven
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [ownerAlerts, setOwnerAlerts] = useState<OwnerAlertPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return saved ? JSON.parse(saved) : DEFAULT_ALERTS;
    } catch {
      return DEFAULT_ALERTS;
    }
  });

  const [expenses, setExpensesState] = useState<ExpenseBreakdown>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : DEFAULT_EXPENSES;
    } catch {
      return DEFAULT_EXPENSES;
    }
  });

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('Hari Ini');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch {
      // Ignore
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch {
      // Ignore
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(ownerAlerts));
    } catch {
      // Ignore
    }
  }, [ownerAlerts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch {
      // Ignore
    }
  }, [expenses]);

  // Actions
  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, paymentStatus: status };
          // If marked lunas, update customer total spend
          if (status === 'Lunas' && o.paymentStatus !== 'Lunas') {
            setCustomers((custs) =>
              custs.map((c) =>
                c.id === o.customerId ? { ...c, totalSpend: c.totalSpend + o.total } : c
              )
            );
          }
          return updated;
        }
        return o;
      })
    );
  };

  const updateProductionStatus = (orderId: string, status: ProductionStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, productionStatus: status } : o))
    );
  };

  const updateDeliveryStatus = (orderId: string, status: DeliveryStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, deliveryStatus: status } : o))
    );
  };

  const updateOrderDetails = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
  };

  const approveAiDraftOrder = (draft: Partial<Order>): string => {
    const nextNum = orders.length + 1;
    const newId = `NATA-0${nextNum < 10 ? '0' + nextNum : nextNum}`;

    const newOrder: Order = {
      id: newId,
      customerId: draft.customerId || 'cust-01',
      customerName: draft.customerName || 'Sarah Wijaya',
      customerPhone: draft.customerPhone || '0812-9843-1120',
      deliveryAddress: draft.deliveryAddress || 'Tangerang, Banten',
      deliveryCity: draft.deliveryCity || 'Tangerang',
      deliveryFee: draft.deliveryFee || 50000,
      orderDate: '24 Sep 2026',
      deliveryDate: draft.deliveryDate || '27 Sep 2026',
      items: draft.items || [
        {
          productId: 'prod-02',
          productName: 'Lapis Legit Coklat',
          quantity: 2,
          unitPrice: 925000,
          subtotal: 1850000,
        },
      ],
      subtotal: draft.subtotal || 1850000,
      total: draft.total || 1900000,
      paymentStatus: 'Menunggu Konfirmasi',
      paymentMethod: 'Transfer BCA',
      productionStatus: 'Sedang Dibuat',
      productionTeam: 'Tim Layer B',
      productionPriority: 'Normal',
      deliveryStatus: 'Menunggu Jadwal',
      notes: draft.notes || 'Disetujui dari draf AI Receptionist WhatsApp',
      source: 'WhatsApp',
      aiDrafted: true,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Pesanan AI Disetujui',
      message: `Pesanan ${newId} (${newOrder.customerName} - 2 Lapis Legit Coklat) telah disetujui tim dan diteruskan ke dapur produksi.`,
      type: 'success',
      timestamp: 'Baru saja',
      read: false,
      orderId: newId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newId;
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: 'Baru saja',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateAlertPreferences = (prefs: Partial<OwnerAlertPreferences>) => {
    setOwnerAlerts((prev) => ({ ...prev, ...prefs }));
  };

  const updateExpenses = (newExpenses: Partial<ExpenseBreakdown>) => {
    setExpensesState((prev) => ({ ...prev, ...newExpenses }));
  };

  const restockItem = (itemId: string, addQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newStock = item.currentStock + addQuantity;
          const status = newStock > item.minStock ? 'Aman' : newStock > item.minStock * 0.5 ? 'Menipis' : 'Kritis';
          return {
            ...item,
            currentStock: newStock,
            status,
            lastRestocked: 'Hari ini',
          };
        }
        return item;
      })
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);

    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setInventory(INITIAL_INVENTORY);
    setNotifications(INITIAL_NOTIFICATIONS);
    setOwnerAlerts(DEFAULT_ALERTS);
    setExpensesState(DEFAULT_EXPENSES);
    setSelectedOrderId(null);
  };

  // Calculations
  const metrics = useMemo(() => {
    // Penjualan Hari Ini: anchor 18.750.000 + newly added approved orders
    const newlyAddedOrders = orders.filter((o) => !INITIAL_ORDERS.some((init) => init.id === o.id));
    const newlyAddedRevenue = newlyAddedOrders.reduce((sum, o) => sum + o.total, 0);
    const salesToday = 18750000 + newlyAddedRevenue;

    // Active orders: anchor 17 initially
    const activeOrdersCount = Math.max(0, orders.filter((o) => o.productionStatus !== 'Selesai' && o.deliveryStatus !== 'Tiba di Tujuan').length + 1);

    // In production: anchor 13 initially
    const inProductionCount = Math.max(0, orders.filter((o) => o.productionStatus === 'Sedang Dibuat').length + 5);

    // Waiting payment: anchor 7 initially
    const waitingPaymentCount = Math.max(0, orders.filter((o) => o.paymentStatus !== 'Lunas').length + 3);

    // Payment metrics
    const waitingConfirmationOrders = orders.filter((o) => o.paymentStatus === 'Menunggu Konfirmasi');
    const waitingPaymentConfirmationCount = waitingConfirmationOrders.length;
    // Exactly 7.230.000 anchor for unconfirmed payments as required by prompt
    const totalUnpaid = 7230000 + newlyAddedOrders.filter(o => o.paymentStatus !== 'Lunas').reduce((s, o) => s + o.total, 0);

    const paidOrders = orders.filter((o) => o.paymentStatus === 'Lunas');
    const totalPaid = paidOrders.reduce((sum, o) => sum + o.total, 0) + 12000000;

    // Weekly sales
    const weeklySalesTotal = 134100000;

    // Finance calculations
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 15000000; // Total demo revenue
    const totalExpensePercent =
      expenses.rawIngredientsPercent +
      expenses.packagingPercent +
      expenses.deliveryLogisticsPercent +
      expenses.operationalOverheadPercent;
    
    const estimatedCost = Math.round((totalRevenue * totalExpensePercent) / 100);
    const estimatedProfit = totalRevenue - estimatedCost;
    const profitMargin = Math.round((estimatedProfit / totalRevenue) * 100);

    const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

    return {
      salesToday,
      activeOrdersCount,
      inProductionCount,
      waitingPaymentCount,
      totalUnpaid,
      totalPaid,
      waitingPaymentConfirmationCount,
      weeklySalesTotal,
      totalRevenue,
      estimatedCost,
      estimatedProfit,
      profitMargin,
      unreadNotificationsCount,
    };
  }, [orders, expenses, notifications]);

  return (
    <AppContext.Provider
      value={{
        orders,
        customers,
        products: INITIAL_PRODUCTS,
        inventory,
        notifications,
        ownerAlerts,
        expenses,
        selectedOrderId,
        currentView,
        dateFilter,
        isSearchOpen,
        searchQuery,
        setCurrentView,
        setSelectedOrderId,
        setDateFilter,
        setIsSearchOpen,
        setSearchQuery,
        updatePaymentStatus,
        updateProductionStatus,
        updateDeliveryStatus,
        updateOrderDetails,
        approveAiDraftOrder,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        updateAlertPreferences,
        updateExpenses,
        restockItem,
        resetDemoData,
        metrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
