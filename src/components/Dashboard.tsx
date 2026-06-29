import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell
} from 'recharts';
import { Product, Sale, Employee } from '../types';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  employees: Employee[];
  activeBranch: string;
  onNavigate: (tab: string) => void;
  onRestockProduct: (productId: string, amount: number) => void;
  onSelectSale: (sale: Sale) => void;
}

export default function Dashboard({ 
  products, 
  sales, 
  employees, 
  activeBranch,
  onNavigate,
  onRestockProduct,
  onSelectSale
}: DashboardProps) {

  // Filter sales based on active company branch
  const filteredSales = sales.filter(s => 
    activeBranch === 'Todas las Sucursales' ? true : s.branch === activeBranch
  );

  // 1. Calculate KPI Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = filteredSales.filter(s => s.date === todayStr);
  
  const todayRevenue = todaySales.reduce((acc, s) => acc + s.total, 0);
  const todayTransactions = todaySales.length;

  // Calculate Net Profit (Total Revenue - Total Cost of items sold)
  let totalRevenueAllTime = 0;
  let totalCostAllTime = 0;

  filteredSales.forEach(sale => {
    totalRevenueAllTime += sale.total;
    sale.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const unitCost = prod ? prod.cost : item.price * 0.4; // fallback 40% cost
      totalCostAllTime += unitCost * item.quantity;
    });
  });

  const netProfit = totalRevenueAllTime - totalCostAllTime;
  const profitMarginPercent = totalRevenueAllTime > 0 
    ? Math.round((netProfit / totalRevenueAllTime) * 100) 
    : 0;

  // Stock alerts (Items with stock <= minStock)
  const lowStockItems = products.filter(p => p.stock <= p.minStock);

  // 2. Prepare Chart Data for LineChart (Sales Over Time - Last 7 Days)
  const getSalesHistoryData = () => {
    const datesMap: Record<string, number> = {};
    const today = new Date();
    
    // Initialise last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      datesMap[dateStr] = 0;
    }

    // Populate actual sales
    filteredSales.forEach(s => {
      if (datesMap[s.date] !== undefined) {
        datesMap[s.date] += s.total;
      }
    });

    return Object.entries(datesMap).map(([date, total]) => {
      const [,, day] = date.split('-');
      // Format as DD/MM
      const formattedDate = `${day}/${date.split('-')[1]}`;
      return {
        date: formattedDate,
        Ventas: parseFloat(total.toFixed(2))
      };
    });
  };

  const salesHistoryData = getSalesHistoryData();

  // 3. Prepare Chart Data for BarChart (Top Selling Products)
  const getTopSellingProducts = () => {
    const productQuantities: Record<string, { name: string, quantity: number, revenue: number }> = {};
    
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productQuantities[item.productId]) {
          productQuantities[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productQuantities[item.productId].quantity += item.quantity;
        productQuantities[item.productId].revenue += item.total;
      });
    });

    return Object.entries(productQuantities)
      .map(([id, info]) => ({
        id,
        name: info.name.length > 15 ? info.name.substring(0, 15) + '...' : info.name,
        Cantidad: info.quantity,
        Ingresos: parseFloat(info.revenue.toFixed(2))
      }))
      .sort((a, b) => b.Cantidad - a.Cantidad)
      .slice(0, 5); // top 5
  };

  const topProductsData = getTopSellingProducts();

  // 4. Calculate Sales Leaderboard (Vendedores)
  const getLeaderboard = () => {
    const sellerSales: Record<string, { name: string, amount: number, count: number }> = {};
    
    // Reset initial
    employees.forEach(e => {
      if (e.role === 'Vendedor' || e.role === 'Gerente') {
        sellerSales[e.id] = { name: e.name, amount: 0, count: 0 };
      }
    });

    // Populate based on filtered sales
    filteredSales.forEach(s => {
      if (sellerSales[s.employeeId]) {
        sellerSales[s.employeeId].amount += s.total;
        sellerSales[s.employeeId].count += 1;
      }
    });

    return Object.values(sellerSales)
      .sort((a, b) => b.amount - a.amount);
  };

  const sellerLeaderboard = getLeaderboard();

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-[#191b25] tracking-tight">Dashboard 360°</h1>
          <p className="text-xs text-[#434656] mt-0.5">
            Estadísticas consolidadas en tiempo real para <strong className="text-[#003ec7]">{activeBranch}</strong>.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate('pos')}
            className="bg-[#003ec7] hover:bg-[#0052ff] text-white px-4 py-2 rounded-lg font-display text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">point_of_sale</span>
            Nueva Venta (POS)
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Today */}
        <div className="bg-white p-5 rounded-xl border border-[#c3c5d9]/30 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#434656] tracking-wider font-display">Ventas Hoy</span>
            <div className="text-2xl font-black text-[#191b25] font-display">${todayRevenue.toFixed(2)}</div>
            <div className="text-[10px] text-[#006c4b] font-medium flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">calendar_today</span>
              Hoy en sucursal
            </div>
          </div>
          <div className="w-10 h-10 bg-[#003ec7]/10 rounded-xl flex items-center justify-center text-[#003ec7]">
            <span className="material-symbols-outlined text-xl">payments</span>
          </div>
        </div>

        {/* Transactions Today */}
        <div className="bg-white p-5 rounded-xl border border-[#c3c5d9]/30 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#434656] tracking-wider font-display">Transacciones Hoy</span>
            <div className="text-2xl font-black text-[#191b25] font-display">{todayTransactions}</div>
            <div className="text-[10px] text-[#434656] font-medium">Tickets de venta emitidos</div>
          </div>
          <div className="w-10 h-10 bg-[#006c4b]/10 rounded-xl flex items-center justify-center text-[#006c4b]">
            <span className="material-symbols-outlined text-xl">receipt_long</span>
          </div>
        </div>

        {/* Profit Cumulative */}
        <div className="bg-white p-5 rounded-xl border border-[#c3c5d9]/30 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#434656] tracking-wider font-display">Utilidad Estimada</span>
            <div className="text-2xl font-black text-[#191b25] font-display">${netProfit.toFixed(2)}</div>
            <div className="text-[10px] text-[#006c4b] font-medium flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              {profitMarginPercent}% margen de utilidad
            </div>
          </div>
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700">
            <span className="material-symbols-outlined text-xl">paid</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`p-5 rounded-xl border shadow-xs flex items-center justify-between transition-colors ${
          lowStockItems.length > 0 
            ? 'bg-amber-50 border-amber-200 text-amber-900' 
            : 'bg-white border-[#c3c5d9]/30 text-[#191b25]'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#434656] tracking-wider font-display">Alertas de Stock</span>
            <div className={`text-2xl font-black font-display ${lowStockItems.length > 0 ? 'text-amber-700' : 'text-[#191b25]'}`}>
              {lowStockItems.length}
            </div>
            <div className="text-[10px] font-medium">
              {lowStockItems.length > 0 ? 'Productos agotándose' : 'Todo el stock al día'}
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            lowStockItems.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-[#434656]'
          }`}>
            <span className="material-symbols-outlined text-xl">inventory_2</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Line Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-[#c3c5d9]/30 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-display font-bold text-[#191b25] text-sm">Rendimiento de Ventas ($)</h3>
              <p className="text-[10px] text-[#434656]">Ingresos de los últimos 7 días</p>
            </div>
            <span className="text-[10px] font-bold text-[#003ec7] bg-[#003ec7]/10 px-2 py-0.5 rounded-full font-display">Semanal</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#737688" fontSize={11} tickLine={false} />
                <YAxis stroke="#737688" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #c3c5d9' }}
                  labelClassName="font-display font-bold text-xs text-[#191b25]"
                  formatter={(val: number) => [`$${val.toFixed(2)}`, 'Ventas']}
                />
                <Line 
                  type="monotone" 
                  dataKey="Ventas" 
                  stroke="#003ec7" 
                  strokeWidth={3} 
                  activeDot={{ r: 6 }} 
                  dot={{ r: 3, stroke: '#003ec7', strokeWidth: 1, fill: '#ffffff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-[#c3c5d9]/30 shadow-xs">
          <div className="mb-4">
            <h3 className="font-display font-bold text-[#191b25] text-sm">Productos Más Vendidos</h3>
            <p className="text-[10px] text-[#434656]">Top 5 artículos por cantidad despachada</p>
          </div>
          <div className="h-64 w-full">
            {topProductsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false} />
                  <XAxis type="number" stroke="#737688" fontSize={10} hide />
                  <YAxis dataKey="name" type="category" stroke="#191b25" fontSize={10} width={90} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #c3c5d9' }}
                    formatter={(val: number) => [`${val} unidades`, 'Cantidad']}
                  />
                  <Bar dataKey="Cantidad" fill="#003ec7" radius={[0, 4, 4, 0]} barSize={12}>
                    {topProductsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#003ec7' : '#0052ff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">query_stats</span>
                <p className="text-xs text-gray-400 font-bold">Sin datos de ventas</p>
                <p className="text-[10px] text-gray-400 max-w-xs mt-1">Realiza una venta en el POS para ver las estadísticas reflejadas aquí.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Layout Grid: Stock Warnings & Leaderboard & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Low Stock Real-Time Alert list */}
        <div className="bg-white p-5 rounded-xl border border-[#c3c5d9]/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-display font-bold text-[#191b25] text-sm">Alertas de Reposición</h3>
                <p className="text-[10px] text-[#434656]">Productos con niveles de stock bajo el mínimo</p>
              </div>
              {lowStockItems.length > 0 && (
                <span className="px-2 py-0.5 text-[9px] bg-amber-100 text-amber-800 rounded-full font-bold animate-pulse font-display">Crítico</span>
              )}
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {lowStockItems.length > 0 ? (
                lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50/70 border border-amber-100 rounded-lg">
                    <div>
                      <div className="text-xs font-bold text-gray-900 leading-tight">{item.name}</div>
                      <div className="text-[10px] text-[#434656] mt-0.5 flex items-center gap-1">
                        <span>Stock: <strong className="text-amber-700">{item.stock} u.</strong></span>
                        <span className="text-gray-300">|</span>
                        <span>Mínimo: {item.minStock} u.</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => onRestockProduct(item.id, 25)}
                      className="bg-white hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[12px]">add_box</span>
                      +25 u.
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <span className="material-symbols-outlined text-3xl text-emerald-500 mb-2">check_circle</span>
                  <p className="text-xs text-[#006c4b] font-bold">¡Inventario Excelente!</p>
                  <p className="text-[10px] text-gray-400 mt-1">Todos los artículos tienen suficiente stock disponible.</p>
                </div>
              )}
            </div>
          </div>
          {lowStockItems.length > 0 && (
            <button 
              onClick={() => onNavigate('inventory')}
              className="mt-4 w-full bg-slate-50 hover:bg-slate-100 border border-gray-200 py-2 rounded-lg text-xs font-bold text-gray-700 font-display transition-colors text-center cursor-pointer"
            >
              Ir a Inventarios Completos
            </button>
          )}
        </div>

        {/* Seller Leaderboard (Performance) */}
        <div className="bg-white p-5 rounded-xl border border-[#c3c5d9]/30 shadow-xs">
          <div className="mb-4">
            <h3 className="font-display font-bold text-[#191b25] text-sm">Productividad de Vendedores</h3>
            <p className="text-[10px] text-[#434656]">Ventas acumuladas por cada colaborador</p>
          </div>

          <div className="space-y-3">
            {sellerLeaderboard.map((seller, idx) => (
              <div key={seller.name} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-display text-xs font-black ${
                    idx === 0 ? 'bg-[#dde1ff] text-[#003ec7]' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      {seller.name}
                      {idx === 0 && seller.amount > 0 && (
                        <span className="material-symbols-outlined text-amber-500 text-sm">emoji_events</span>
                      )}
                    </div>
                    <div className="text-[9px] text-[#434656]">{seller.count} transacciones finalizadas</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-gray-900">${seller.amount.toFixed(2)}</div>
                  <div className="text-[8px] text-[#006c4b] font-bold">Total Vendido</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Feed */}
        <div className="bg-white p-5 rounded-xl border border-[#c3c5d9]/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-display font-bold text-[#191b25] text-sm">Últimas Transacciones</h3>
                <p className="text-[10px] text-[#434656]">Flujo operativo de ventas recientes</p>
              </div>
              <button 
                onClick={() => onNavigate('sales')}
                className="text-[10px] font-bold text-[#003ec7] hover:underline"
              >
                Ver todas
              </button>
            </div>

            <div className="space-y-3">
              {filteredSales.slice(0, 4).map(sale => (
                <div key={sale.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-[#c3c5d9]/20">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                      <span>{sale.id}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[10px] text-gray-500 font-normal">{sale.items.length} prod.</span>
                    </div>
                    <div className="text-[10px] text-[#434656] flex items-center gap-1">
                      <span className="text-[9px] bg-slate-100 text-slate-700 px-1 py-0.2 rounded">{sale.branch}</span>
                      <span>{sale.customerName || 'Cliente General'}</span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <div className="text-xs font-black text-gray-900">${sale.total.toFixed(2)}</div>
                      <div className="text-[9px] text-gray-400">{sale.date}</div>
                    </div>
                    <button 
                      onClick={() => onSelectSale(sale)}
                      className="w-7 h-7 bg-slate-50 hover:bg-[#dde1ff] text-[#434656] hover:text-[#003ec7] rounded-lg flex items-center justify-center transition-colors border border-gray-100"
                      title="Ver Detalles del Recibo"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
