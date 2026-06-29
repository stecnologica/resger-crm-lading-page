import React, { useState, useMemo } from 'react';
import { Customer } from '../types';

interface CustomersProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
}

export default function Customers({ customers, onAddCustomer }: CustomersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Search filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );
  }, [customers, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newCust: Customer = {
      id: `C-${Date.now()}`,
      name,
      email: email || 'Sin correo',
      phone: phone || 'Sin teléfono',
      totalSpent: 0,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    onAddCustomer(newCust);
    setShowModal(false);

    // Reset fields
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-[#191b25] tracking-tight">Fidelización de Clientes</h1>
          <p className="text-xs text-[#434656] mt-0.5">Administra la base de datos de clientes, saldos acumulados e historial de contacto.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#003ec7] hover:bg-[#0052ff] text-white px-4 py-2.5 rounded-lg font-display text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Agregar Cliente
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#c3c5d9]/30 shadow-xs">
        <div className="relative">
          <span className="material-symbols-outlined text-[#737688] absolute left-3 top-2.5 text-lg">search</span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, correo electrónico o teléfono de contacto..."
            className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#003ec7]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-[#c3c5d9]/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbf8ff] border-b border-[#c3c5d9]/30 text-[10px] font-bold uppercase tracking-wider text-gray-500 font-display">
                <th className="p-4">Cliente</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Fecha de Alta</th>
                <th className="p-4 text-right">Monto Consumido ($)</th>
                <th className="p-4 text-center">Nivel de Cliente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredCustomers.map(cust => {
                // Customer tiering system
                const isVIP = cust.totalSpent >= 800;
                const isFrequent = cust.totalSpent >= 300 && cust.totalSpent < 800;
                
                return (
                  <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#003ec7]/10 text-[#003ec7] font-display font-black text-xs rounded-full flex items-center justify-center">
                          {cust.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{cust.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">ID: {cust.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="text-gray-900 font-medium">{cust.phone}</div>
                      <div className="text-gray-500 font-mono text-[10px]">{cust.email}</div>
                    </td>
                    <td className="p-4 text-gray-500 font-mono">{cust.registrationDate}</td>
                    <td className="p-4 text-right font-mono font-black text-gray-900 text-sm">
                      ${cust.totalSpent.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-display ${
                        isVIP 
                          ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                          : isFrequent 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isVIP ? 'VIP Premium' : isFrequent ? 'Frecuente' : 'Nuevo Registro'}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                    <span className="material-symbols-outlined text-4xl mb-2 block">person_search</span>
                    No se encontraron clientes registrados con esa información.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW CUSTOMER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c5d9]/40">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <h3 className="font-display font-extrabold text-[#191b25] text-sm">Registrar Nuevo Cliente</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Nombre Completo *</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ej. Carlos Eduardo Restrepo"
                  className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Número Telefónico</label>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="ej. +54 9 11 9876-5432"
                  className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Correo Electrónico</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ej. carlos.restrepo@mail.com"
                  className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                />
              </div>

              <div className="pt-4 flex gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 border border-[#c3c5d9] text-[#434656] rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#003ec7] hover:bg-[#0052ff] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Guardar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
