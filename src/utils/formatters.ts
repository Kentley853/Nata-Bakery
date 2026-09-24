/**
 * Formatting and Helper Utilities
 */

import { Order } from '../types';

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value);
};

export const exportOrdersToCsv = (orders: Order[]) => {
  const headers = [
    'Order ID',
    'Tanggal Pesan',
    'Customer',
    'No Telepon',
    'Produk & Qty',
    'Kota Pengiriman',
    'Biaya Pengiriman',
    'Subtotal',
    'Total',
    'Status Pembayaran',
    'Metode Pembayaran',
    'Status Produksi',
    'Tim Produksi',
    'Status Pengiriman',
    'Catatan',
  ];

  const rows = orders.map((o) => {
    const productsSummary = o.items.map((i) => `${i.productName} (${i.quantity}x)`).join('; ');
    return [
      `"${o.id}"`,
      `"${o.orderDate}"`,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${productsSummary}"`,
      `"${o.deliveryCity}"`,
      o.deliveryFee,
      o.subtotal,
      o.total,
      `"${o.paymentStatus}"`,
      `"${o.paymentMethod}"`,
      `"${o.productionStatus}"`,
      `"${o.productionTeam || '-'}"`,
      `"${o.deliveryStatus}"`,
      `"${(o.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `NATA_Data_Pesanan_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
