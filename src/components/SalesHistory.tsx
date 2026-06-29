import React, { useState, useMemo } from 'react';
import { Sale } from '../types';

interface SalesHistoryProps {
  sales: Sale[];
  activeBranch: string;
  onSelectSale: (sale: Sale) => void;
  selectedSale: Sale | null;
  onCloseSaleDetail: () => void;
}

export default function SalesHistory({
  sales,
  activeBranch,
  onSelectSale,
  selectedSale,
  onCloseSaleDetail
}: SalesHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [discountFilter, setDiscountFilter] = useState<'all' | 'discounted' | 'flat'>('all');

  // Filter sales
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      // 1. Branch filter
      const matchesBranch = activeBranch === 'Todas las Sucursales' ? true : s.branch === activeBranch;
      
      // 2. Search string
      const q = searchQuery.toLowerCase();
      const matchesSearch = s.id.toLowerCase().includes(q) ||
                            (s.customerName && s.customerName.toLowerCase().includes(q)) ||
                            s.employeeName.toLowerCase().includes(q) ||
                            s.branch.toLowerCase().includes(q);

      // 3. Discount filter
      const matchesDiscount = discountFilter === 'discounted' ? s.discount > 0 :
                              discountFilter === 'flat' ? s.discount === 0 : true;

      return matchesBranch && matchesSearch && matchesDiscount;
    });
  }, [sales, activeBranch, searchQuery, discountFilter]);

  return (
    <div className="space-y-6">
      
      {/* Title header */}
      <div>
        <h1 className="font-display text-2xl font-black text-[#191b25] tracking-tight">Historial de Transacciones</h1>
        <p className="text-xs text-[#434656] mt-0.5">Consulta la bitácora completa de tickets emitidos, descuentos aplicados y cajeros responsables.</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#c3c5d9]/30 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <span className="material-symbols-outlined text-[#737688] absolute left-3 top-2.5 text-lg">search</span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por ID de ticket, cliente, cajero o sucursal..."
            className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#003ec7] transition-all"
          />
        </div>

        {/* Discount toggle */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'Ver Todos', icon: 'receipt_long' },
            { id: 'discounted', label: 'Con Descuento', icon: 'percent' },
            { id: 'flat', label: 'Precio Completo', icon: 'payments' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setDiscountFilter(opt.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                discountFilter === opt.id 
                  ? 'bg-[#003ec7]/10 text-[#003ec7] border border-[#003ec7]/20' 
                  : 'bg-slate-50 text-[#434656] border border-gray-100 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List Table */}
      <div className="bg-white rounded-xl border border-[#c3c5d9]/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbf8ff] border-b border-[#c3c5d9]/30 text-[10px] font-bold uppercase tracking-wider text-gray-500 font-display">
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Sucursal</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Atendido Por</th>
                <th className="p-4 text-center">Productos</th>
                <th className="p-4 text-right">Descuento</th>
                <th className="p-4 text-right">Monto Total</th>
                <th className="p-4 text-center">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-950 font-mono">{sale.id}</td>
                  <td className="p-4 text-gray-500 font-mono">{sale.date}</td>
                  <td className="p-4 text-gray-900 font-semibold">{sale.branch}</td>
                  <td className="p-4 text-gray-900">{sale.customerName || 'Cliente General (Mostrador)'}</td>
                  <td className="p-4 text-gray-500">{sale.employeeName}</td>
                  <td className="p-4 text-center font-bold text-gray-900">{sale.items.length} artículos</td>
                  <td className="p-4 text-right">
                    {sale.discount > 0 ? (
                      <span className="bg-red-50 text-[#ba1a1a] font-bold px-1.5 py-0.5 rounded font-display text-[10px]">
                        -{sale.discount}%
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-mono font-black text-gray-900 text-sm">
                    ${sale.total.toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onSelectSale(sale)}
                      className="w-7 h-7 bg-slate-50 hover:bg-[#dde1ff] text-[#434656] hover:text-[#003ec7] rounded-md flex items-center justify-center border border-gray-100 mx-auto cursor-pointer"
                      title="Ver Detalles del Ticket"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-gray-400 font-medium">
                    <span className="material-symbols-outlined text-block text-4xl mb-2">find_in_page</span>
                    No se encontraron registros de ventas con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECEIPTS OVERLAY DRILL-DOWN MODAL */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#c3c5d9]/40 relative overflow-hidden">
            
            {/* Header Success Accent banner */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#003ec7]"></div>

            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-display font-black text-[#191b25] text-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-gray-500">receipt_long</span>
                Comprobante de Pago
              </h3>
              <button 
                onClick={onCloseSaleDetail}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Simulated Ticket Layout */}
            <div className="font-mono text-xs text-gray-800 space-y-4">
              <div className="text-center space-y-1">
                <div className="font-bold text-sm tracking-widest text-black">RESGER CRM</div>
                <div className="text-[9px] text-[#434656]">{selectedSale.branch}</div>
                <div className="text-[9px] text-[#434656]">Fecha: {selectedSale.date}</div>
                <div className="text-[9px] text-[#434656]">Ticket: {selectedSale.id}</div>
              </div>

              <div className="space-y-1 text-[10px] border-y border-dashed border-[#c3c5d9]/30 py-2">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>DESCRIPCIÓN</span>
                  <span>CANT x PRECIO = TOTAL</span>
                </div>
                {selectedSale.items.map(item => (
                  <div key={item.productId} className="flex justify-between text-gray-700">
                    <span className="truncate pr-2 max-w-[150px]">{item.name}</span>
                    <span className="shrink-0">{item.quantity} x ${item.price.toFixed(2)} = ${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right text-[11px] font-bold">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>${selectedSale.subtotal.toFixed(2)}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-[#ba1a1a]">
                    <span>Descuento ({selectedSale.discount}%):</span>
                    <span>-${((selectedSale.subtotal * selectedSale.discount) / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-black text-xs pt-1.5 border-t border-dashed border-[#c3c5d9]/30 font-black">
                  <span>TOTAL PAGADO:</span>
                  <span>${selectedSale.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-[9px] text-[#434656] pt-2 space-y-1">
                <div>Cliente: {selectedSale.customerName || 'Cliente General (Mostrador)'}</div>
                <div>Atendido por: {selectedSale.employeeName}</div>
                <div className="font-bold tracking-wider pt-2">*** COPIA DE COMPROBANTE ***</div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
              <button 
                onClick={() => {
                  alert("Simulador de impresora: Ticket enviado a imprimir correctamente.");
                }}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                Imprimir Comprobante
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
