/**
 * NATA Business Command Center - Data Models
 * Demonstration system by Droppfloww Systems for NATA Cake and Cookies
 * 
 * Note on Future Architecture:
 * In production, these TypeScript interfaces map directly to database schemas
 * (e.g., PostgreSQL / Supabase or Cloud SQL) accessed via REST/GraphQL API,
 * synchronized via n8n automation pipelines with WhatsApp Business API and Google Sheets.
 */

export type OrderStatus = 'Menunggu Pembayaran' | 'Diproses' | 'Siap Produksi' | 'Sedang Dibuat' | 'Siap Dikirim' | 'Selesai' | 'Dibatalkan';
export type PaymentStatus = 'Belum Dibayar' | 'Menunggu Konfirmasi' | 'Lunas';
export type ProductionStatus = 'Pesanan Baru' | 'Sedang Dibuat' | 'Siap' | 'Selesai';
export type DeliveryStatus = 'Menunggu Jadwal' | 'Siap Dikirim' | 'Dalam Pengiriman' | 'Tiba di Tujuan';

export interface Product {
  id: string;
  name: string;
  category: 'Lapis Legit' | 'Lapis Surabaya' | 'Bolu Gulung' | 'Hampers & Special';
  price: number;
  estimatedCost: number; // For demo profit calculations
  leadDays: number;
  popular?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
  type: 'Regular' | 'VIP' | 'Corporate';
  favoriteProducts?: string[];
  insight?: string;
  followUpOpportunity?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string; // e.g. "NATA-001"
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryFee: number;
  orderDate: string; // "24 Sep 2026"
  deliveryDate: string; // "26 Sep 2026"
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: 'Transfer BCA' | 'Transfer Mandiri' | 'QRIS' | 'Cash on Pick-up';
  paymentProofUrl?: string;
  productionStatus: ProductionStatus;
  productionTeam?: string; // e.g. "Tim Oven A", "Tim Layer B"
  productionPriority: 'Normal' | 'Prioritas Tinggi';
  deliveryStatus: DeliveryStatus;
  notes?: string;
  source: 'WhatsApp' | 'Phone' | 'Email' | 'Walk-in';
  aiDrafted?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Bahan Baku' | 'Topping & Isi' | 'Packaging';
  currentStock: number;
  unit: string;
  status: 'Aman' | 'Menipis' | 'Kritis';
  minStock: number;
  lastRestocked: string;
  estimatedDaysRemaining?: number;
  upcomingOrdersRequiring?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'production' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export interface ExpenseBreakdown {
  rawIngredientsPercent: number; // e.g. 40%
  packagingPercent: number; // e.g. 7%
  deliveryLogisticsPercent: number; // e.g. 4%
  operationalOverheadPercent: number; // e.g. 14%
}

export interface OwnerAlertPreferences {
  newOrder: boolean;         // Pesanan: Pesanan baru
  unpaidOrder: boolean;      // Pembayaran: Pembayaran belum masuk
  delayedProduction: boolean;// Produksi: Produksi terlambat
  lowStock: boolean;         // Stok: Stok menipis
  importantCustomer: boolean;// Customer: Customer penting
  dailyRevenueSummary: boolean; // Keuangan: Ringkasan penjualan
}
