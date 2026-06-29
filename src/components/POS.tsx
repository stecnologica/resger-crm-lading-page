import React, { useState, useMemo } from 'react';
import { Product, Customer, Employee, SaleItem, Sale } from '../types';

interface POSProps {
  products: Product[];
  customers: Customer[];
  employees: Employee[];
  activeBranch: string;
  onAddSale: (sale: Sale) => void;
  onAddCustomer: (customer: Customer) => void;
  onDeductStock: (productId: string, quantity: number) => void;
}

export default function POS({
  products,
  customers,
  employees,
  activeBranch,
  onAddSale,
  onAddCustomer,
  onDeductStock
}: POSProps) {
  // POS States
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    employees.find(e => e.role === 'Vendedor' || e.role === 'Gerente')?.id || ''
  );
  const [discountPercent, setDiscountPercent] = useState(0); // 0, 5, 10, 15, 20

  // New Customer Modal inside POS
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // Finished Receipt Modal
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  // 1. Get Categories of active products
  const categories = useMemo(() => {
    const list = new Set<string>();
    products.forEach(p => list.add(p.category));
    return ['Todos', ...Array.from(list)];
  }, [products]);

  // 2. Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // 3. Cart Operations
  const handleAddToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    const currentQty = existing ? existing.quantity : 0;

    // Check stock limit
    if (currentQty >= product.stock) {
      alert(`Lo sentimos, solo quedan ${product.stock} unidades disponibles de este producto.`);
      return;
    }

    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      setCart(cart.filter(i => i.product.id !== productId));
      return;
    }

    // Check stock limit
    if (delta > 0 && newQty > item.product.stock) {
      alert(`Límite de inventario alcanzado. Solo hay ${item.product.stock} unidades en stock.`);
      return;
    }

    setCart(cart.map(i => 
      i.product.id === productId 
        ? { ...i, quantity: newQty } 
        : i
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setSelectedCustomerId('');
  };

  // 4. Cart Financial Summary
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  const total = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  // 5. Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Double check stock availability for all cart items
    for (const item of cart) {
      const dbProd = products.find(p => p.id === item.product.id);
      if (!dbProd || dbProd.stock < item.quantity) {
        alert(`Error: El producto '${item.product.name}' ya no cuenta con suficiente stock (${dbProd?.stock || 0} disponibles).`);
        return;
      }
    }

    const customer = customers.find(c => c.id === selectedCustomerId);
    const employee = employees.find(e => e.id === selectedEmployeeId) || employees[0];

    const saleItems: SaleItem[] = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      total: parseFloat((item.product.price * item.quantity).toFixed(2))
    }));

    const newSale: Sale = {
      id: `S-${1000 + Math.floor(Math.random() * 9000)}`, // unique random ID
      date: new Date().toISOString().split('T')[0],
      items: saleItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: discountPercent,
      total: parseFloat(total.toFixed(2)),
      customerId: customer?.id,
      customerName: customer?.name,
      employeeId: employee.id,
      employeeName: employee.name,
      branch: activeBranch === 'Todas las Sucursales' ? 'Sucursal Centro' : activeBranch
    };

    // 1. Process Stock Deductions
    cart.forEach(item => {
      onDeductStock(item.product.id, item.quantity);
    });

    // 2. Record Sale (this updates customer spent and employee totalSales inside App)
    onAddSale(newSale);

    // 3. Open finished invoice modal
    setCompletedSale(newSale);

    // 4. Reset POS Cart
    setCart([]);
    setDiscountPercent(0);
    setSelectedCustomerId('');
  };

  // 6. Fast Inline Customer Creation
  const handleQuickCustomerCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName) return;

    const newCustomer: Customer = {
      id: `C-${Date.now()}`,
      name: newCustName,
      email: newCustEmail || 'sin@correo.com',
      phone: newCustPhone || 'Sin teléfono',
      totalSpent: 0,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    onAddCustomer(newCustomer);
    setSelectedCustomerId(newCustomer.id); // auto-select newly created customer
    
    // reset form
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setShowNewCustomerModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* LEFT: Products Selection Grid (8 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Search & Category Selector */}
        <div className="bg-white p-4 rounded-xl border border-[#c3c5d9]/30 shadow-xs space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined text-[#737688] absolute left-3 top-2.5 text-lg">search</span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre de producto o categoría..."
              className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#003ec7] transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-display whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-[#003ec7] text-white' 
                    : 'bg-slate-100 text-[#434656] hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
          {filteredProducts.map(prod => {
            const isOutOfStock = prod.stock <= 0;
            const isLowStock = prod.stock <= prod.minStock;
            
            return (
              <div 
                key={prod.id}
                onClick={() => !isOutOfStock && handleAddToCart(prod)}
                className={`bg-white rounded-xl border p-4 flex flex-col justify-between h-44 cursor-pointer transition-all ${
                  isOutOfStock 
                    ? 'opacity-60 border-gray-200 cursor-not-allowed' 
                    : 'border-[#c3c5d9]/30 hover:border-[#003ec7] hover:shadow-md'
                }`}
              >
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400 font-display tracking-wider">{prod.category}</span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full font-display ${
                      isOutOfStock 
                        ? 'bg-gray-100 text-gray-500' 
                        : isLowStock 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isOutOfStock ? 'Agotado' : isLowStock ? `Bajo Stock: ${prod.stock}` : `${prod.stock} u.`}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">{prod.name}</h3>
                  <p className="text-[10px] text-[#434656] line-clamp-2 leading-relaxed">{prod.description}</p>
                </div>
                
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#c3c5d9]/10">
                  <span className="font-display font-black text-sm text-[#003ec7]">${prod.price.toFixed(2)}</span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isOutOfStock 
                      ? 'bg-gray-100 text-gray-400' 
                      : 'bg-[#003ec7]/10 text-[#003ec7] hover:bg-[#003ec7] hover:text-white'
                  }`}>
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="col-span-full bg-white p-12 text-center border border-dashed border-[#c3c5d9] rounded-2xl">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">search_off</span>
              <p className="text-xs text-[#434656] font-bold">No se encontraron productos</p>
              <p className="text-[10px] text-gray-400 mt-1">Prueba cambiando la categoría o término de búsqueda.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Active Cart Checkout Panel (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-xl border border-[#c3c5d9]/30 shadow-xs p-5 flex flex-col justify-between min-h-[500px]">
        <div className="space-y-4">
          
          {/* Header configuration */}
          <div className="pb-3 border-b border-[#c3c5d9]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[9px] uppercase font-bold text-gray-400 font-display tracking-wider">Punto de Venta</span>
              <h2 className="font-display font-black text-sm text-gray-900 leading-tight">Carrito de Compras</h2>
            </div>
            
            {/* Active Branch Label */}
            <div className="text-right">
              <span className="text-[10px] bg-[#003ec7]/10 text-[#003ec7] font-bold px-2 py-1 rounded font-display">
                {activeBranch === 'Todas las Sucursales' ? 'Sucursal Centro' : activeBranch}
              </span>
            </div>
          </div>

          {/* Employee assignment (Seller picker) */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#434656] mb-1 font-display">Vendedor Responsable</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/40 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#003ec7] transition-all"
            >
              {employees.filter(e => e.role === 'Vendedor' || e.role === 'Gerente').map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
              ))}
            </select>
          </div>

          {/* Cart Items List */}
          <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
            {cart.length > 0 ? (
              cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between p-2 bg-[#fbf8ff] rounded-lg border border-gray-100">
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-gray-500">${item.product.price.toFixed(2)} x {item.quantity}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Add / Deduct stock controls */}
                    <div className="flex items-center border border-[#c3c5d9]/40 bg-white rounded-lg">
                      <button 
                        onClick={() => handleUpdateQty(item.product.id, -1)}
                        className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-slate-50 border-r border-gray-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-black text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQty(item.product.id, 1)}
                        className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-slate-50 border-l border-gray-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right w-14 font-display font-black text-xs text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>

                    <button 
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="material-symbols-outlined text-3xl text-gray-300 mb-1">shopping_cart</span>
                <p className="text-xs text-gray-400 font-bold">El carrito está vacío</p>
                <p className="text-[10px] text-gray-400 max-w-[180px] mt-1">Haz clic en los productos para agregarlos al carrito de compras.</p>
              </div>
            )}
          </div>

          {/* Customer Selection or Register inline */}
          <div className="pt-2 border-t border-[#c3c5d9]/10">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] uppercase font-bold text-[#434656] font-display">Asignar Cliente</label>
              <button 
                onClick={() => setShowNewCustomerModal(true)}
                className="text-[10px] text-[#003ec7] font-bold hover:underline flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[11px]">add</span>
                Nuevo Cliente
              </button>
            </div>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/40 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#003ec7] transition-all"
            >
              <option value="">Cliente General (Mostrador)</option>
              {customers.map(cust => (
                <option key={cust.id} value={cust.id}>{cust.name} ({cust.phone})</option>
              ))}
            </select>
          </div>

          {/* Discount Selector */}
          <div className="pt-2 border-t border-[#c3c5d9]/10">
            <label className="block text-[10px] uppercase font-bold text-[#434656] mb-1.5 font-display">Aplicar Descuento</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 5, 10, 15, 20].map(pct => (
                <button
                  key={pct}
                  onClick={() => setDiscountPercent(pct)}
                  className={`py-1 rounded text-xs font-bold transition-all cursor-pointer font-display ${
                    discountPercent === pct 
                      ? 'bg-[#003ec7] text-white' 
                      : 'bg-slate-100 text-[#434656] hover:bg-slate-200'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Totals Summary and Checkout Actions */}
        <div className="mt-6 pt-4 border-t border-[#c3c5d9]/20 space-y-4">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-xs text-[#434656]">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-xs text-[#ba1a1a] font-medium">
                <span>Descuento ({discountPercent}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-gray-900 border-t border-dashed border-[#c3c5d9]/20 pt-1.5">
              <span>Total a Pagar:</span>
              <span className="text-[#003ec7]">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleClearCart}
              disabled={cart.length === 0}
              className="py-3 px-4 border border-[#c3c5d9] rounded-xl text-xs font-bold text-[#434656] hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpiar Carrito
            </button>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="py-3 px-4 bg-[#003ec7] hover:bg-[#0052ff] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">receipt</span>
              Cobrar Venta
            </button>
          </div>
        </div>

      </div>

      {/* MODAL: Add New Customer Quick Form */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c5d9]/40">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-extrabold text-gray-900 text-base">Registrar Nuevo Cliente</h3>
              <button 
                onClick={() => setShowNewCustomerModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleQuickCustomerCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Nombre del Cliente *</label>
                <input 
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="ej. Juan Carlos Pérez"
                  className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Teléfono de Contacto</label>
                <input 
                  type="tel"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="ej. 555-0123"
                  className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434656] mb-1 font-display">Correo Electrónico</label>
                <input 
                  type="email"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  placeholder="ej. juan.perez@correo.com"
                  className="w-full bg-[#fbf8ff] border border-[#c3c5d9]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#003ec7]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowNewCustomerModal(false)}
                  className="w-1/2 py-2.5 border border-[#c3c5d9] text-[#434656] rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#003ec7] hover:bg-[#0052ff] text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Printable Receipt Simulator */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#c3c5d9]/40 relative overflow-hidden">
            
            {/* Header Success Accent banner */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#006c4b]"></div>

            <div className="text-center pb-4 border-b border-dashed border-[#c3c5d9]/30">
              <span className="material-symbols-outlined text-4xl text-[#006c4b] mb-1">check_circle</span>
              <h3 className="font-display font-black text-[#191b25] text-base leading-tight">¡Cobro Exitoso!</h3>
              <p className="text-[10px] text-gray-500 mt-1">Transacción registrada correctamente en el historial</p>
            </div>

            {/* Simulated Ticket layout */}
            <div className="py-4 font-mono text-xs text-gray-800 space-y-4">
              <div className="text-center space-y-1">
                <div className="font-bold text-sm tracking-widest text-black">RESGER CRM</div>
                <div className="text-[9px] text-[#434656]">{completedSale.branch}</div>
                <div className="text-[9px] text-[#434656]">Fecha: {completedSale.date}</div>
                <div className="text-[9px] text-[#434656]">Ticket: {completedSale.id}</div>
              </div>

              <div className="space-y-1 text-[10px] border-y border-dashed border-[#c3c5d9]/30 py-2">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>DESCRIPCIÓN</span>
                  <span>CANT x PRECIO = TOTAL</span>
                </div>
                {completedSale.items.map(item => (
                  <div key={item.productId} className="flex justify-between text-gray-700">
                    <span className="truncate pr-2 max-w-[150px]">{item.name}</span>
                    <span className="shrink-0">{item.quantity} x ${item.price.toFixed(2)} = ${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right text-[11px] font-bold">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>${completedSale.subtotal.toFixed(2)}</span>
                </div>
                {completedSale.discount > 0 && (
                  <div className="flex justify-between text-[#ba1a1a]">
                    <span>Descuento ({completedSale.discount}%):</span>
                    <span>-${((completedSale.subtotal * completedSale.discount) / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-black text-xs pt-1.5 border-t border-dashed border-[#c3c5d9]/30 font-black">
                  <span>TOTAL PAGADO:</span>
                  <span>${completedSale.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-[9px] text-[#434656] pt-2 space-y-1">
                <div>Cliente: {completedSale.customerName || 'Cliente General'}</div>
                <div>Atendido por: {completedSale.employeeName}</div>
                <div className="font-bold tracking-wider pt-2">*** GRACIAS POR SU COMPRA ***</div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => {
                  alert("Simulador de impresora: Ticket enviado a imprimir correctamente.");
                }}
                className="w-1/2 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                Imprimir
              </button>
              <button 
                onClick={() => setCompletedSale(null)}
                className="w-1/2 py-2 bg-[#003ec7] hover:bg-[#0052ff] text-white rounded-lg text-xs font-bold hover:shadow transition-all text-center cursor-pointer"
              >
                Cerrar Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
