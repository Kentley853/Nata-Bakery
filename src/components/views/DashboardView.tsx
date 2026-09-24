/**
 * NATA Business Command Center - Dashboard View: "Ringkasan Bisnis"
 * Designed specifically for the bakery owner:
 * 10-second glance clarity:
 * - 4 large prominent KPIs
 * - "PERLU PERHATIAN" actionable alerts
 * - "AKTIVITAS HARI INI" dynamic chronological timeline
 * - "BAGAIMANA SISTEM BEKERJA" interactive connected flow diagram
 * - "PENJUALAN" 7-day trend
 * - "PESANAN HARI INI" (cards on mobile, clean table on desktop)
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { WEEKLY_SALES_DATA } from '../../data/mockData';
import { 
  ShoppingBag, 
  Flame, 
  Clock, 
  ArrowUpRight, 
  ChevronRight,
  Sparkles,
  MessageCircle,
  Bot,
  FileCheck2,
  ChefHat,
  CreditCard,
  TrendingUp,
  BellRing,
  AlertCircle,
  ArrowRight,
  Boxes,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface SystemFlowStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  detail: string;
  businessBenefit: string;
}

export const DashboardView: React.FC = () => {
  const { 
    orders, 
    inventory, 
    metrics, 
    setSelectedOrderId, 
    setCurrentView,
    dateFilter,
    setDateFilter
  } = useApp();

  // Active step selected in "Bagaimana Sistem Bekerja"
  const [activeFlowStep, setActiveFlowStep] = useState<string>('ai');

  // Filter today's orders
  const todayOrders = orders.filter((o) => o.orderDate.includes('24 Sep'));

  // SVG Chart Calculation for 7-Day sales
  const maxWeekly = Math.max(...WEEKLY_SALES_DATA.map((d) => d.amount));
  const minWeekly = Math.min(...WEEKLY_SALES_DATA.map((d) => d.amount)) * 0.8;
  const chartWidth = 600;
  const chartHeight = 150;
  const paddingX = 40;
  const paddingY = 24;

  const points = WEEKLY_SALES_DATA.map((d, index) => {
    const x = paddingX + (index / (WEEKLY_SALES_DATA.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((d.amount - minWeekly) / (maxWeekly - minWeekly)) * (chartHeight - paddingY * 2);
    return { x, y, day: d.day, amount: d.amount, isToday: d.isToday };
  });

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Flow steps for "Bagaimana Sistem Bekerja"
  const flowSteps: SystemFlowStep[] = [
    {
      id: 'channel',
      stepNumber: 1,
      title: 'WhatsApp / Web',
      subtitle: 'Saluran Masuk',
      icon: MessageCircle,
      summary: 'Pelanggan memesan lewat WhatsApp resmi NATA atau form online.',
      detail: 'Setiap chat dan formulir langsung disambut secara instan tanpa perlu admin standby 24 jam.',
      businessBenefit: 'Zero response delay, tidak ada calon pembeli yang beralih karena chat lama dibalas.',
    },
    {
      id: 'ai',
      stepNumber: 2,
      title: 'AI Receptionist',
      subtitle: 'Penyusunan Draf',
      icon: Bot,
      summary: 'AI merangkum varian cake, tanggal pengiriman, dan alamat tujuan.',
      detail: 'Menyusun draft pesanan terstruktur dan memeriksa slot produksi, tanpa membuat komitmen sepihak.',
      businessBenefit: 'Menghemat waktu rekap chat hingga 80%, pesanan langsung rapi sejak awal.',
    },
    {
      id: 'order',
      stepNumber: 3,
      title: 'Pesanan Resmi',
      subtitle: 'Verifikasi & Validasi',
      icon: FileCheck2,
      summary: 'Draf disetujui, nomor resmi diterbitkan (cth: NATA-017), tercatat di database.',
      detail: 'Customer menerima rincian pesanan terformat resmi dengan total biaya dan instruksi transfer.',
      businessBenefit: 'Menghilangkan salah catat varian atau salah tanggal antar.',
    },
    {
      id: 'production',
      stepNumber: 4,
      title: 'Produksi Dapur',
      subtitle: 'Antrian Oven & Layer',
      icon: ChefHat,
      summary: 'Dapur memanggang sesuai urutan tanggal kirim (H-2 / H-1 fresh oven).',
      detail: 'Tim Oven & Layer memonitor prioritas pesanan. Status diperbarui real-time saat selesai panggang.',
      businessBenefit: 'Kapasitas oven termonitor rapi, tidak ada cake yang terlambat atau terlewat.',
    },
    {
      id: 'payment',
      stepNumber: 5,
      title: 'Pembayaran',
      subtitle: 'Rekonsiliasi BCA',
      icon: CreditCard,
      summary: 'Status lunas atau menunggu transfer terpantau otomatis.',
      detail: 'Sistem menandai pesanan yang belum mengirimkan bukti transfer sebelum kue masuk pengiriman.',
      businessBenefit: 'Mencegah kue dikirim sebelum pembayaran lunas, piutang terkontrol rapat.',
    },
    {
      id: 'revenue',
      stepNumber: 6,
      title: 'Revenue & Profit',
      subtitle: 'Kalkulasi Otomatis',
      icon: TrendingUp,
      summary: 'Omzet harian, COGS bahan baku (Wijsman, telur), dan margin terhitung otomatis.',
      detail: 'Dashboard menghitung estimasi keuntungan bersih setiap hari tanpa menunggu rekap bulanan akunting.',
      businessBenefit: 'Owner mengetahui kesehatan margin setiap hari secara objektif.',
    },
    {
      id: 'notification',
      stepNumber: 7,
      title: 'Notifikasi Owner',
      subtitle: 'Alert Cerdas di HP',
      icon: BellRing,
      summary: 'Owner mendapat update singkat tentang hal yang butuh perhatian.',
      detail: 'Alert jika stok mentega menipis, pembayaran belum masuk, atau order korporat bernilai tinggi masuk.',
      businessBenefit: 'Owner tenang karena bisnis terpantau dalam 10 detik tanpa harus repot buka laptop.',
    },
  ];

  const currentStep = flowSteps.find((s) => s.id === activeFlowStep) || flowSteps[1];

  // Dynamic Today Activities
  const todayActivities = [
    {
      time: '12:15',
      title: 'AI Receptionist menjawab customer baru',
      subtitle: 'Sarah Wijaya · Permintaan 2 box Lapis Legit Coklat untuk Sabtu',
      type: 'ai',
      action: () => setCurrentView('ai-receptionist'),
      badge: 'AI Chat',
    },
    {
      time: '11:47',
      title: 'Stok butter berada di bawah minimum',
      subtitle: 'Butter Wijsman tersisa 18 tin (Estimasi 2.3 hari produksi)',
      type: 'inventory',
      action: () => setCurrentView('inventory'),
      badge: 'Stok Bahan',
      urgent: true,
    },
    {
      time: '11:05',
      title: 'Produksi selesai',
      subtitle: 'Order NATA-003 · Lapis Legit Polos (PT ABC Sejahtera) siap kemas',
      type: 'production',
      action: () => {
        setSelectedOrderId('NATA-003');
      },
      badge: 'Dapur Oven',
    },
    {
      time: '10:32',
      title: 'Pembayaran belum diterima',
      subtitle: 'NATA-006 · Rp 6.230.000 (Andi Pratama - Menunggu Bukti Transfer)',
      type: 'payment',
      action: () => setCurrentView('payments'),
      badge: 'Verifikasi',
      urgent: true,
    },
    {
      time: '09:14',
      title: 'Pesanan baru masuk melalui WhatsApp',
      subtitle: 'NATA-017 · Rp 1.900.000 (2 box Lapis Legit Kenari & Almond)',
      type: 'order',
      action: () => {
        setSelectedOrderId('NATA-001');
      },
      badge: 'WhatsApp',
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-16">
      {/* 1. TOP WELCOME & DATE HEADER */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#241A14] tracking-tight">
              Selamat datang di NATA 👋
            </h1>
            <span className="text-[11px] font-semibold text-[#8E4A35] bg-[#F5ECE8] px-2 py-0.5 rounded border border-[#ECD9D0]">
              Demo Data
            </span>
          </div>
          <p className="text-sm font-medium text-[#736A61] mt-1">
            Ringkasan bisnis hari ini · 24 September 2026
          </p>
          <p className="text-xs text-[#9E9388] mt-0.5">
            Droppfloww Systems · Demonstrasi Command Center NATA Cake and Cookies
          </p>
        </div>

        {/* Date Filter selector on desktop */}
        <div className="flex items-center gap-1 p-1 bg-[#F2ECE4] rounded-lg self-start md:self-center">
          {['Hari Ini', 'Kemarin', '7 Hari Terakhir'].map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setDateFilter(period)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                dateFilter === period
                  ? 'bg-white text-[#26211E] shadow-xs font-semibold'
                  : 'text-[#695F56] hover:text-[#26211E]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* 2. FOUR LARGE PRIMARY NUMBERS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Penjualan Hari Ini */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ECE5DC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#786F66]">
            <span className="text-xs font-medium">Penjualan Hari Ini</span>
            <div className="w-7 h-7 rounded-lg bg-[#F5ECE8] flex items-center justify-center text-[#8E4A35]">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#241A14] font-num tracking-tight">
              {formatRupiah(metrics.salesToday)}
            </div>
            <p className="text-[11px] text-[#2D6A4F] mt-1 font-medium flex items-center gap-1">
              <span>+14.8%</span>
              <span className="text-[#8C8279] font-normal">vs kemarin</span>
            </p>
          </div>
        </div>

        {/* Card 2: Pesanan Aktif */}
        <div 
          onClick={() => setCurrentView('orders')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ECE5DC] shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#D9CFBE] transition-colors group"
        >
          <div className="flex items-center justify-between text-[#786F66]">
            <span className="text-xs font-medium">Pesanan Aktif</span>
            <div className="w-7 h-7 rounded-lg bg-[#F2ECE4] flex items-center justify-center text-[#695F56] group-hover:text-[#26211E]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#241A14] font-num">
              {metrics.activeOrdersCount}
            </div>
            <p className="text-[11px] text-[#786F66] mt-1 group-hover:text-[#8E4A35] transition-colors">
              Klik untuk lihat daftar pesanan →
            </p>
          </div>
        </div>

        {/* Card 3: Sedang Diproduksi */}
        <div 
          onClick={() => setCurrentView('production')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ECE5DC] shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#D9CFBE] transition-colors group"
        >
          <div className="flex items-center justify-between text-[#786F66]">
            <span className="text-xs font-medium">Sedang Diproduksi</span>
            <div className="w-7 h-7 rounded-lg bg-[#FAF0E6] flex items-center justify-center text-[#A66D2E]">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#241A14] font-num">
              {metrics.inProductionCount}
            </div>
            <p className="text-[11px] text-[#786F66] mt-1 group-hover:text-[#8E4A35] transition-colors">
              Tim Oven & Layer aktif →
            </p>
          </div>
        </div>

        {/* Card 4: Menunggu Pembayaran */}
        <div 
          onClick={() => setCurrentView('payments')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ECE5DC] shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#D9CFBE] transition-colors group"
        >
          <div className="flex items-center justify-between text-[#786F66]">
            <span className="text-xs font-medium">Menunggu Pembayaran</span>
            <div className="w-7 h-7 rounded-lg bg-[#FDF0ED] flex items-center justify-center text-[#C04A2F]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#C04A2F] font-num">
              {metrics.waitingPaymentCount}
            </div>
            <p className="text-[11px] text-[#A8422A] mt-1 font-medium group-hover:underline">
              {formatRupiah(metrics.totalUnpaid)} belum konfirmasi →
            </p>
          </div>
        </div>
      </div>

      {/* 3. PERLU PERHATIAN (Top priority for owner action) */}
      <div className="bg-white rounded-2xl border border-[#E8DFD5] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C04A2F] animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#241A14]">
              PERLU PERHATIAN
            </h2>
          </div>
          <span className="text-[11px] text-[#7A7067] font-medium">
            Hal utama yang membutuhkan tindakan owner
          </span>
        </div>

        <div className="divide-y divide-[#F2ECE4]">
          {/* Alert 1: Pembayaran Belum Masuk */}
          <div 
            onClick={() => setCurrentView('payments')}
            className="py-3.5 flex items-center justify-between cursor-pointer group hover:bg-[#FAF8F5] -mx-2 px-3 rounded-xl transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">🔴</span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#26211E] group-hover:text-[#8E4A35] transition-colors">
                  2 pembayaran belum masuk
                </p>
                <p className="text-xs text-[#6B6158] mt-0.5 font-num">
                  <span className="font-semibold text-[#8E4A35]">Rp 7.230.000</span> belum dikonfirmasi (NATA-002 & NATA-006)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#8E4A35] font-semibold shrink-0 ml-2">
              <span className="hidden sm:inline">Cek Pembayaran</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Alert 2: Pesanan Butuh Informasi Tambahan */}
          <div 
            onClick={() => {
              setSelectedOrderId('NATA-002');
            }}
            className="py-3.5 flex items-center justify-between cursor-pointer group hover:bg-[#FAF8F5] -mx-2 px-3 rounded-xl transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">🟠</span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#26211E] group-hover:text-[#8E4A35] transition-colors">
                  1 pesanan membutuhkan informasi tambahan
                </p>
                <p className="text-xs text-[#6B6158] mt-0.5">
                  Alamat pengiriman belum lengkap (Andi Pratama · NATA-002)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#8E4A35] font-semibold shrink-0 ml-2">
              <span className="hidden sm:inline">Lengkapi Alamat</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Alert 3: Bahan Mulai Menipis */}
          <div 
            onClick={() => setCurrentView('inventory')}
            className="py-3.5 flex items-center justify-between cursor-pointer group hover:bg-[#FAF8F5] -mx-2 px-3 rounded-xl transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">🟡</span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#26211E] group-hover:text-[#8E4A35] transition-colors">
                  2 bahan mulai menipis
                </p>
                <p className="text-xs text-[#6B6158] mt-0.5">
                  Butter Wijsman (18 tin) dan Packaging Box Eksklusif (35 set)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#8E4A35] font-semibold shrink-0 ml-2">
              <span className="hidden sm:inline">Catat Restock</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Alert 4: AI Receptionist Pending Approval */}
          <div 
            onClick={() => setCurrentView('ai-receptionist')}
            className="py-3.5 flex items-center justify-between cursor-pointer group hover:bg-[#FAF8F5] -mx-2 px-3 rounded-xl transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">⚪</span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#26211E] group-hover:text-[#8E4A35] transition-colors">
                  1 draf pesanan WhatsApp siap dikonfirmasi
                </p>
                <p className="text-xs text-[#6B6158] mt-0.5">
                  Sarah Wijaya (2 Lapis Legit Coklat ke Tangerang · Rp 1.900.000)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#8E4A35] font-semibold shrink-0 ml-2">
              <span className="hidden sm:inline">Tinjau Draf</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. TODAY ACTIVITY TIMELINE */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8E4A35]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#241A14]">
              AKTIVITAS HARI INI
            </h2>
          </div>
          <span className="text-[11px] text-[#7A7067]">
            Kronologis aktivitas bisnis secara real-time
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {todayActivities.map((act, index) => (
            <div
              key={index}
              onClick={act.action}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#FAF8F5] transition-colors cursor-pointer group border border-transparent hover:border-[#ECE5DC]"
            >
              <div className="w-12 pt-0.5 text-xs font-num font-bold text-[#8E4A35] shrink-0">
                {act.time}
              </div>
              <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 bg-[#D9CFBE] group-hover:bg-[#8E4A35] transition-colors" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-semibold text-[#26211E] group-hover:text-[#8E4A35] transition-colors">
                    {act.title}
                  </p>
                  <span className={`text-[10px] font-medium px-2 py-0.2 rounded ${
                    act.urgent ? 'bg-[#FDF0ED] text-[#C04A2F]' : 'bg-[#F2ECE4] text-[#635A52]'
                  }`}>
                    {act.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#6E645B] mt-0.5 truncate">
                  {act.subtitle}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C4B9AC] group-hover:text-[#26211E] shrink-0 self-center" />
            </div>
          ))}
        </div>
      </div>

      {/* 5. HOW THE SYSTEM WORKS (Connected Business Flow) */}
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5DDD2] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE5DC] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8E4A35]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#241A14]">
                Bagaimana Sistem Bekerja
              </h2>
            </div>
            <p className="text-xs text-[#786E64] mt-0.5">
              Droppfloww menghubungkan seluruh rantai bisnis NATA dalam satu sistem terpadu
            </p>
          </div>
          <span className="text-[11px] text-[#8E4A35] font-medium bg-white px-2.5 py-1 rounded-full border border-[#E5DDD2] self-start sm:self-auto">
            Klik tahapan untuk melihat penjelasan
          </span>
        </div>

        {/* Horizontal Flow Steps (Scrollable on small screens) */}
        <div className="mt-5 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-[700px]">
            {flowSteps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeFlowStep === step.id;
              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => setActiveFlowStep(step.id)}
                    className={`flex-1 flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#8E4A35] shadow-sm ring-1 ring-[#8E4A35]'
                        : 'bg-white/80 border-[#E8E1D7] hover:bg-white hover:border-[#D5CABE]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-[#8E4A35] text-white' : 'bg-[#F2ECE4] text-[#695F56]'
                      }`}>
                        {step.stepNumber}
                      </div>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#8E4A35]' : 'text-[#9E9388]'}`} />
                    </div>
                    <div className="font-semibold text-xs text-[#26211E] mt-2 truncate">
                      {step.title}
                    </div>
                    <div className="text-[10px] text-[#7A7067] truncate mt-0.5">
                      {step.subtitle}
                    </div>
                  </button>

                  {idx < flowSteps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[#C4B9AC] shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Step Explanation Card */}
        <div className="mt-4 p-4.5 bg-white rounded-xl border border-[#E8E1D7] shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5ECE8] flex items-center justify-center text-[#8E4A35] font-bold shrink-0 mt-0.5">
              {currentStep.stepNumber}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#26211E]">
                  Tahap {currentStep.stepNumber}: {currentStep.title} ({currentStep.subtitle})
                </h3>
              </div>
              <p className="text-xs text-[#4A423B] mt-1 leading-relaxed">
                {currentStep.detail}
              </p>
              <div className="mt-2.5 pt-2 border-t border-[#F2ECE4] flex items-center gap-2 text-xs text-[#2D6A4F] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Nilai bagi Owner: {currentStep.businessBenefit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. PENJUALAN (7-DAY SALES CURVE) */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F2ECE4]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-[#241A14] tracking-tight uppercase">
                PENJUALAN
              </h2>
              <span className="text-[11px] text-[#7C7167]">7 Hari Terakhir (Sen - Min)</span>
            </div>
            <p className="text-xs text-[#7A7168] mt-0.5">
              Tren transaksi pemesanan harian NATA Cake and Cookies
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-[11px] text-[#7A7168]">Total Penjualan Minggu Ini</div>
            <div className="text-base sm:text-lg font-bold text-[#8E4A35] font-num">
              {formatRupiah(metrics.weeklySalesTotal)}
            </div>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[480px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-36">
              <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#F0EBE3" strokeDasharray="3 3" />
              <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#F0EBE3" strokeDasharray="3 3" />
              <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#E5DFD7" />

              <polygon
                points={`${paddingX},${chartHeight - paddingY} ${polylineStr} ${chartWidth - paddingX},${chartHeight - paddingY}`}
                fill="url(#goldGradient)"
                opacity="0.22"
              />

              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8E4A35" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>

              <polyline
                fill="none"
                stroke="#8E4A35"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineStr}
              />

              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.isToday ? 4.5 : 3}
                    className={p.isToday ? 'fill-[#8E4A35] stroke-white stroke-2' : 'fill-white stroke-[#8E4A35] stroke-2'}
                  />
                  <text
                    x={p.x}
                    y={p.y - 8}
                    textAnchor="middle"
                    className="text-[9px] font-num fill-[#4A423B] font-semibold"
                  >
                    {(p.amount / 1000000).toFixed(1)}M
                  </text>
                  <text
                    x={p.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    className={`text-[10px] font-medium ${p.isToday ? 'fill-[#8E4A35] font-bold' : 'fill-[#786F66]'}`}
                  >
                    {p.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* 7. PESANAN HARI INI */}
      <div className="bg-white rounded-2xl border border-[#ECE5DC] overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#F2ECE4] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-[#241A14] tracking-tight uppercase">
              Pesanan Hari Ini
            </h2>
            <p className="text-xs text-[#7A7168] mt-0.5">
              Daftar transaksi masuk 24 Sep 2026 ({todayOrders.length} pesanan)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('orders')}
            className="text-xs font-medium text-[#8E4A35] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Semua Pesanan ({orders.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile View: Clean Actionable Cards (eliminating table overflow on 390px) */}
        <div className="md:hidden divide-y divide-[#F2ECE4]">
          {todayOrders.map((o) => (
            <div
              key={o.id}
              onClick={() => setSelectedOrderId(o.id)}
              className="p-4 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-num font-bold text-xs text-[#8E4A35]">{o.id}</span>
                <span className="font-num font-bold text-xs text-[#26211E]">{formatRupiah(o.total)}</span>
              </div>
              <p className="text-xs font-semibold text-[#26211E] mt-1">{o.customerName}</p>
              <p className="text-[11px] text-[#635A52] truncate mt-0.5">
                {o.items.map((i) => `${i.productName} (${i.quantity}x)`).join(', ')}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5EFE8] text-[11px]">
                <span className="text-[#7A7168]">{o.deliveryDate}</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-[#524941]">{o.productionStatus}</span>
                  <span className="text-[#C4B9AC]">·</span>
                  <span className={o.paymentStatus === 'Lunas' ? 'text-[#2D6A4F]' : 'text-[#8E4A35]'}>
                    {o.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Full Clean Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE5DC] text-[#7A7168] font-medium">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Produk</th>
                <th className="py-3 px-4">Tanggal Kirim</th>
                <th className="py-3 px-4">Status Produksi</th>
                <th className="py-3 px-4">Pembayaran</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {todayOrders.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className="hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-num font-semibold text-[#8E4A35] group-hover:underline">
                    {o.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#26211E]">
                    {o.customerName}
                  </td>
                  <td className="py-3 px-4 text-[#595048] max-w-xs truncate">
                    {o.items.map((i) => `${i.productName} (${i.quantity}x)`).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-[#7A7168] font-num whitespace-nowrap">
                    {o.deliveryDate}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-[11px] font-medium text-[#26211E]">
                      {o.productionStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`text-[11px] font-semibold ${
                      o.paymentStatus === 'Lunas' ? 'text-[#2D6A4F]' : 'text-[#8E4A35]'
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-num font-semibold text-[#26211E] whitespace-nowrap">
                    {formatRupiah(o.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discreet Footer Note */}
      <div className="pt-2 text-center text-[11px] text-[#8C827A]">
        Contoh sistem berdasarkan informasi publik NATA (natacake.com). Data transaksi merupakan data simulasi oleh Droppfloww Systems.
      </div>
    </div>
  );
};
