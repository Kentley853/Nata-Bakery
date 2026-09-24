/**
 * Instant Global Search Dialog
 * Fast client-side search across Orders, Customers, Products, and Cities
 */

import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, ShoppingBag, User, Cake } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    orders,
    customers,
    products,
    setSelectedOrderId,
    setCurrentView,
  } = useApp();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isSearchOpen, setSearchQuery]);

  if (!isSearchOpen) return null;

  const query = searchQuery.trim().toLowerCase();

  const matchedOrders = query
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          o.customerName.toLowerCase().includes(query) ||
          o.deliveryCity.toLowerCase().includes(query) ||
          o.items.some((i) => i.productName.toLowerCase().includes(query))
      )
    : orders.slice(0, 4);

  const matchedCustomers = query
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.phone.toLowerCase().includes(query) ||
          c.city.toLowerCase().includes(query)
      )
    : [];

  const matchedProducts = query
    ? products.filter((p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E8E2D9] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#F0EAE1] gap-3">
          <Search className="w-5 h-5 text-[#8E4A35]" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik nama customer, nomor order (mis. NATA-001), produk, atau kota..."
            className="flex-1 bg-transparent text-sm text-[#26211E] placeholder:text-[#9E948B] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-md text-[#786F66] hover:bg-[#FAF8F5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Orders Section */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-[#8C8176] uppercase tracking-wider">
              Pesanan ({matchedOrders.length})
            </div>
            {matchedOrders.length === 0 ? (
              <p className="px-3 py-2 text-xs text-[#9E948B]">Tidak ada pesanan cocok.</p>
            ) : (
              <div className="space-y-1 mt-1">
                {matchedOrders.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setSelectedOrderId(o.id);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FAF8F5] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F5ECE8] flex items-center justify-center text-[#8E4A35] shrink-0">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#26211E] font-num">{o.id}</span>
                          <span className="text-xs text-[#5C534B]">· {o.customerName}</span>
                        </div>
                        <p className="text-[11px] text-[#7A7168] truncate max-w-xs">
                          {o.items.map((i) => `${i.productName} (${i.quantity}x)`).join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-[#26211E] font-num">
                        {formatRupiah(o.total)}
                      </div>
                      <span className="text-[10px] text-[#8E4A35]">{o.paymentStatus}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Customers Section */}
          {matchedCustomers.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-[#8C8176] uppercase tracking-wider">
                Customer ({matchedCustomers.length})
              </div>
              <div className="space-y-1 mt-1">
                {matchedCustomers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCurrentView('customers');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FAF8F5] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#ECECEE] flex items-center justify-center text-[#44403C] shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#26211E]">{c.name}</p>
                        <p className="text-[11px] text-[#7A7168]">{c.phone} · {c.city}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-num text-[#5C534B]">{formatRupiah(c.totalSpend)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          {matchedProducts.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-[#8C8176] uppercase tracking-wider">
                Produk NATA ({matchedProducts.length})
              </div>
              <div className="space-y-1 mt-1">
                {matchedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#FCFAF7] text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F5ECE8] flex items-center justify-center text-[#8E4A35] shrink-0">
                        <Cake className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#26211E]">{p.name}</p>
                        <p className="text-[11px] text-[#7A7168]">{p.category} · Pre-order H-{p.leadDays}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#26211E] font-num">{formatRupiah(p.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Shortcut */}
        <div className="px-4 py-2 bg-[#FAF8F5] border-t border-[#F0EAE1] flex items-center justify-between text-[11px] text-[#8C8176]">
          <span>Tekan ESC untuk menutup</span>
          <span>Klik pesanan untuk membuka detail</span>
        </div>
      </div>
    </div>
  );
};
