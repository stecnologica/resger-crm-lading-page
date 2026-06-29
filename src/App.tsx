import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Customers from './components/Customers';
import Employees from './components/Employees';
import SalesHistory from './components/SalesHistory';

import { Product, Customer, Employee, Sale, Branch } from './types';
import { 
  loadCRMState, 
  saveCRMState, 
  INITIAL_PRODUCTS_BY_INDUSTRY, 
  generateInitialSales, 
  INITIAL_CUSTOMERS, 
  INITIAL_EMPLOYEES,
  INITIAL_BRANCHES,
  INDUSTRIES
} from './data';

export default function App() {
  // Navigation mode: 'landing' or 'app'
  const [mode, setMode] = useState<'landing' | 'app'>('landing');
  // Active screen inside the CRM app
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core database state
  const [state, setState] = useState(() => loadCRMState());

  // Receipt details drilldown state (shared between Dashboard and SalesHistory)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Synchronise state changes to LocalStorage
  useEffect(() => {
    saveCRMState(state);
  }, [state]);

  // Handle Starting Demo / Pilot setup from Landing page
  const handleStartDemo = (industryKey?: string) => {
    const key = industryKey || 'cafeteria';
    
    // Switch state to the selected industry, resetting data to that industry's default
    const products = INITIAL_PRODUCTS_BY_INDUSTRY[key] || INITIAL_PRODUCTS_BY_INDUSTRY.cafeteria;
    const sales = generateInitialSales(products);
    
    setState({
      industry: key,
      products,
      customers: INITIAL_CUSTOMERS,
      employees: INITIAL_EMPLOYEES,
      sales,
      branches: INITIAL_BRANCHES,
      activeBranch: 'Todas las Sucursales'
    });

    setActiveTab('dashboard');
    setMode('app');
  };

  // Hot swap industry inside Settings/TopBar
  const handleIndustryChange = (newIndustry: string) => {
    if (window.confirm("¿Deseas cambiar el rubro del negocio? Se reiniciarán el inventario y las ventas simuladas de acuerdo al sector seleccionado.")) {
      const products = INITIAL_PRODUCTS_BY_INDUSTRY[newIndustry] || INITIAL_PRODUCTS_BY_INDUSTRY.cafeteria;
      const sales = generateInitialSales(products);
      
      setState(prev => ({
        ...prev,
        industry: newIndustry,
        products,
        sales,
        activeBranch: 'Todas las Sucursales'
      }));
      setActiveTab('dashboard');
    }
  };

  // State mutations
  const handleAddSale = (newSale: Sale) => {
    setState(prev => {
      // 1. Add to sales history
      const updatedSales = [newSale, ...prev.sales];
      
      // 2. Increment employee sales volume
      const updatedEmployees = prev.employees.map(emp => {
        if (emp.id === newSale.employeeId) {
          return { ...emp, totalSales: parseFloat((emp.totalSales + newSale.total).toFixed(2)) };
        }
        return emp;
      });

      // 3. Increment customer total spent
      const updatedCustomers = prev.customers.map(cust => {
        if (cust.id === newSale.customerId) {
          return { ...cust, totalSpent: parseFloat((cust.totalSpent + newSale.total).toFixed(2)) };
        }
        return cust;
      });

      return {
        ...prev,
        sales: updatedSales,
        employees: updatedEmployees,
        customers: updatedCustomers
      };
    });
  };

  const handleAddProduct = (newProduct: Product) => {
    setState(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    }));
  };

  const handleDeleteProduct = (productId: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId)
    }));
  };

  const handleRestockProduct = (productId: string, amount: number) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.id === productId) {
          return { ...p, stock: p.stock + amount };
        }
        return p;
      })
    }));
  };

  const handleDeductStock = (productId: string, quantity: number) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.id === productId) {
          return { ...p, stock: Math.max(0, p.stock - quantity) };
        }
        return p;
      })
    }));
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setState(prev => ({
      ...prev,
      customers: [newCustomer, ...prev.customers]
    }));
  };

  const handleAddEmployee = (newEmployee: Employee) => {
    setState(prev => ({
      ...prev,
      employees: [...prev.employees, newEmployee]
    }));
  };

  const handleToggleEmployeeStatus = (employeeId: string) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.map(emp => 
        emp.id === employeeId ? { ...emp, active: !emp.active } : emp
      )
    }));
  };

  const handleBranchChange = (branchName: string) => {
    setState(prev => ({
      ...prev,
      activeBranch: branchName
    }));
  };

  // Safe navigation wrapper
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    // Auto-scroll inside SPA
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeIndustryInfo = INDUSTRIES.find(ind => ind.id === state.industry) || INDUSTRIES[0];

  return (
    <div className="min-h-screen bg-[#fbf8ff] font-sans antialiased">
      <AnimatePresence mode="wait">
        
        {/* MODE 1: MARKETING LANDING PAGE */}
        {mode === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onStartDemo={handleStartDemo} />
          </motion.div>
        )}

        {/* MODE 2: THE WORKING INTERACTIVE CRM APPLICATION */}
        {mode === 'app' && (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="flex min-h-screen"
          >
            {/* Sidebar Navigation Panel */}
            <aside className="w-64 bg-[#191b25] text-white hidden md:flex flex-col justify-between shrink-0 border-r border-[#c3c5d9]/10 relative z-30">
              <div className="space-y-6 py-6">
                
                {/* Brand Header */}
                <div className="px-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-3xl text-[#0052ff] font-bold">bar_chart</span>
                  <div className="text-left">
                    <span className="font-display text-xl font-black tracking-tight text-white">RESGER</span>
                    <span className="block text-[8px] uppercase tracking-widest text-gray-400 font-bold font-display">Centro de Control</span>
                  </div>
                </div>

                {/* Main Tab Links */}
                <nav className="px-3 space-y-1">
                  {[
                    { id: 'dashboard', label: 'Dashboard 360°', icon: 'dashboard' },
                    { id: 'pos', label: 'Punto de Venta (POS)', icon: 'point_of_sale' },
                    { id: 'inventory', label: 'Inventario / Stock', icon: 'inventory' },
                    { id: 'customers', label: 'Clientes (Fidelización)', icon: 'groups' },
                    { id: 'employees', label: 'Colaboradores', icon: 'badge' },
                    { id: 'sales', label: 'Historial de Ventas', icon: 'history' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleNavigate(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-display transition-all cursor-pointer ${
                        activeTab === tab.id 
                          ? 'bg-[#003ec7] text-white shadow-md' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Bottom sidebar info & Exit back to Landing */}
              <div className="p-4 border-t border-white/5 space-y-4">
                <div className="bg-white/5 p-3 rounded-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#003ec7]/20 text-[#dde1ff] flex items-center justify-center font-bold text-xs font-display">
                    P
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Piloto Activo</div>
                    <div className="text-[9px] text-gray-400">Cupo reservado</div>
                  </div>
                </div>

                <button
                  onClick={() => setMode('landing')}
                  className="w-full bg-white/10 hover:bg-white/15 text-white/90 border border-white/10 py-2.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Volver a la Web
                </button>
              </div>
            </aside>

            {/* Right main body viewport wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
              
              {/* Topbar navigation / filter engine */}
              <header className="h-20 bg-white border-b border-[#c3c5d9]/30 flex items-center justify-between px-6 sticky top-0 z-20 shadow-xs">
                
                {/* Left mobile menu toggle / active category */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setMode('landing')}
                    className="md:hidden flex items-center justify-center w-9 h-9 bg-slate-50 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100"
                    title="Volver"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                  </button>

                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-display">Sector Comercial</span>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#003ec7] text-base">{activeIndustryInfo.icon}</span>
                      <select 
                        value={state.industry}
                        onChange={(e) => handleIndustryChange(e.target.value)}
                        className="bg-transparent text-gray-900 font-display font-black text-sm border-none focus:outline-none focus:ring-0 py-0 pl-0 pr-6 cursor-pointer hover:text-[#003ec7] transition-colors"
                      >
                        {INDUSTRIES.map(ind => (
                          <option key={ind.id} value={ind.id}>{ind.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right branch selector & notification hub */}
                <div className="flex items-center gap-4">
                  
                  {/* Branch selector (Multiempresa config) */}
                  <div className="text-right hidden sm:block">
                    <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-display">Sucursal Activa</span>
                    <select
                      value={state.activeBranch}
                      onChange={(e) => handleBranchChange(e.target.value)}
                      className="bg-transparent text-gray-900 font-display font-semibold text-xs border-none focus:outline-none focus:ring-0 py-0 pl-0 pr-6 cursor-pointer text-right"
                    >
                      <option value="Todas las Sucursales">Todas las Sucursales</option>
                      {state.branches.map(br => (
                        <option key={br.id} value={br.name}>{br.name}</option>
                      ))}
                    </select>
                  </div>

                  <span className="w-px h-8 bg-gray-200 hidden sm:block"></span>

                  {/* Profile info */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#003ec7] text-white font-black text-xs flex items-center justify-center font-display">
                      AD
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-xs font-bold text-gray-900 leading-tight">Admin RESGER</div>
                      <span className="block text-[9px] text-[#006c4b] font-bold uppercase font-display tracking-wider">Plan Piloto</span>
                    </div>
                  </div>

                </div>
              </header>

              {/* Mobile bottom bar navigation */}
              <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#191b25] border-t border-white/5 z-40 grid grid-cols-5 text-center text-white/50">
                {[
                  { id: 'dashboard', label: 'Dash', icon: 'dashboard' },
                  { id: 'pos', label: 'POS', icon: 'point_of_sale' },
                  { id: 'inventory', label: 'Stock', icon: 'inventory_2' },
                  { id: 'customers', label: 'Clientes', icon: 'groups' },
                  { id: 'employees', label: 'Equipo', icon: 'badge' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleNavigate(tab.id)}
                    className={`py-3 flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      activeTab === tab.id ? 'text-[#0052ff] bg-white/5' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{tab.icon}</span>
                    <span className="text-[9px] font-bold font-display leading-none">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Main Tab Screen Area */}
              <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto overflow-y-auto">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="entrance-fade"
                >
                  {activeTab === 'dashboard' && (
                    <Dashboard 
                      products={state.products}
                      sales={state.sales}
                      employees={state.employees}
                      activeBranch={state.activeBranch}
                      onNavigate={handleNavigate}
                      onRestockProduct={handleRestockProduct}
                      onSelectSale={(sale) => setSelectedSale(sale)}
                    />
                  )}

                  {activeTab === 'pos' && (
                    <POS 
                      products={state.products}
                      customers={state.customers}
                      employees={state.employees}
                      activeBranch={state.activeBranch}
                      onAddSale={handleAddSale}
                      onAddCustomer={handleAddCustomer}
                      onDeductStock={handleDeductStock}
                    />
                  )}

                  {activeTab === 'inventory' && (
                    <Inventory 
                      products={state.products}
                      onAddProduct={handleAddProduct}
                      onEditProduct={handleEditProduct}
                      onDeleteProduct={handleDeleteProduct}
                      onRestockProduct={handleRestockProduct}
                    />
                  )}

                  {activeTab === 'customers' && (
                    <Customers 
                      customers={state.customers}
                      onAddCustomer={handleAddCustomer}
                    />
                  )}

                  {activeTab === 'employees' && (
                    <Employees 
                      employees={state.employees}
                      onAddEmployee={handleAddEmployee}
                      onToggleEmployeeStatus={handleToggleEmployeeStatus}
                    />
                  )}

                  {activeTab === 'sales' && (
                    <SalesHistory 
                      sales={state.sales}
                      activeBranch={state.activeBranch}
                      onSelectSale={(sale) => setSelectedSale(sale)}
                      selectedSale={selectedSale}
                      onCloseSaleDetail={() => setSelectedSale(null)}
                    />
                  )}
                </motion.div>
              </main>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
