import React, { useState } from 'react';
import { Employee } from '../types';

interface EmployeesProps {
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
  onToggleEmployeeStatus: (employeeId: string) => void;
}

export default function Employees({
  employees,
  onAddEmployee,
  onToggleEmployeeStatus
}: EmployeesProps) {
  const [showModal, setShowModal] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Vendedor' | 'Administrador' | 'Gerente'>('Vendedor');

  // Sorted employees by sales performance (Leaderboard)
  const sortedSellers = [...employees]
    .filter(e => e.role === 'Vendedor' || e.role === 'Gerente')
    .sort((a, b) => b.totalSales - a.totalSales);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newEmp: Employee = {
      id: `E-${Date.now()}`,
      name,
      role,
      totalSales: 0,
      active: true
    };

    onAddEmployee(newEmp);
    setShowModal(false);

    // Reset fields
    setName('');
    setRole('Vendedor');
  };

  return (
    <div className="space-y-6">
      
      {/* Title header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-[#191b25] tracking-tight">Colaboradores y Productividad</h1>
          <p className="text-xs text-[#434656] mt-0.5">Controla tu equipo, roles de acceso y ranking de ventas acumuladas por vendedor.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#003ec7] hover:bg-[#0052ff] text-white px-4 py-2.5 rounded-lg font-display text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">badge</span>
          Registrar Colaborador
        </button>
      </div>

      {/* Grid: Left - Team Table, Right - Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Complete Team Table (8 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#c3c5d9]/30 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-[#fbf8ff]">
            <h3 className="font-display font-bold text-gray-900 text-sm">Nómina del Local</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c3c5d9]/30 text-[9px] font-bold uppercase tracking-wider text-gray-500 font-display bg-slate-50/50">
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Cargo / Rol</th>
                  <th className="p-4 text-center">Estado</th>
                  <th className="p-4 text-right">Ventas Totales</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-slate-100 text-gray-700 rounded-full flex items-center justify-center font-display font-bold">
                        {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div>{emp.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">ID: {emp.id}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-display ${
                        emp.role === 'Administrador' 
                          ? 'bg-purple-100 text-purple-800' 
                          : emp.role === 'Gerente'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold font-display ${
                        emp.active 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${emp.active ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                        {emp.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-black text-gray-900">
                      ${emp.totalSales.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onToggleEmployeeStatus(emp.id)}
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                          emp.active 
                            ? 'bg-white hover:bg-red-50 text-red-600 border-red-200' 
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {emp.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Seller Leaderboard Trophy visual (4 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#c3c5d9]/30 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
            <span className="material-symbols-outlined text-[#003ec7]">emoji_events</span>
            <div>
              <h3 className="font-display font-black text-gray-900 text-sm">Productividad (Leaderboard)</h3>
              <p className="text-[10px] text-gray-500">Quién ha despachado el mayor volumen comercial</p>
            </div>
          </div>

          <div className="space-y-3">
            {sortedSellers.map((seller, idx) => (
              <div key={seller.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 relative overflow-hidden">
                
                {/* Visual rank accent */}
                {idx === 0 && (
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-[#003ec7]"></div>
                )}

                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-display text-xs font-black ${
                    idx === 0 
                      ? 'bg-[#dde1ff] text-[#003ec7]' 
                      : idx === 1 
                        ? 'bg-slate-200 text-slate-800' 
                        : 'bg-gray-100 text-gray-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      {seller.name}
                      {idx === 0 && seller.totalSales > 0 && (
                        <span className="material-symbols-outlined text-amber-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 font-semibold font-display">{seller.role}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-gray-900">${seller.totalSales.toFixed(2)}</div>
                  <span className="text-[9px] text-[#006c4b] font-bold font-display uppercase tracking-wider">Cerrados</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CREATE NEW EMPLOYEE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c5d9]/40">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <h3 className="font-display font-extrabold text-[#191b25] text-sm">Registrar Nuevo Colaborador</h3>
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
                  placeholder="ej. Sofía Lucía Castro"
                  className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Cargo / Rol en Local *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                >
                  <option value="Vendedor">Vendedor</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Administrador">Administrador</option>
                </select>
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
                  Guardar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
