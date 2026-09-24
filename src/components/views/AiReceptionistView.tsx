/**
 * AI Receptionist Simulation View
 * Simulates a WhatsApp-connected AI assistant with human-in-the-loop approval,
 * order draft extraction, location/date parsing, and real order creation.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  HelpCircle,
  MapPin,
  Calendar,
  Check
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai';
  text: string;
  timestamp: string;
}

interface Scenario {
  id: string;
  title: string;
  customerName: string;
  phone: string;
  location: string;
  targetProduct: string;
  quantity: number;
  unitPrice: number;
  deliveryDate: string;
  deliveryFee: number;
  initialChat: ChatMessage[];
  draftNote: string;
}

export const AiReceptionistView: React.FC = () => {
  const { approveAiDraftOrder, setSelectedOrderId } = useApp();

  const scenarios: Scenario[] = [
    {
      id: 'sarah-lapis-coklat',
      title: 'Pesanan Baru · Sarah Wijaya',
      customerName: 'Sarah Wijaya',
      phone: '0812-9843-1120',
      location: 'Tangerang',
      targetProduct: 'Lapis Legit Coklat',
      quantity: 2,
      unitPrice: 925000,
      deliveryDate: 'Sabtu, 27 Sep 2026',
      deliveryFee: 50000,
      draftNote: 'Pesanan melalui WhatsApp AI. Kemasan kotak eksklusif NATA.',
      initialChat: [
        {
          id: 'm1',
          sender: 'customer',
          text: 'Halo Kak, saya mau pesan 2 Lapis Legit Coklat untuk hari Sabtu.',
          timestamp: '14:20',
        },
        {
          id: 'm2',
          sender: 'ai',
          text: 'Tentu Kak! Saya bantu cek pesanan. Boleh diinformasikan nama pemesan dan lokasi pengirimannya?',
          timestamp: '14:20',
        },
        {
          id: 'm3',
          sender: 'customer',
          text: 'Sarah, dikirim ke Tangerang.',
          timestamp: '14:21',
        },
        {
          id: 'm4',
          sender: 'ai',
          text: 'Baik Kak Sarah. Untuk 2 Lapis Legit Coklat ke Tangerang pada hari Sabtu, saya akan bantu siapkan detail pesanannya.',
          timestamp: '14:21',
        },
      ],
    },
    {
      id: 'corporate-hampers',
      title: 'Pesanan Korporat · PT Mega Kreasi',
      customerName: 'Lina (PT Mega Kreasi Abadi)',
      phone: '0821-4455-6677',
      location: 'Jakarta Barat',
      targetProduct: 'Paket Hampers Eksklusif NATA Signature',
      quantity: 3,
      unitPrice: 2250000,
      deliveryDate: 'Senin, 29 Sep 2026',
      deliveryFee: 60000,
      draftNote: 'PO Korporat. Perlu invoice resmi dengan stempel dan kop surat.',
      initialChat: [
        {
          id: 'c1',
          sender: 'customer',
          text: 'Selamat siang NATA, apakah bisa pesan 3 Paket Hampers Eksklusif Signature untuk relasi kantor hari Senin depan ke Jakarta Barat?',
          timestamp: '11:15',
        },
        {
          id: 'c2',
          sender: 'ai',
          text: 'Selamat siang Ibu Lina. Tentu bisa, untuk pengiriman Senin (29 Sep) ke Jakarta Barat slot produksi hampers masih tersedia. Apakah memerlukan invoice resmi perusahaan?',
          timestamp: '11:15',
        },
        {
          id: 'c3',
          sender: 'customer',
          text: 'Iya betul tolong siapkan invoice ya Kak. Nama PT Mega Kreasi Abadi.',
          timestamp: '11:17',
        },
        {
          id: 'c4',
          sender: 'ai',
          text: 'Baik Bu Lina. Draft pesanan sudah kami rangkum dengan catatan invoice. Draft ini diteruskan ke tim administrasi NATA untuk konfirmasi resmi.',
          timestamp: '11:17',
        },
      ],
    },
    {
      id: 'faq-delivery',
      title: 'Tanya Ongkir & Ketentuan H-2',
      customerName: 'Budi Santoso',
      phone: '0813-7721-5500',
      location: 'Bekasi Barat',
      targetProduct: 'Lapis Surabaya Polos',
      quantity: 1,
      unitPrice: 450000,
      deliveryDate: 'Jumat, 26 Sep 2026',
      deliveryFee: 65000,
      draftNote: 'Tanya ketentuan H-2 dan ongkos kirim area Bekasi.',
      initialChat: [
        {
          id: 'f1',
          sender: 'customer',
          text: 'Halo, kalau pesan Lapis Surabaya untuk besok lusa bisa dikirim ke Bekasi Barat? Ongkirnya berapa ya?',
          timestamp: '09:05',
        },
        {
          id: 'f2',
          sender: 'ai',
          text: 'Halo Pak Budi! Untuk cake NATA umumnya disiapkan pre-order H-2 agar selalu fresh dari oven. Untuk Bekasi Barat pengiriman via kurir khusus kue dengan tarif Rp 65.000. Apakah mau kami draft untuk hari Jumat?',
          timestamp: '09:06',
        },
        {
          id: 'f3',
          sender: 'customer',
          text: 'Boleh Kak tolong siapkan 1 Lapis Surabaya Polos ya.',
          timestamp: '09:08',
        },
        {
          id: 'f4',
          sender: 'ai',
          text: 'Siap Pak Budi! Draf pesanan sudah dibuat untuk hari Jumat (26 Sep). Tim kami akan segera memverifikasi.',
          timestamp: '09:08',
        },
      ],
    },
  ];

  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id);
  const [approvedScenarios, setApprovedScenarios] = useState<Record<string, string>>({});
  const [customInput, setCustomInput] = useState('');

  const currentScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];
  const isApproved = Boolean(approvedScenarios[currentScenario.id]);
  const approvedOrderId = approvedScenarios[currentScenario.id];

  const handleApprove = () => {
    const subtotal = currentScenario.quantity * currentScenario.unitPrice;
    const total = subtotal + currentScenario.deliveryFee;

    const newOrderId = approveAiDraftOrder({
      customerName: currentScenario.customerName,
      customerPhone: currentScenario.phone,
      deliveryCity: currentScenario.location,
      deliveryAddress: `Area ${currentScenario.location}`,
      deliveryDate: currentScenario.deliveryDate,
      deliveryFee: currentScenario.deliveryFee,
      items: [
        {
          productId: 'prod-02',
          productName: currentScenario.targetProduct,
          quantity: currentScenario.quantity,
          unitPrice: currentScenario.unitPrice,
          subtotal,
        },
      ],
      subtotal,
      total,
      notes: currentScenario.draftNote,
      aiDrafted: true,
    });

    setApprovedScenarios((prev) => ({ ...prev, [currentScenario.id]: newOrderId }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="border-b border-[#ECE5DC] pb-4">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold text-[#241A14] tracking-tight">
            AI Receptionist
          </h1>
          <span className="text-[11px] font-semibold text-[#2D6A4F] bg-[#EBF3ED] px-2 py-0.5 rounded border border-[#D5E5DA]">
            WhatsApp Assistant
          </span>
          <span className="text-[11px] font-semibold text-[#8E4A35] bg-[#F5ECE8] px-2 py-0.5 rounded border border-[#ECD9D0]">
            Demo Mode
          </span>
        </div>
        <p className="text-xs text-[#736A61] mt-1">
          Simulasi AI assistant WhatsApp yang menangani pertanyaan customer, mengekstrak data pesanan, dan menyiapkan draf sebelum disetujui tim.
        </p>
      </div>

      {/* AI Activity Summary - Requirement 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#ECE5DC] shadow-xs">
          <div className="text-xs text-[#7A7168] font-medium">Pesan Ditangani Hari Ini</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#26211E] font-num mt-1">12</div>
          <p className="text-[11px] text-[#7A7168] mt-0.5">Respon WhatsApp otomatis</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#ECE5DC] shadow-xs">
          <div className="text-xs text-[#7A7168] font-medium">Order Draft Dibuat</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#8E4A35] font-num mt-1">3</div>
          <p className="text-[11px] text-[#7A7168] mt-0.5">Rangkuman pesanan rapi</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#ECE5DC] shadow-xs">
          <div className="text-xs text-[#7A7168] font-medium">Follow-up Otomatis</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#2D6A4F] font-num mt-1">2</div>
          <p className="text-[11px] text-[#7A7168] mt-0.5">Pengingat sopan jadwal H-2</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#ECE5DC] shadow-xs">
          <div className="text-xs text-[#C04A2F] font-medium">Perlu Perhatian Manusia</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#C04A2F] font-num mt-1">1</div>
          <p className="text-[11px] text-[#A8422A] mt-0.5">Menunggu approval tim</p>
        </div>
      </div>

      {/* Human-in-the-loop Governance Banner */}
      <div className="p-3.5 sm:p-4 bg-[#FCF8F2] rounded-xl border border-[#EADBCC] flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-[#8E4A35] shrink-0 mt-0.5" />
        <p className="text-xs text-[#5C4F44] leading-relaxed">
          <strong className="text-[#26211E] font-semibold">Prinsip Kendali Owner: </strong>
          AI membantu pekerjaan rutin, tetapi keputusan penting tetap dapat memerlukan persetujuan tim. AI tidak dapat mengubah jadwal oven atau membatalkan pesanan tanpa otorisasi manusia.
        </p>
      </div>

      {/* Scenario Selector Segment */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-[#7A7168] mr-2 shrink-0">Simulasi Percakapan:</span>
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => setActiveScenarioId(sc.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeScenarioId === sc.id
                ? 'bg-[#8E4A35] text-white shadow-xs'
                : 'bg-white text-[#4A423B] border border-[#E2DAD0] hover:bg-[#FAF8F5]'
            }`}
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Main Split: Simulated WhatsApp Conversation & Order Draft Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Simulated WhatsApp Chat Window (7 Cols) */}
        <div className="lg:col-span-7 bg-[#EFEAE2] rounded-2xl border border-[#DED7CD] overflow-hidden shadow-xs flex flex-col h-[520px]">
          {/* WhatsApp Header */}
          <div className="px-4 py-3 bg-[#075E54] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                {currentScenario.customerName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">{currentScenario.customerName}</p>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>NATA AI WhatsApp Assistant Online</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] text-white/80 font-mono">{currentScenario.phone}</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#dfd7cc_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="text-center">
              <span className="text-[10px] text-[#7E746A] bg-white/70 px-2 py-0.5 rounded shadow-2xs">
                Hari Ini, 24 September 2026
              </span>
            </div>

            {currentScenario.initialChat.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3 text-xs shadow-2xs ${
                    msg.sender === 'customer'
                      ? 'bg-white text-[#26211E] rounded-tl-xs'
                      : 'bg-[#DCF8C6] text-[#1E3A2F] rounded-tr-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-[#8C847A]">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'ai' && <Check className="w-2.5 h-2.5 text-[#2D6A4F]" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-2.5 bg-[#F0ECE5] border-t border-[#DED7CD] flex items-center gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customInput.trim()) {
                  alert('Pesan simulasi diterima. AI memahami konteks pesanan secara otomatis.');
                  setCustomInput('');
                }
              }}
              placeholder="Ketik pesan simulasi..."
              className="flex-1 px-3 py-2 bg-white rounded-lg text-xs text-[#26211E] placeholder:text-[#A0958B] border border-[#D9D1C7] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (customInput.trim()) {
                  alert('Pesan simulasi diterima. AI memahami konteks pesanan secara otomatis.');
                  setCustomInput('');
                }
              }}
              className="p-2 bg-[#075E54] text-white rounded-lg hover:bg-[#064e46] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Order Draft Created & Human-in-the-loop Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-[#ECE5DC] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8E4A35]" />
                <h3 className="text-xs font-bold text-[#241A14] uppercase tracking-tight">
                  Order Draft Created
                </h3>
              </div>
              <span className="text-[10px] bg-[#FAF0E6] text-[#9A652A] px-2 py-0.5 rounded font-medium border border-[#EBD7BE]">
                {isApproved ? 'Sudah Disetujui' : 'Menunggu Konfirmasi'}
              </span>
            </div>

            {/* Structured Draft Information */}
            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE5DC]">
                <div className="text-[11px] text-[#7A7168]">Customer</div>
                <div className="font-semibold text-[#26211E] text-sm mt-0.5">
                  {currentScenario.customerName}
                </div>
                <div className="text-[11px] text-[#7A7168] font-num">{currentScenario.phone}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE5DC]">
                  <div className="text-[11px] text-[#7A7168] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#8E4A35]" />
                    <span>Tanggal Kirim</span>
                  </div>
                  <div className="font-semibold text-[#26211E] mt-1">{currentScenario.deliveryDate}</div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE5DC]">
                  <div className="text-[11px] text-[#7A7168] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#8E4A35]" />
                    <span>Lokasi</span>
                  </div>
                  <div className="font-semibold text-[#26211E] mt-1">{currentScenario.location}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE5DC]">
                <div className="text-[11px] text-[#7A7168]">Produk & Jumlah</div>
                <div className="flex items-center justify-between font-semibold text-[#26211E] mt-1">
                  <span>{currentScenario.targetProduct}</span>
                  <span className="font-num text-[#8E4A35]">× {currentScenario.quantity}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#7A7168] mt-1 pt-1 border-t border-[#ECE5DC]">
                  <span>Estimasi Total (+ Ongkir {formatRupiah(currentScenario.deliveryFee)})</span>
                  <span className="font-bold text-[#26211E] font-num">
                    {formatRupiah(currentScenario.quantity * currentScenario.unitPrice + currentScenario.deliveryFee)}
                  </span>
                </div>
              </div>
            </div>

            {/* Critical Safeguard Notice: Perlu Persetujuan Tim */}
            <div className="mt-4 p-3 bg-[#FCF7ED] rounded-xl border border-[#EBD6B0] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#A86419] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#7E480E]">Perlu Persetujuan Tim</p>
                <p className="text-[11px] text-[#87551D] mt-0.5 leading-relaxed">
                  AI tidak membuat keputusan bisnis sepihak. Staf NATA memverifikasi kuota oven & stok sebelum draf resmi masuk antrian produksi.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4">
              {isApproved ? (
                <div className="space-y-2">
                  <div className="w-full py-2.5 bg-[#EAF2ED] text-[#2D6A4F] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-[#D5E5DA]">
                    <CheckCircle className="w-4 h-4" />
                    <span>Pesanan Disetujui ({approvedOrderId})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => approvedOrderId && setSelectedOrderId(approvedOrderId)}
                    className="w-full py-2 text-xs font-medium text-[#8E4A35] hover:underline cursor-pointer"
                  >
                    Buka Detail Pesanan di Command Center →
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApprove}
                  className="w-full py-2.5 bg-[#8E4A35] hover:bg-[#743523] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Setujui Pesanan</span>
                </button>
              )}
            </div>
          </div>

          {/* AI Receptionist Capabilities Summary */}
          <div className="bg-white rounded-2xl border border-[#ECE5DC] p-4 text-xs space-y-2">
            <h4 className="font-bold text-[#26211E] flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#8E4A35]" />
              <span>Kemampuan AI Receptionist</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-[#595048]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#8E4A35] font-bold">✓</span>
                <span>Menjawab pertanyaan produk, ketahanan cake, & saran penyimpanan</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#8E4A35] font-bold">✓</span>
                <span>Mengekstrak tanggal pengiriman & hitung lead-time (aturan H-2)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#8E4A35] font-bold">✓</span>
                <span>Menghitung ongkir wilayah (Jakarta, Tangerang, Bekasi, Depok)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#8E4A35] font-bold">✓</span>
                <span>Mendeteksi data pesanan belum lengkap dan menanyakan secara sopan</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#8E4A35] font-bold">✓</span>
                <span>Meneruskan draf order ke dashboard NATA untuk approval manusia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
